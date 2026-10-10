/**
 * Pre-Registration Service (`preRegistrationService.ts`)
 *
 * Client-facing service layer for:
 * 1. Submitting new professional recommendations (server-mediated).
 * 2. Early non-enumerating duplicate check.
 * 3. Admin moderation actions with optimistic concurrency.
 * 4. Fetching admin queues with pagination and filters.
 * 5. Async match-flagging upon real merchant registration (R9).
 */

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    getCountFromServer,
    type DocumentData,
    type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { auth, firestore, isFirebaseAvailable } from '@services/firebase'
import { normalizeSearchString } from '@services/validation/duplicateCheckService'
import type {
    PreRegistration,
    PreRegistrationStatus,
    ModerationAction,
    ModerationOutcome,
} from '@/features/preRegistration/types'
import type {
    CreatePreRegistrationInput,
} from '@/features/preRegistration/schemas/preRegistration.schema'
import type { UserFirestoreDocument } from '@services/types'

const PRE_REGISTRATIONS_COLLECTION = 'preRegistrations'

/**
 * Retrieves the current Firebase Auth ID token if available.
 */
async function getIdToken(): Promise<string | null> {
    if (!auth || !auth.currentUser) return null
    try {
        return await auth.currentUser.getIdToken()
    } catch {
        return null
    }
}

/**
 * Submits a new professional recommendation.
 * Server-mediated to enforce rate limits, validation, and HMAC reservation locks.
 */
export async function submitPreRegistration(
    input: CreatePreRegistrationInput,
): Promise<{ success: boolean; id?: string; error?: string; code?: string }> {
    const token = await getIdToken()
    if (!token) {
        return {
            success: false,
            error: 'Debes iniciar sesión para recomendar a un profesional.',
        }
    }

    try {
        const response = await fetch('/api/v1/pre-registrations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(input),
        })

        const data = await response.json()
        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Error al enviar la recomendación.',
                code: data.code,
            }
        }

        return {
            success: true,
            id: data.id,
        }
    } catch (err: unknown) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Error de conexión con el servidor.',
        }
    }
}

/**
 * Checks if a candidate name is already present in the directory or pre-registrations.
 * Strictly avoids leaking private account details or email/phone existence.
 */
export async function checkEarlyCandidateName(name: string): Promise<{
    isAvailable: boolean
    isSelfRecommendation?: boolean
    existsInDirectory?: boolean
    publicProfile?: { userId: string; displayName: string }
    existsInPreRegistrations?: boolean
    message?: string
}> {
    if (!name || name.trim().length < 2) {
        return { isAvailable: true }
    }

    try {
        const token = await getIdToken()
        const headers: Record<string, string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`

        const res = await fetch(
            `/api/v1/pre-registrations/check-early?name=${encodeURIComponent(name.trim())}`,
            { headers },
        )
        if (!res.ok) {
            return { isAvailable: true }
        }
        const data = await res.json()
        return data
    } catch {
        return { isAvailable: true }
    }
}

/**
 * Moderates a pre-registration (Admin action).
 */
export async function moderatePreRegistration(params: {
    id: string
    expectedVersion: number
    action: ModerationAction
}): Promise<{ success: boolean; outcome?: ModerationOutcome; error?: string; code?: string }> {
    const token = await getIdToken()
    if (!token) {
        return { success: false, error: 'Sesión no válida.' }
    }

    try {
        const res = await fetch(`/api/v1/pre-registrations/${params.id}/moderate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                expectedVersion: params.expectedVersion,
                action: params.action,
            }),
        })

        const data = await res.json()
        if (!res.ok) {
            return {
                success: false,
                error: data.error || 'Error al moderar pre-registro.',
                code: data.code,
            }
        }

        return {
            success: true,
            outcome: data,
        }
    } catch (err: unknown) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Error de conexión con el servidor.',
        }
    }
}

/**
 * Withdraws a user's own pending recommendation.
 */
export async function withdrawPreRegistration(
    id: string,
): Promise<{ success: boolean; error?: string }> {
    const token = await getIdToken()
    if (!token) {
        return { success: false, error: 'Sesión no válida.' }
    }

    try {
        const res = await fetch(`/api/v1/pre-registrations/${id}/withdraw`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await res.json()
        if (!res.ok) {
            return {
                success: false,
                error: data.error || 'Error al retirar la recomendación.',
            }
        }

        return { success: true }
    } catch (err: unknown) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Error al retirar la recomendación.',
        }
    }
}

/**
 * Fetches the user's submitted recommendations.
 */
