/**
 * Admin Service
 *
 * Firestore queries for admin dashboard statistics,
 * user management, and identity verification queue.
 */

import {
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    getCountFromServer,
} from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, firestore, isFirebaseAvailable } from '@services/firebase'
import { createOpenChannelForUser } from '@services/sendbird/sendbird.service'
import { getPrimaryEmail } from '@utilities/contactUtils'
import { zoneNames } from '@assets/data/ListadoZonas'

// Collection references
const PROPIETARIOS = 'usersPropietariosResidentes'
const COMERCIANTES = 'usersComerciantesCalificados'
const CONTRACTS = 'contracts'
const DRAFTS = 'drafts'

// ─────────────────────────────────────────────────────────────────────────────
// KPI Stats
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminStats {
    totalPropietarios: number
    totalComerciantes: number
    totalUsers: number
    newUsersLast30d: number
    newPropietariosLast30d?: number
    newComerciantesLast30d?: number
    revenuePotential: number
}

/**
 * Parse date strings or timestamps from user documents in Firestore.
 * Supports:
 * - Firestore Timestamp object (has .toDate())
 * - String 'dd-MM-yyyy' or 'dd/MM/yyyy' (standard in Dezzpo: format(new Date(), 'dd-MM-yyyy'))
 * - String 'yyyy-MM-dd' or 'yyyy/MM/dd'
 * - ISO string or Date-parseable string
 * - Numeric timestamp (seconds or milliseconds)
 */
export function parseUserRegistrationDate(val: unknown): Date | null {
    if (!val) return null
    if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
        return (val as { toDate: () => Date }).toDate()
    }
    if (typeof val === 'number') {
        return val < 10000000000 ? new Date(val * 1000) : new Date(val)
    }
    if (typeof val === 'string') {
        const trimmed = val.trim()
        if (!trimmed || trimmed === '—') return null

        // If string contains 'T', parse directly as ISO
        if (trimmed.includes('T')) {
            const d = new Date(trimmed)
            return isNaN(d.getTime()) ? null : d
        }

        // Match dd-MM-yyyy or dd/MM/yyyy
        const ddmmyyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(trimmed)
        if (ddmmyyyy) {
            const [, dayStr, monthStr, yearStr] = ddmmyyyy
            if (dayStr && monthStr && yearStr) {
                const day = parseInt(dayStr, 10)
                const month = parseInt(monthStr, 10) - 1
                const year = parseInt(yearStr, 10)
                const d = new Date(year, month, day)
                return isNaN(d.getTime()) ? null : d
            }
        }

        // Match yyyy-MM-dd or yyyy/MM/dd
        const yyyymmdd = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(trimmed)
        if (yyyymmdd) {
            const [, yearStr, monthStr, dayStr] = yyyymmdd
            if (yearStr && monthStr && dayStr) {
                const year = parseInt(yearStr, 10)
                const month = parseInt(monthStr, 10) - 1
                const day = parseInt(dayStr, 10)
                const d = new Date(year, month, day)
                return isNaN(d.getTime()) ? null : d
            }
        }

        const parsed = new Date(trimmed)
        return isNaN(parsed.getTime()) ? null : parsed
    }
    return null
}

