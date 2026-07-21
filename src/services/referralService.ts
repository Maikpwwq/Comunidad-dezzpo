/**
 * Referral Service
 *
 * Handles database operations for:
 * - Referral Code generation per user
 * - Sign-up attribution & relationship linking
 * - Referral points awarding & stats calculation
 * - Reward redemption (coupons & benefits)
 * - Admin referral analytics
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
} from 'firebase/firestore'
import { firestore } from './firebase'
import type { ReferralRecord, UserFirestoreDocument } from './types'
import { REWARD_CATALOG, REFERRAL_POINT_RULES } from '@config/referrals.config'

const REFERRALS_COLLECTION = 'referrals'
const REDEMPTIONS_COLLECTION = 'referralRedemptions'
const PROPIETARIOS_COLLECTION = 'usersPropietariosResidentes'
const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'


/**
 * Finds user document across both Propietario and Comerciante collections
 */
async function findUserDoc(userId: string): Promise<{ ref: any; data: UserFirestoreDocument; collectionName: string } | null> {
    if (!firestore) return null

    // Try comerciantes first
    const comRef = doc(firestore, COMERCIANTES_COLLECTION, userId)
    const comSnap = await getDoc(comRef)
    if (comSnap.exists()) {
        return { ref: comRef, data: comSnap.data() as UserFirestoreDocument, collectionName: COMERCIANTES_COLLECTION }
    }

    // Try propietarios
    const propRef = doc(firestore, PROPIETARIOS_COLLECTION, userId)
    const propSnap = await getDoc(propRef)
    if (propSnap.exists()) {
        return { ref: propRef, data: propSnap.data() as UserFirestoreDocument, collectionName: PROPIETARIOS_COLLECTION }
    }

    return null
}

/**
 * Generates or retrieves unique referral code for a user
 */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
    if (!firestore || !userId) return ''

    try {
        const userMatch = await findUserDoc(userId)
        if (!userMatch) return ''

        if (userMatch.data.referralCode) {
            return userMatch.data.referralCode
        }

        // Generate clean unique code e.g. DEZZPO-A8K9
        const shortId = userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()
        const randomPart = Math.floor(100 + Math.random() * 900)
        const generatedCode = `DEZZPO-${shortId}${randomPart}`

        await updateDoc(userMatch.ref, {
            referralCode: generatedCode,
            referralStats: userMatch.data.referralStats || {
                totalInvited: 0,
                activeReferrals: 0,
                pointsBalance: 0,
                totalPointsEarned: 0,
            },
        })

        return generatedCode
    } catch (error) {
        console.error('Error getting/creating referral code:', error)
        return ''
    }
}

/**
 * Tracks new user registration via referral code
 * Awards +50 points to referrer immediately upon sign-up.
 */
export async function trackReferralRegistration(
    newUserId: string,
    newUserName: string,
    newUserRole: number,
    refCode: string
): Promise<boolean> {
    if (!firestore || !refCode || !newUserId) return false

    try {
        // Find referrer by referralCode
        let referrerMatch: { ref: any; data: UserFirestoreDocument } | null = null

        const qCom = query(collection(firestore, COMERCIANTES_COLLECTION), where('referralCode', '==', refCode.trim()))
        const snapCom = await getDocs(qCom)
        if (!snapCom.empty && snapCom.docs[0]) {
            referrerMatch = { ref: snapCom.docs[0].ref, data: snapCom.docs[0].data() as UserFirestoreDocument }
        } else {
            const qProp = query(collection(firestore, PROPIETARIOS_COLLECTION), where('referralCode', '==', refCode.trim()))
            const snapProp = await getDocs(qProp)
            if (!snapProp.empty && snapProp.docs[0]) {
                referrerMatch = { ref: snapProp.docs[0].ref, data: snapProp.docs[0].data() as UserFirestoreDocument }
            }
        }

        if (!referrerMatch) {
            console.warn(`Referral code ${refCode} not found in database.`)
            return false
        }

        const referrerId = referrerMatch.data.userId || referrerMatch.ref.id
        const referrerName = referrerMatch.data.userName || referrerMatch.data.userRazonSocial || 'Usuario Dezzpo'

        // Prevent self-referral
        if (referrerId === newUserId) return false

        // Update newly registered user with referredBy
        const newUserMatch = await findUserDoc(newUserId)
        if (newUserMatch) {
            await updateDoc(newUserMatch.ref, { referredBy: referrerId })
        }

        // Add referral audit record
        const colRef = collection(firestore, REFERRALS_COLLECTION)
        const docRef = await addDoc(colRef, {
            referrerId,
            referrerName,
            referredUserId: newUserId,
            referredUserName: newUserName || 'Nuevo Usuario',
            referredUserRole: newUserRole,
            refCodeUsed: refCode,
            status: 'pending',
            pointsEarned: REFERRAL_POINT_RULES.POINTS_PER_REGISTRATION,
            createdAt: new Date().toISOString(),
        })
        await updateDoc(docRef, { referralId: docRef.id })

        // Award points to referrer
        const currentStats = referrerMatch.data.referralStats || {
            totalInvited: 0,
            activeReferrals: 0,
            pointsBalance: 0,
            totalPointsEarned: 0,
        }

        await updateDoc(referrerMatch.ref, {
            referralStats: {
                totalInvited: (currentStats.totalInvited || 0) + 1,
                activeReferrals: currentStats.activeReferrals || 0,
                pointsBalance: (currentStats.pointsBalance || 0) + REFERRAL_POINT_RULES.POINTS_PER_REGISTRATION,
                totalPointsEarned: (currentStats.totalPointsEarned || 0) + REFERRAL_POINT_RULES.POINTS_PER_REGISTRATION,
            },
        })


        return true
    } catch (error) {
        console.error('Error tracking referral registration:', error)
        return false
    }
}

