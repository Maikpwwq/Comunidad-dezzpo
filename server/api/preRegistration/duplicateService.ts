/**
 * Server Duplicate Checking & Uniqueness Logic (`duplicateService.ts`)
 *
 * Implements:
 * 1. Safe early-warning check for client UI (name only, no enumeration).
 * 2. Self-recommendation detection.
 * 3. Authoritative server verification for atomic reservation locks.
 * 4. Match-flagging against real registered merchants without blocking signup (R9).
 */

import { adminFirestore } from '@/services/firebase/admin'
import { normalizeSearchString } from '@/services/validation/duplicateCheckService'
import { createReservationKey } from './hmac'

export interface EarlyCheckResult {
    readonly isAvailable: boolean
    readonly isSelfRecommendation?: boolean
    readonly existsInDirectory?: boolean
    readonly publicProfile?: {
        readonly userId: string
        readonly displayName: string
    }
    readonly existsInPreRegistrations?: boolean
    readonly message?: string
}

/**
 * Performs early name-based check for the recommending user.
 * Strictly avoids leaking email or phone existence.
 */
export async function checkEarlyCandidateDuplicate(
    inputName: string,
    callerUid?: string,
): Promise<EarlyCheckResult> {
    const cleanInput = normalizeSearchString(inputName)
    if (!cleanInput || cleanInput.length < 3 || !adminFirestore) {
        return { isAvailable: true }
    }

    try {
        // 1. Check against active merchant profiles in usersComerciantesCalificados
        const merchantsSnap = await adminFirestore
            .collection('usersComerciantesCalificados')
            .get()

        for (const doc of merchantsSnap.docs) {
            const data = doc.data()
            const nameNorm = normalizeSearchString(data.userName || '')
            const razonNorm = normalizeSearchString(data.userRazonSocial || '')

            if (nameNorm === cleanInput || razonNorm === cleanInput) {
                // Check if this is the caller's own profile
                if (callerUid && doc.id === callerUid) {
                    return {
                        isAvailable: false,
                        isSelfRecommendation: true,
                        message: 'Estás recomendando tu propio perfil.',
                        publicProfile: {
                            userId: doc.id,
                            displayName: data.userRazonSocial || data.userName || inputName,
                        },
                    }
                }

                return {
                    isAvailable: false,
                    existsInDirectory: true,
                    publicProfile: {
                        userId: doc.id,
                        displayName: data.userRazonSocial || data.userName || inputName,
                    },
                    message: 'Este profesional ya está en Dezzpo.',
                }
            }
        }

        // 2. Check against active pre-registrations (pendiente or aprobada)
        const preRegSnap = await adminFirestore
            .collection('preRegistrations')
            .where('status', 'in', ['pendiente', 'aprobada'])
            .get()

        for (const doc of preRegSnap.docs) {
            const data = doc.data()
            const candidateName = data?.candidate?.displayName || ''
            if (normalizeSearchString(candidateName) === cleanInput) {
                return {
                    isAvailable: false,
                    existsInPreRegistrations: true,
                    message:
                        'Ya recibimos una recomendación de este profesional. ¡Gracias!',
                }
            }
        }

        return { isAvailable: true }
    } catch {
        return { isAvailable: true }
    }
}

/**
 * Checks for existing merchant match signals (solely for admin review).
 * Does not expose results to the author.
 */
export async function detectInternalRegisteredMatches(params: {
    readonly phoneE164: string
    readonly email: string
    readonly normalizedName: string
}): Promise<{
    readonly hasMatch: boolean
    readonly matchedUserId?: string
    readonly phoneMatchUid?: string | null
    readonly emailMatchUid?: string | null
}> {
    if (!adminFirestore) {
        return { hasMatch: false }
    }

    try {
        const merchantsSnap = await adminFirestore
            .collection('usersComerciantesCalificados')
            .get()

        let phoneMatchUid: string | null = null
        let emailMatchUid: string | null = null
        let nameMatchUid: string | null = null

        for (const doc of merchantsSnap.docs) {
            const data = doc.data()
            if (data.userPhone && data.userPhone === params.phoneE164) {
                phoneMatchUid = doc.id
            }
            if (data.userMail && data.userMail.toLowerCase() === params.email) {
                emailMatchUid = doc.id
            }
            const nameNorm = normalizeSearchString(data.userName || '')
            const razonNorm = normalizeSearchString(data.userRazonSocial || '')
            if (nameNorm === params.normalizedName || razonNorm === params.normalizedName) {
                nameMatchUid = doc.id
            }
        }

        const resolvedUid = phoneMatchUid || emailMatchUid || nameMatchUid
        return {
            hasMatch: Boolean(resolvedUid),
            ...(resolvedUid ? { matchedUserId: resolvedUid } : {}),
            phoneMatchUid: phoneMatchUid || null,
            emailMatchUid: emailMatchUid || null,
        }
    } catch {
        return { hasMatch: false }
    }
}

export { createReservationKey }