export async function getAdminStats(): Promise<AdminStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            totalPropietarios: 0,
            totalComerciantes: 0,
            totalUsers: 0,
            newUsersLast30d: 0,
            newPropietariosLast30d: 0,
            newComerciantesLast30d: 0,
            revenuePotential: 0,
        }
    }

    const propCol = collection(firestore, PROPIETARIOS)
    const comCol = collection(firestore, COMERCIANTES)

    // Retrieve user collections to count totals and compute real registration dates
    const [propSnap, comSnap] = await Promise.all([
        getDocs(propCol),
        getDocs(comCol),
    ])

    const totalPropietarios = propSnap.size
    const totalComerciantes = comSnap.size

    // New users in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    let newPropietariosLast30d = 0
    let newComerciantesLast30d = 0

    propSnap.forEach((doc) => {
        const d = doc.data()
        const rawDate = d.userJoined || d.createdAt || d.userCreatedAt
        const parsed = parseUserRegistrationDate(rawDate)
        if (parsed && parsed >= thirtyDaysAgo) {
            newPropietariosLast30d++
        }
    })

    comSnap.forEach((doc) => {
        const d = doc.data()
        const rawDate = d.userJoined || d.createdAt || d.userCreatedAt
        const parsed = parseUserRegistrationDate(rawDate)
        if (parsed && parsed >= thirtyDaysAgo) {
            newComerciantesLast30d++
        }
    })

    const newUsersLast30d = newPropietariosLast30d + newComerciantesLast30d

    // Revenue potential from active drafts
    let revenuePotential = 0
    try {
        const draftsCol = collection(firestore, DRAFTS)
        const activeDraftsQ = query(draftsCol, where('status', '==', 'open'))
        const activeDrafts = await getDocs(activeDraftsQ)
        activeDrafts.forEach((doc) => {
            const data = doc.data()
            revenuePotential += Number(data.draftTotal || data.draftPresupuesto || 0)
        })
    } catch {
        revenuePotential = 0
    }

    return {
        totalPropietarios,
        totalComerciantes,
        totalUsers: totalPropietarios + totalComerciantes,
        newUsersLast30d,
        newPropietariosLast30d,
        newComerciantesLast30d,
        revenuePotential,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Contract Stats
// ─────────────────────────────────────────────────────────────────────────────

export interface ContractStats {
    active: number
    completed: number
    disputed: number
}

export async function getContractStats(): Promise<ContractStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return { active: 0, completed: 0, disputed: 0 }
    }

    const contractsCol = collection(firestore, CONTRACTS)
    const [activeSnap, completedSnap, disputedSnap] = await Promise.all([
        getCountFromServer(query(contractsCol, where('status', '==', 'active'))),
        getCountFromServer(query(contractsCol, where('status', '==', 'completed'))),
        getCountFromServer(query(contractsCol, where('status', '==', 'disputed'))),
    ])

    return {
        active: activeSnap.data().count,
        completed: completedSnap.data().count,
        disputed: disputedSnap.data().count,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminUserRow {
    uid: string
    name: string
    email: string
    role: 'Propietario' | 'Comerciante'
    status: string
    lastLogin: string
    joined: string
    channelUrl?: string
    userCategorie?: string
    userClasification?: string
    userGrade?: string
}

export async function getAllUsers(): Promise<AdminUserRow[]> {
    if (!isFirebaseAvailable() || !firestore) return []

    const users: AdminUserRow[] = []

    const propSnap = await getDocs(collection(firestore, PROPIETARIOS))
    propSnap.forEach((doc) => {
        const d = doc.data()
        users.push({
            uid: doc.id,
            name: d.userName || '—',
            email: getPrimaryEmail(d.emails) || d.userMail || '—',
            role: 'Propietario',
            status: d.status || 'active',
            lastLogin: d.lastLogin || '—',
            joined: d.userJoined || '—',
            channelUrl: d.userChannelUrl || '',
            userCategorie: d.userCategorie || '',
            userClasification: d.userClasification || '',
            userGrade: d.userGrade || '',
        })
    })

    const comSnap = await getDocs(collection(firestore, COMERCIANTES))
    comSnap.forEach((doc) => {
        const d = doc.data()
        users.push({
            uid: doc.id,
            name: d.userName || '—',
            email: getPrimaryEmail(d.emails) || d.userMail || '—',
            role: 'Comerciante',
            status: d.status || 'active',
            lastLogin: d.lastLogin || '—',
            joined: d.userJoined || '—',
            channelUrl: d.userChannelUrl || '',
            userCategorie: d.userCategorie || '',
            userClasification: d.userClasification || '',
            userGrade: d.userGrade || '',
        })
    })

    return users
}

/**
 * Update user classification fields in Firestore (userCategorie, userClasification, userGrade)
 */
export async function updateUserClassification(
    uid: string,
    role: 'Propietario' | 'Comerciante',
    data: {
        userCategorie?: string
        userClasification?: string
        userGrade?: string
    }
): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !uid) return false

    try {
        const collectionName = role === 'Propietario' ? PROPIETARIOS : COMERCIANTES
        const userRef = doc(firestore, collectionName, uid)
        await updateDoc(userRef, {
            userCategorie: data.userCategorie ?? '',
            userClasification: data.userClasification ?? '',
            userGrade: data.userGrade ?? '',
        })
        return true
    } catch (err) {
        console.error('Error updating user classification:', err)
        return false
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Identity Verification Queue
// ─────────────────────────────────────────────────────────────────────────────

export interface VerificationItem {
    uid: string
    name: string
    email: string
    role: 'Propietario' | 'Comerciante'
    docType: string
    docUrl: string
    submittedAt: string
    identification: string
}

export async function getPendingVerifications(): Promise<VerificationItem[]> {
    if (!isFirebaseAvailable() || !firestore) return []

    const items: VerificationItem[] = []

    // Search both collections for pending verifications
    for (const [colName, roleName] of [
        [PROPIETARIOS, 'Propietario'],
        [COMERCIANTES, 'Comerciante'],
    ] as const) {
        try {
            const q = query(
                collection(firestore, colName),
                where('identityVerification.status', '==', 'pending'),
            )
            const snap = await getDocs(q)
            snap.forEach((doc) => {
                const d = doc.data()
                const iv = d.identityVerification || {}
                items.push({
                    uid: doc.id,
                    name: d.userName || '—',
                    email: getPrimaryEmail(d.emails) || d.userMail || '—',
                    role: roleName,
                    docType: iv.docType || '—',
                    docUrl: iv.docUrl || '',
                    submittedAt: iv.submittedAt || '—',
                    identification: d.userIdentification || '—',
                })
            })
        } catch (error) {
            console.error(`Error querying ${colName} verifications:`, error)
        }
    }

    return items
}

export async function updateVerificationStatus(
    uid: string,
    role: 'Propietario' | 'Comerciante',
    status: 'verified' | 'rejected',
    reason?: string,
): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return

    const colName = role === 'Propietario' ? PROPIETARIOS : COMERCIANTES
    const docRef = doc(firestore, colName, uid)

    await updateDoc(docRef, {
        'identityVerification.status': status,
        'identityVerification.reviewedAt': new Date().toISOString(),
        ...(reason ? { 'identityVerification.rejectionReason': reason } : {}),
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin User Actions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sends a password reset email to the specified user.
 * Uses Firebase Auth's sendPasswordResetEmail (client-side).
 */
export async function sendPasswordResetForUser(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase Auth not available')
    await sendPasswordResetEmail(auth, email)
}

/**
 * Bans a user by setting their Firestore status to 'banned'.
 */
export async function banUser(
    uid: string,
    role: 'Propietario' | 'Comerciante',
): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return

    const colName = role === 'Propietario' ? PROPIETARIOS : COMERCIANTES
    const docRef = doc(firestore, colName, uid)

    await updateDoc(docRef, {
        status: 'banned',
        bannedAt: new Date().toISOString(),
    })
}

/**
 * Unbans a user by restoring their Firestore status to 'active'.
 */
export async function unbanUser(
    uid: string,
    role: 'Propietario' | 'Comerciante',
): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return

    const colName = role === 'Propietario' ? PROPIETARIOS : COMERCIANTES
    const docRef = doc(firestore, colName, uid)

    await updateDoc(docRef, {
        status: 'active',
        bannedAt: null,
    })
}

/**
 * Bulk creation of missing Sendbird OpenChannels for Comerciantes.
 */
export async function backfillOpenChannels(): Promise<{ processed: number; errors: number }> {
    if (!isFirebaseAvailable() || !firestore) throw new Error('Firebase no está disponible')

    const comCol = collection(firestore, COMERCIANTES)
    const comSnap = await getDocs(comCol)
    
    let processed = 0
    let errors = 0

    // Fetch in sequence to respect Sendbird rate limits
    for (const d of comSnap.docs) {
        const data = d.data()
        // If they lack a channel URL
        if (!data.userChannelUrl || data.userChannelUrl.trim() === '') {
            try {
                const name = data.userName || 'Usuario'
                const channelUrl = await createOpenChannelForUser(d.id, name)
                
                // Update Firestore
                await updateDoc(d.ref, {
                    userChannelUrl: channelUrl
                })
                
                processed++
                // Quick sleep to respect SDK API limits
                await new Promise(r => setTimeout(r, 200))
            } catch (err) {
                console.error(`Error backfilling channel for ${d.id}:`, err)
                errors++
            }
        }
    }

    return { processed, errors }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Oversight Features (Contracts & Drafts)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminContractRow {
    id: string
    draftId: string
    clientId: string
    providerId: string
    status: string
    agreedAmount: number
    createdAt: string
    channelUrl?: string
}

export async function getAllContracts(): Promise<AdminContractRow[]> {
    if (!isFirebaseAvailable() || !firestore) return []
    const snap = await getDocs(collection(firestore, CONTRACTS))
    return snap.docs.map((doc) => {
        const d = doc.data()
        return {
            id: doc.id,
            draftId: d.draftId || '—',
            clientId: d.clientId || '—',
            providerId: d.providerId || '—',
            status: d.status || 'unknown',
            agreedAmount: Number(d.agreedAmount) || 0,
            createdAt: d.createdAt || '—',
            channelUrl: d.channel_url,
        }
    })
}

export interface AdminDraftRow {
    id: string
    name: string
    ownerId: string
    category: string
    status: string
    budget: number
    createdAt: string
    channelUrl?: string
}

export async function getAllDrafts(): Promise<AdminDraftRow[]> {
    if (!isFirebaseAvailable() || !firestore) return []
    const snap = await getDocs(collection(firestore, DRAFTS))
    return snap.docs.map((doc) => {
        const d = doc.data()
        return {
            id: doc.id,
            name: d.draftName || 'Sin título',
            ownerId: d.draftPropietarioResidente || '—',
            category: d.draftCategory || '—',
            status: d.status || 'open',
            budget: Number(d.draftTotal || d.draftPresupuesto || 0),
            createdAt: d.draftCreatedAt || '—',
            channelUrl: d.channel_url,
        }
    })
}

export async function getQuotesForDraftAdmin(draftId: string) {
    if (!isFirebaseAvailable() || !firestore) return []
    const q = query(
        collection(firestore, 'quotations'),
        where('quotationDraftId', '==', draftId)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ─────────────────────────────────────────────────────────────────────────────
// Geographic & Revenue / Funnel Stats (Phase 3 Monetization)
// ─────────────────────────────────────────────────────────────────────────────

// zoneNames imported from @assets/data/ListadoZonas

export interface FunnelMetric {
    stage: string
    count: number
}

export interface ZoneDensity {
    zone: string
    count: number
}

export interface RevenueStats {
    totalRevenue: number
    platformFees: number
    merchantPayouts: number
    avgContractAmount: number
}

export async function getFunnelMetrics(): Promise<FunnelMetric[]> {
    if (!isFirebaseAvailable() || !firestore) {
        return [
            { stage: 'Búsquedas', count: 0 },
            { stage: 'Vistas Perfil', count: 0 },
            { stage: 'Contactos', count: 0 },
            { stage: 'Pagos Completados', count: 0 }
        ]
    }
    try {
        const funnelCol = collection(firestore, 'funnel_events')
        const [searchSnap, viewSnap, contactSnap, paySnap] = await Promise.all([
            getCountFromServer(query(funnelCol, where('eventName', '==', 'search_services'))),
            getCountFromServer(query(funnelCol, where('eventName', '==', 'view_profile'))),
            getCountFromServer(query(funnelCol, where('eventName', '==', 'initiate_contact'))),
            getCountFromServer(query(funnelCol, where('eventName', '==', 'complete_payment')))
        ])

        return [
            { stage: 'Búsquedas', count: searchSnap.data().count },
            { stage: 'Vistas Perfil', count: viewSnap.data().count },
            { stage: 'Contactos', count: contactSnap.data().count },
            { stage: 'Pagos Completados', count: paySnap.data().count }
        ]
    } catch (err) {
        console.error('Error fetching funnel metrics:', err)
        return [
            { stage: 'Búsquedas', count: 0 },
            { stage: 'Vistas Perfil', count: 0 },
            { stage: 'Contactos', count: 0 },
            { stage: 'Pagos Completados', count: 0 }
        ]
    }
}

export async function getGeographicDensity(): Promise<ZoneDensity[]> {
    if (!isFirebaseAvailable() || !firestore) return []

    try {
        const comCol = collection(firestore, COMERCIANTES)
        const snap = await getDocs(comCol)
        const counts: Record<string, number> = {
            'Otros': 0
        }

        for (const label of Object.values(zoneNames)) {
            if (label !== 'Bogotá') {
                counts[label] = 0
            }
        }

        snap.forEach((doc) => {
            const data = doc.data()
            const address = (data.userDirection || '').toLowerCase()
            const ubication = (data.userUbication || '').toLowerCase()
            const description = (data.userDescription || '').toLowerCase()
            
            let matched = false
            for (const [key, label] of Object.entries(zoneNames)) {
                if (key === 'bogota') continue
                const zoneKeyword = key.replace('bogota-', '').toLowerCase()
                if (address.includes(zoneKeyword) || ubication.includes(zoneKeyword) || description.includes(zoneKeyword)) {
                    counts[label] = (counts[label] || 0) + 1
                    matched = true
                }
            }
            if (!matched) {
                counts['Otros'] = (counts['Otros'] || 0) + 1
            }
        })

        return Object.entries(counts)
            .map(([zone, count]) => ({ zone, count }))
            .filter(z => z.count > 0)
            .sort((a, b) => b.count - a.count)
    } catch (err) {
        console.error('Error getting geographic density:', err)
        return []
    }
}

export async function getPlatformRevenueStats(): Promise<RevenueStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return { totalRevenue: 0, platformFees: 0, merchantPayouts: 0, avgContractAmount: 0 }
    }

    try {
        const contractsCol = collection(firestore, CONTRACTS)
        const q = query(contractsCol, where('status', 'in', ['active', 'completed']))
        const snap = await getDocs(q)
        
        let totalRevenue = 0
        let platformFees = 0
        let merchantPayouts = 0
        let count = 0

        snap.forEach((doc) => {
            const data = doc.data()
            const amount = Number(data.agreedAmount || 0)
            const fee = Number(data.platformFeeAmount || amount * 0.10)
            const payout = Number(data.comerciantePayoutAmount || amount - fee)
            
            totalRevenue += amount
            platformFees += fee
            merchantPayouts += payout
            count++
        })

        return {
            totalRevenue,
            platformFees,
            merchantPayouts,
            avgContractAmount: count > 0 ? totalRevenue / count : 0
        }
    } catch (err) {
        console.error('Error fetching revenue stats:', err)
        return { totalRevenue: 0, platformFees: 0, merchantPayouts: 0, avgContractAmount: 0 }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Untracked Data & Business Funding Model Analytics
// ─────────────────────────────────────────────────────────────────────────────

import { PRICING } from '@config/pricing.config'

export interface CertificationDashboardStats {
    totalRequests: number
    pendingCount: number
    scheduledCount: number
    evaluatedCount: number
    approvedCount: number
    rejectedCount: number
    revenueGenerated: number
}

export interface ReferralDashboardStats {
    totalInvitations: number
    totalRegistered: number
    conversionRate: number
    totalPointsDistributed: number
}

export interface ClassificationBreakdownItem {
    name: string
    propietariosCount: number
    comerciantesCount: number
    total: number
}

export interface UserClassificationBreakdown {
    categories: ClassificationBreakdownItem[]
    classifications: ClassificationBreakdownItem[]
    grades: ClassificationBreakdownItem[]
}

export interface MultiStreamMonetizationStats {
    comerciantesMembershipPotential: number
    certificationsApprovedRevenue: number
    contractEscrowVolume: number
    platformFeeRevenue: number
    totalGrossPlatformVolume: number
}

export async function getCertificationDashboardStats(): Promise<CertificationDashboardStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return { totalRequests: 0, pendingCount: 0, scheduledCount: 0, evaluatedCount: 0, approvedCount: 0, rejectedCount: 0, revenueGenerated: 0 }
    }
    try {
        const colRef = collection(firestore, 'certificationRequests')
        const snap = await getDocs(colRef)
        let pendingCount = 0
        let scheduledCount = 0
        let evaluatedCount = 0
        let approvedCount = 0
        let rejectedCount = 0

        snap.forEach((docSnap) => {
            const data = docSnap.data()
            const st = data.status || 'pending'
            if (st === 'pending' || st === 'pending_payment') pendingCount++
            else if (st === 'scheduled') scheduledCount++
            else if (st === 'evaluated') evaluatedCount++
            else if (st === 'approved') approvedCount++
            else if (st === 'rejected') rejectedCount++
        })

        const totalRequests = snap.size
        const revenueGenerated = approvedCount * (PRICING.CERTIFICATION_SKILLS_VAL?.amount || 290000)

        return {
            totalRequests,
            pendingCount,
            scheduledCount,
            evaluatedCount,
            approvedCount,
            rejectedCount,
            revenueGenerated,
        }
    } catch (err) {
        console.error('Error fetching certification dashboard stats:', err)
        return { totalRequests: 0, pendingCount: 0, scheduledCount: 0, evaluatedCount: 0, approvedCount: 0, rejectedCount: 0, revenueGenerated: 0 }
    }
}

export async function getReferralDashboardStats(): Promise<ReferralDashboardStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return { totalInvitations: 0, totalRegistered: 0, conversionRate: 0, totalPointsDistributed: 0 }
    }
    try {
        const colRef = collection(firestore, 'referrals')
        const snap = await getDocs(colRef)
        const totalInvitations = snap.size
        let totalRegistered = 0
        let totalPointsDistributed = 0

        snap.forEach((docSnap) => {
            const data = docSnap.data()
            if (data.status === 'registered' || data.status === 'contract_completed') {
                totalRegistered++
            }
            totalPointsDistributed += Number(data.pointsEarned || 0)
        })

        const conversionRate = totalInvitations > 0 ? (totalRegistered / totalInvitations) * 100 : 0

        return {
            totalInvitations,
            totalRegistered,
            conversionRate: Number(conversionRate.toFixed(1)),
            totalPointsDistributed,
        }
    } catch (err) {
        console.error('Error fetching referral dashboard stats:', err)
        return { totalInvitations: 0, totalRegistered: 0, conversionRate: 0, totalPointsDistributed: 0 }
    }
}

