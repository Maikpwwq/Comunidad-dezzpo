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
    Timestamp,
    getCountFromServer,
} from 'firebase/firestore'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth, firestore, isFirebaseAvailable } from '@services/firebase'
import { createOpenChannelForUser } from '@services/sendbird/sendbird.service'
import { getPrimaryEmail } from '@utilities/contactUtils'

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
    revenuePotential: number
}

export async function getAdminStats(): Promise<AdminStats> {
    if (!isFirebaseAvailable() || !firestore) {
        return { totalPropietarios: 0, totalComerciantes: 0, totalUsers: 0, newUsersLast30d: 0, revenuePotential: 0 }
    }

    const propCol = collection(firestore, PROPIETARIOS)
    const comCol = collection(firestore, COMERCIANTES)

    // Count users
    const [propSnap, comSnap] = await Promise.all([
        getCountFromServer(propCol),
        getCountFromServer(comCol),
    ])

    const totalPropietarios = propSnap.data().count
    const totalComerciantes = comSnap.data().count

    // New users in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysTs = Timestamp.fromDate(thirtyDaysAgo)

    let newUsersLast30d = 0
    try {
        const recentPropQ = query(propCol, where('userJoined', '>=', thirtyDaysTs))
        const recentComQ = query(comCol, where('userJoined', '>=', thirtyDaysTs))
        const [recentProp, recentCom] = await Promise.all([
            getCountFromServer(recentPropQ),
            getCountFromServer(recentComQ),
        ])
        newUsersLast30d = recentProp.data().count + recentCom.data().count
    } catch {
        // userJoined may be stored as string, fallback to 0
        newUsersLast30d = 0
    }

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
        })
    })

    return users
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
