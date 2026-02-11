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
import { firestore, isFirebaseAvailable } from '@services/firebase'

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
            email: d.userMail || '—',
            role: 'Propietario',
            status: d.status || 'active',
            lastLogin: d.lastLogin || '—',
            joined: d.userJoined || '—',
        })
    })

    const comSnap = await getDocs(collection(firestore, COMERCIANTES))
    comSnap.forEach((doc) => {
        const d = doc.data()
        users.push({
            uid: doc.id,
            name: d.userName || '—',
            email: d.userMail || '—',
            role: 'Comerciante',
            status: d.status || 'active',
            lastLogin: d.lastLogin || '—',
            joined: d.userJoined || '—',
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
                    email: d.userMail || '—',
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