export async function getUserClassificationBreakdown(): Promise<UserClassificationBreakdown> {
    if (!isFirebaseAvailable() || !firestore) {
        return { categories: [], classifications: [], grades: [] }
    }

    try {
        const propCol = collection(firestore, PROPIETARIOS)
        const comCol = collection(firestore, COMERCIANTES)

        const [propSnap, comSnap] = await Promise.all([
            getDocs(propCol),
            getDocs(comCol),
        ])

        const catCounts: Record<string, { prop: number; com: number }> = {}
        const clasCounts: Record<string, { prop: number; com: number }> = {}
        const gradeCounts: Record<string, { prop: number; com: number }> = {}

        propSnap.forEach((docSnap) => {
            const d = docSnap.data()
            const cat = d.userCategorie || 'Sin Asignar'
            const clas = d.userClasification || 'Sin Asignar'
            const grd = d.userGrade || 'Sin Asignar'

            if (!catCounts[cat]) catCounts[cat] = { prop: 0, com: 0 }
            catCounts[cat].prop++

            if (!clasCounts[clas]) clasCounts[clas] = { prop: 0, com: 0 }
            clasCounts[clas].prop++

            if (!gradeCounts[grd]) gradeCounts[grd] = { prop: 0, com: 0 }
            gradeCounts[grd].prop++
        })

        comSnap.forEach((docSnap) => {
            const d = docSnap.data()
            const cat = d.userCategorie || 'Sin Asignar'
            const clas = d.userClasification || 'Sin Asignar'
            const grd = d.userGrade || 'Sin Asignar'

            if (!catCounts[cat]) catCounts[cat] = { prop: 0, com: 0 }
            catCounts[cat].com++

            if (!clasCounts[clas]) clasCounts[clas] = { prop: 0, com: 0 }
            clasCounts[clas].com++

            if (!gradeCounts[grd]) gradeCounts[grd] = { prop: 0, com: 0 }
            gradeCounts[grd].com++
        })

        const mapToBreakdown = (countsMap: Record<string, { prop: number; com: number }>) =>
            Object.entries(countsMap)
                .map(([name, { prop, com }]) => ({
                    name,
                    propietariosCount: prop,
                    comerciantesCount: com,
                    total: prop + com,
                }))
                .sort((a, b) => b.total - a.total)

        return {
            categories: mapToBreakdown(catCounts),
            classifications: mapToBreakdown(clasCounts),
            grades: mapToBreakdown(gradeCounts),
        }
    } catch (err) {
        console.error('Error fetching user classification breakdown:', err)
        return { categories: [], classifications: [], grades: [] }
    }
}