export async function getMyPreRegistrations(): Promise<{
    id: string
    status: PreRegistrationStatus
    createdAt: string
    candidate: { displayName: string; skillIds: string[] }
    reasonCode?: string | null
}[]> {
    const token = await getIdToken()
    if (!token) return []

    try {
        const res = await fetch('/api/v1/pre-registrations/my-submissions', {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return []
        const data = await res.json()
        return data.submissions || []
    } catch {
        return []
    }
}

/**
 * Counts pre-registrations for each status tab cheaply via getCountFromServer.
 */
export async function getPreRegistrationCounts(): Promise<{
    pendientes: number
    aprobadas: number
    rechazadas: number
    duplicadas: number
}> {
    if (!isFirebaseAvailable() || !firestore) {
        return { pendientes: 0, aprobadas: 0, rechazadas: 0, duplicadas: 0 }
    }

    try {
        const colRef = collection(firestore, PRE_REGISTRATIONS_COLLECTION)
        const [pSnap, aSnap, rSnap, dSnap] = await Promise.all([
            getCountFromServer(query(colRef, where('status', '==', 'pendiente'))),
            getCountFromServer(query(colRef, where('status', '==', 'aprobada'))),
            getCountFromServer(query(colRef, where('status', '==', 'rechazada'))),
            getCountFromServer(query(colRef, where('status', '==', 'duplicada'))),
        ])

        return {
            pendientes: pSnap.data().count,
            aprobadas: aSnap.data().count,
            rechazadas: rSnap.data().count,
            duplicadas: dSnap.data().count,
        }
    } catch {
        return { pendientes: 0, aprobadas: 0, rechazadas: 0, duplicadas: 0 }
    }
}

/**
 * Fetches pre-registrations for admin moderation queue.
 */
export async function getAdminPreRegistrations(params: {
    status: PreRegistrationStatus
    hasPossibleMatchOnly?: boolean
}): Promise<PreRegistration[]> {
    if (!isFirebaseAvailable() || !firestore) return []

    try {
        const colRef = collection(firestore, PRE_REGISTRATIONS_COLLECTION)
        let q = query(colRef, where('status', '==', params.status))

        if (params.hasPossibleMatchOnly) {
            q = query(q, where('hasPossibleMatch', '==', true))
        }

        const snapshot = await getDocs(q)
        const list: PreRegistration[] = []
        snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
            list.push({
                id: docSnap.id,
                ...docSnap.data(),
            } as PreRegistration)
        })

        // Sort descending by date in memory (most recent first)
        list.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )

        return list
    } catch {
        return []
    }
}

/**
 * Fetches internal admin metadata for a specific pre-registration.
 */
export async function getPreRegistrationAdminMeta(
    id: string,
): Promise<DocumentData | null> {
    if (!isFirebaseAvailable() || !firestore) return null

    try {
        const colRef = collection(
            firestore,
            PRE_REGISTRATIONS_COLLECTION,
            id,
            'admin_meta',
        )
        const snap = await getDocs(colRef)
        if (snap.empty) return null
        return snap.docs[0]?.data() || null
    } catch {
        return null
    }
}

/**
 * Non-blocking check for real merchant registration (R9 Coexistence).
 * Flags matching active pre-registrations without delaying or blocking user signup.
 */
export async function checkAndFlagPreRegistrationMatch(
    userId: string,
    merchantData: Partial<UserFirestoreDocument>,
): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return

    try {
        const colRef = collection(firestore, PRE_REGISTRATIONS_COLLECTION)
        const activeSnap = await getDocs(
            query(colRef, where('status', 'in', ['pendiente', 'aprobada'])),
        )

        const cleanMerchantName = normalizeSearchString(
            merchantData.userRazonSocial || merchantData.userName || '',
        )
        const cleanPhone = merchantData.userPhone || ''
        const cleanEmail = (merchantData.userMail || '').toLowerCase().trim()

        for (const docSnap of activeSnap.docs) {
            const data = docSnap.data()
            const candidate = data.candidate || {}

            const nameMatch =
                cleanMerchantName &&
                normalizeSearchString(candidate.displayName || '') === cleanMerchantName

            const phoneMatch =
                cleanPhone && candidate.phoneE164 === cleanPhone

            const emailMatch =
                cleanEmail &&
                (candidate.email || '').toLowerCase().trim() === cleanEmail

            if (nameMatch || phoneMatch || emailMatch) {
                await updateDoc(doc(firestore, PRE_REGISTRATIONS_COLLECTION, docSnap.id), {
                    hasPossibleMatch: true,
                    matchedUserId: userId,
                })
            }
        }
    } catch {
        // Non-blocking background check
    }
}