/**
 * Invoked when a referred user completes a contract/service
 * Awards an additional +200 points to the referrer.
 */
export async function trackReferralContractCompleted(userId: string): Promise<void> {
    if (!firestore || !userId) return

    try {
        const userMatch = await findUserDoc(userId)
        if (!userMatch || !userMatch.data.referredBy) return

        const referrerId = userMatch.data.referredBy
        const colRef = collection(firestore, REFERRALS_COLLECTION)
        const q = query(
            colRef,
            where('referredUserId', '==', userId),
            where('status', '==', 'pending')
        )
        const snapshot = await getDocs(q)
        if (snapshot.empty) return

        const refDoc = snapshot.docs[0]
        if (!refDoc) return

        // Mark referral completed
        await updateDoc(refDoc.ref, {
            status: 'completed',
            pointsEarned: (refDoc.data().pointsEarned || REFERRAL_POINT_RULES.POINTS_PER_REGISTRATION) + REFERRAL_POINT_RULES.POINTS_PER_CONTRACT_COMPLETED,
            completedAt: new Date().toISOString(),
        })

        // Award points to referrer
        const referrerMatch = await findUserDoc(referrerId)
        if (referrerMatch) {
            const currentStats = referrerMatch.data.referralStats || {
                totalInvited: 0,
                activeReferrals: 0,
                pointsBalance: 0,
                totalPointsEarned: 0,
            }
            await updateDoc(referrerMatch.ref, {
                referralStats: {
                    totalInvited: currentStats.totalInvited || 0,
                    activeReferrals: (currentStats.activeReferrals || 0) + 1,
                    pointsBalance: (currentStats.pointsBalance || 0) + REFERRAL_POINT_RULES.POINTS_PER_CONTRACT_COMPLETED,
                    totalPointsEarned: (currentStats.totalPointsEarned || 0) + REFERRAL_POINT_RULES.POINTS_PER_CONTRACT_COMPLETED,
                },
            })
        }

    } catch (error) {
        console.error('Error tracking completed referral contract:', error)
    }
}

/**
 * Gets referral summary for user dashboard
 */
export async function getReferralSummary(userId: string): Promise<{
    referralCode: string
    stats: NonNullable<UserFirestoreDocument['referralStats']>
    referralsList: ReferralRecord[]
}> {
    const defaultStats = { totalInvited: 0, activeReferrals: 0, pointsBalance: 0, totalPointsEarned: 0 }
    if (!firestore || !userId) {
        return { referralCode: '', stats: defaultStats, referralsList: [] }
    }

    try {
        const code = await getOrCreateReferralCode(userId)
        const userMatch = await findUserDoc(userId)
        const stats = userMatch?.data.referralStats || defaultStats

        // Get referrals list
        const colRef = collection(firestore, REFERRALS_COLLECTION)
        const q = query(colRef, where('referrerId', '==', userId), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const referralsList = snapshot.docs.map((d) => d.data() as ReferralRecord)

        return { referralCode: code, stats, referralsList }
    } catch (error) {
        console.error('Error getting referral summary:', error)
        return { referralCode: '', stats: defaultStats, referralsList: [] }
    }
}

/**
 * Redeems referral points for a reward
 */
export async function redeemReward(
    userId: string,
    rewardId: 'discount_membership' | 'discount_certification' | 'featured_month' | 'discount_inspection'
): Promise<{ success: boolean; couponCode?: string; message: string }> {
    if (!firestore || !userId) return { success: false, message: 'Usuario no válido' }

    try {
        const reward = REWARD_CATALOG.find((r) => r.id === rewardId)
        if (!reward) return { success: false, message: 'Recompensa no encontrada' }

        const userMatch = await findUserDoc(userId)
        if (!userMatch) return { success: false, message: 'Perfil de usuario no encontrado' }

        const currentStats = userMatch.data.referralStats || {
            totalInvited: 0,
            activeReferrals: 0,
            pointsBalance: 0,
            totalPointsEarned: 0,
        }

        if ((currentStats.pointsBalance || 0) < reward.pointsCost) {
            return {
                success: false,
                message: `Puntos insuficientes. Necesitas ${reward.pointsCost} pts y tienes ${currentStats.pointsBalance || 0} pts.`,
            }
        }

        // Deduct points
        const newBalance = currentStats.pointsBalance - reward.pointsCost
        await updateDoc(userMatch.ref, {
            'referralStats.pointsBalance': newBalance,
        })

        // Generate coupon code
        const couponCode = `DEZZPO-${rewardId.slice(0, 5).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

        // Save redemption doc
        const colRef = collection(firestore, REDEMPTIONS_COLLECTION)
        const docRef = await addDoc(colRef, {
            userId,
            rewardId,
            rewardName: reward.name,
            pointsSpent: reward.pointsCost,
            couponCode,
            status: 'active',
            createdAt: new Date().toISOString(),
        })
        await updateDoc(docRef, { redemptionId: docRef.id })

        return {
            success: true,
            couponCode,
            message: `¡Canje exitoso! Tu código de beneficio es ${couponCode}`,
        }
    } catch (error) {
        console.error('Error redeeming reward:', error)
        return { success: false, message: 'Error interno al procesar el canje' }
    }
}

/**
 * Admin: Get all referral activities across the platform
 */
export async function getAllReferralsForAdmin(): Promise<ReferralRecord[]> {
    if (!firestore) return []

    try {
        const colRef = collection(firestore, REFERRALS_COLLECTION)
        const q = query(colRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((d) => d.data() as ReferralRecord)
    } catch (error) {
        console.error('Error fetching all referrals for admin:', error)
        return []
    }
}