export async function getMultiStreamMonetization(): Promise<MultiStreamMonetizationStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return { comerciantesMembershipPotential: 0, certificationsApprovedRevenue: 0, contractEscrowVolume: 0, platformFeeRevenue: 0, totalGrossPlatformVolume: 0 }
    }

    try {
        const [adminStats, certStats, revStats] = await Promise.all([
            getAdminStats(),
            getCertificationDashboardStats(),
            getPlatformRevenueStats(),
        ])

        const comerciantesMembershipPotential = adminStats.totalComerciantes * (PRICING.COMERCIANTE_MEMBERSHIP_ANNUAL?.amount || 150000)
        const certificationsApprovedRevenue = certStats.revenueGenerated
        const contractEscrowVolume = revStats.totalRevenue
        const platformFeeRevenue = revStats.platformFees

        const totalGrossPlatformVolume =
            comerciantesMembershipPotential +
            certificationsApprovedRevenue +
            contractEscrowVolume

        return {
            comerciantesMembershipPotential,
            certificationsApprovedRevenue,
            contractEscrowVolume,
            platformFeeRevenue,
            totalGrossPlatformVolume,
        }
    } catch (err) {
        console.error('Error fetching multi-stream monetization:', err)
        return { comerciantesMembershipPotential: 0, certificationsApprovedRevenue: 0, contractEscrowVolume: 0, platformFeeRevenue: 0, totalGrossPlatformVolume: 0 }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Social Media Interceptor & Meta API Stats (Production Firestore Data Layer)
// ─────────────────────────────────────────────────────────────────────────────

export {
    getSocialInterceptionStats,
    getSocialInterceptorStats,
    subscribeToSocialInterceptions,
    EMPTY_SOCIAL_STATS,
    type InterceptionRecord,
    type SocialInterceptorStats,
} from '@services/social'



