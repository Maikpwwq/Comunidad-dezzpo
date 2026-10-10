/**
 * Pre-Registration API Route Handlers (`handlers.ts`)
 *
 * Implements server-side endpoints for:
 * 1. POST /api/v1/pre-registrations (Creation with atomic HMAC reservations)
 * 2. GET /api/v1/pre-registrations/check-early (Early duplicate check without enumeration)
 * 3. POST /api/v1/pre-registrations/:id/moderate (Admin moderation & optimistic concurrency)
 * 4. POST /api/v1/pre-registrations/:id/withdraw (Author withdrawal)
 * 5. GET /api/v1/pre-registrations/my-submissions (Author's list for R12)
 */

import type { Context } from 'hono'
import { adminFirestore } from '@/services/firebase/admin'
import {
    createPreRegistrationSchema,
    moderatePreRegistrationSchema,
} from '@/features/preRegistration/schemas/preRegistration.schema'
import {
    canTransition,
} from '@/features/preRegistration/utils/normalization'
import {
    PRE_REGISTRATION_ENABLED,
    RETENTION_TTL_DAYS,
} from '@config/preRegistration.config'
import { authenticateRequest } from '../auth'
import { checkUserPreRegistrationLimits } from './rateLimit'
import {
    checkEarlyCandidateDuplicate,
    detectInternalRegisteredMatches,
    createReservationKey,
} from './duplicateService'
import { sendModerationNotificationToAuthor } from './notifications'
import type { PreRegistrationStatus } from '@/features/preRegistration/types'

/**
 * POST /api/v1/pre-registrations
 */
export async function createPreRegistrationHandler(c: Context) {
    if (!PRE_REGISTRATION_ENABLED) {
        return c.json(
            { error: 'Por ahora no estamos recibiendo recomendaciones. Vuelve pronto.' },
            503,
        )
    }

    const user = await authenticateRequest(c)
    if (!user) {
        return c.json(
            { error: 'Debes iniciar sesión para recomendar a un profesional.' },
            401,
        )
    }

    let body: unknown
    try {
        body = await c.req.json()
    } catch {
        return c.json({ error: 'Cuerpo de solicitud inválido (JSON esperado).' }, 400)
    }

    const parseResult = createPreRegistrationSchema.safeParse(body)
    if (!parseResult.success) {
        return c.json(
            {
                error: 'Datos de la recomendación inválidos.',
                issues: parseResult.error.issues,
            },
            400,
        )
    }

    const { candidate, consent, idempotencyKey } = parseResult.data

    // Check rate limits & quota
    const limitCheck = await checkUserPreRegistrationLimits(user.uid)
    if (!limitCheck.allowed) {
        return c.json({ error: limitCheck.message }, 429)
    }

    if (!adminFirestore) {
        return c.json({ error: 'Servicio de base de datos no disponible.' }, 500)
    }

    const phoneReservationKey = createReservationKey('phone', candidate.phone)
    const emailReservationKey = createReservationKey('email', candidate.email)

    try {
        const preRegCol = adminFirestore.collection('preRegistrations')
        const resCol = adminFirestore.collection('preRegistrationReservations')

        // Check for idempotency: if user already submitted with this key, return that record
        const existingIdemSnap = await preRegCol
            .where('submittedBy', '==', user.uid)
            .where('idempotencyKey', '==', idempotencyKey)
            .limit(1)
            .get()

        if (!existingIdemSnap.empty) {
            const existingDoc = existingIdemSnap.docs[0]!
            return c.json({
                success: true,
                id: existingDoc.id,
                status: existingDoc.data()?.status || 'pendiente',
                idempotent: true,
            })
        }

        // Run transaction for atomic reservation and creation
        const newDocRef = preRegCol.doc()
        const nowIso = new Date().toISOString()

        // Detect any match against real registered merchants for internal admin visibility
        const internalSignals = await detectInternalRegisteredMatches({
            phoneE164: candidate.phone,
            email: candidate.email,
            normalizedName: candidate.displayName,
        })

        await adminFirestore.runTransaction(async (tx) => {
            const phoneResDoc = await tx.get(resCol.doc(phoneReservationKey))
            const emailResDoc = await tx.get(resCol.doc(emailReservationKey))

            if (phoneResDoc.exists || emailResDoc.exists) {
                throw new Error('DUPLICATE_RESERVATION')
            }

            // Reserve locks
            tx.set(resCol.doc(phoneReservationKey), {
                preRegistrationId: newDocRef.id,
                type: 'phone',
                createdAt: nowIso,
            })

            tx.set(resCol.doc(emailReservationKey), {
                preRegistrationId: newDocRef.id,
                type: 'email',
                createdAt: nowIso,
            })

            // Create pre-registration document
            tx.set(newDocRef, {
                id: newDocRef.id,
                version: 1,
                status: 'pendiente',
                submittedBy: user.uid,
                idempotencyKey,
                candidate: {
                    displayName: candidate.displayName,
                    email: candidate.email,
                    phoneE164: candidate.phone,
                    description: candidate.description,
                    skillIds: candidate.skillIds || [],
                    address: candidate.address || null,
                    website: candidate.website || null,
                },
                consent: {
                    privacyNoticeVersion: consent.privacyNoticeVersion,
                    acceptedAt: nowIso,
                },
                hasPossibleMatch: internalSignals.hasMatch,
                matchedUserId: internalSignals.matchedUserId || null,
                createdAt: nowIso,
                updatedAt: nowIso,
                purgeAt: null,
            })

            // Create internal admin metadata document
            const metaDocRef = newDocRef.collection('admin_meta').doc('internal')
            tx.set(metaDocRef, {
                id: 'internal',
                preRegistrationId: newDocRef.id,
                internalNotes: [],
                duplicateSignals: {
                    phoneMatchUid: internalSignals.phoneMatchUid || null,
                    emailMatchUid: internalSignals.emailMatchUid || null,
                    nameHomonymCount: 0,
                },
                auditLog: [
                    {
                        timestamp: nowIso,
                        performedBy: user.uid,
                        action: 'creada',
                    },
                ],
            })
        })

        return c.json(
            {
                success: true,
                id: newDocRef.id,
                status: 'pendiente',
            },
            201,
        )
    } catch (err: unknown) {
        const error = err as { message?: string }
        if (error?.message === 'DUPLICATE_RESERVATION') {
            return c.json(
                {
                    error:
                        'Ya existe una recomendación activa para este profesional o sus datos de contacto.',
                    code: 'duplicado_detectado',
                },
                409,
            )
        }

        return c.json({ error: 'Error interno al procesar la recomendación.' }, 500)
    }
}

/**
 * GET /api/v1/pre-registrations/check-early
 */
export async function checkEarlyHandler(c: Context) {
    const name = c.req.query('name') || ''
    if (!name || name.trim().length < 2) {
        return c.json({ success: true, isAvailable: true })
    }

    const user = await authenticateRequest(c)
    const result = await checkEarlyCandidateDuplicate(name, user?.uid)
    return c.json({ success: true, ...result })
}

/**
 * POST /api/v1/pre-registrations/:id/moderate
 */
export async function moderatePreRegistrationHandler(c: Context) {
    const user = await authenticateRequest(c)
    if (!user || !user.isAdmin) {
        return c.json(
            { error: 'Acceso no autorizado. Se requieren permisos de administrador.' },
            403,
        )
    }

    const id = c.req.param('id')
    let body: unknown
    try {
        body = await c.req.json()
    } catch {
        return c.json({ error: 'Cuerpo de solicitud inválido.' }, 400)
    }

    const parseResult = moderatePreRegistrationSchema.safeParse({
        id,
        ...(typeof body === 'object' && body !== null ? body : {}),
    })

    if (!parseResult.success) {
        return c.json(
            {
                error: 'Carga de moderación inválida.',
                issues: parseResult.error.issues,
            },
            400,
        )
    }

    const { expectedVersion, action } = parseResult.data

    if (!adminFirestore) {
        return c.json({ error: 'Base de datos no disponible.' }, 500)
    }

    const docRef = adminFirestore.collection('preRegistrations').doc(id)
    const resCol = adminFirestore.collection('preRegistrationReservations')
    const now = new Date()
    const nowIso = now.toISOString()
    const purgeIso = new Date(
        now.getTime() + RETENTION_TTL_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString()

    try {
        const txOutcome = await adminFirestore.runTransaction(async (tx) => {
            const snap = await tx.get(docRef)
            if (!snap.exists) {
                throw new Error('NOT_FOUND')
            }

            const current = snap.data()
            if (current.version !== expectedVersion) {
                throw new Error('VERSION_CONFLICT')
            }

            const outcomeAuthorUid = current.submittedBy
            const outcomeCandidateName = current?.candidate?.displayName || 'el profesional'
            let finalStatus: PreRegistrationStatus = current.status

            const phoneResKey = createReservationKey('phone', current?.candidate?.phoneE164 || '')
            const emailResKey = createReservationKey('email', current?.candidate?.email || '')
            const metaDocRef = docRef.collection('admin_meta').doc('internal')
            const metaSnap = await tx.get(metaDocRef)
            const currentAudit = metaSnap.exists ? metaSnap.data()?.auditLog || [] : []

            if (action.type === 'aprobar') {
                if (!canTransition(current.status, 'aprobada')) {
                    throw new Error('INVALID_TRANSITION')
                }

                finalStatus = 'aprobada'
                const updatedCandidate = {
                    ...current.candidate,
                    ...(action.edits || {}),
                }

                tx.update(docRef, {
                    status: 'aprobada',
                    candidate: updatedCandidate,
                    version: current.version + 1,
                    updatedAt: nowIso,
                    decision: {
                        moderatedBy: user.uid,
                        moderatedAt: nowIso,
                        verification: action.verification,
                        internalNote: action.internalNote || null,
                        radarStatus: 'por_contactar',
                    },
                })

                tx.set(
                    metaDocRef,
                    {
                        auditLog: [
                            ...currentAudit,
                            {
                                timestamp: nowIso,
                                performedBy: user.uid,
                                action: 'aprobada',
                                changedFields: Object.keys(action.edits || {}),
                            },
                        ],
                    },
                    { merge: true },
                )
            } else if (action.type === 'rechazar') {
                if (!canTransition(current.status, 'rechazada')) {
                    throw new Error('INVALID_TRANSITION')
                }

                finalStatus = 'rechazada'

                // Release locks atomically
                tx.delete(resCol.doc(phoneResKey))
                tx.delete(resCol.doc(emailResKey))

                tx.update(docRef, {
                    status: 'rechazada',
                    version: current.version + 1,
                    updatedAt: nowIso,
                    purgeAt: purgeIso,
                    reasonCode: action.reasonCode,
                    decision: {
                        moderatedBy: user.uid,
                        moderatedAt: nowIso,
                        internalNote: action.internalNote || null,
                    },
                })

                tx.set(
                    metaDocRef,
                    {
                        auditLog: [
                            ...currentAudit,
                            {
                                timestamp: nowIso,
                                performedBy: user.uid,
                                action: 'rechazada',
                                reasonCode: action.reasonCode,
                            },
                        ],
                    },
                    { merge: true },
                )
            } else if (action.type === 'duplicada') {
                if (!canTransition(current.status, 'duplicada')) {
                    throw new Error('INVALID_TRANSITION')
                }

                finalStatus = 'duplicada'

                // Release locks
                tx.delete(resCol.doc(phoneResKey))
                tx.delete(resCol.doc(emailResKey))

                tx.update(docRef, {
                    status: 'duplicada',
                    version: current.version + 1,
                    updatedAt: nowIso,
                    purgeAt: purgeIso,
                    duplicateOf: action.duplicateOf,
                    decision: {
                        moderatedBy: user.uid,
                        moderatedAt: nowIso,
                        internalNote: action.internalNote || null,
                    },
                })

                tx.set(
                    metaDocRef,
                    {
                        auditLog: [
                            ...currentAudit,
                            {
                                timestamp: nowIso,
                                performedBy: user.uid,
                                action: 'duplicada',
                                duplicateTargetId: action.duplicateOf.targetId,
                            },
                        ],
                    },
                    { merge: true },
                )
            } else if (action.type === 'suprimir') {
                if (!canTransition(current.status, 'retirada')) {
                    throw new Error('INVALID_TRANSITION')
                }

                finalStatus = 'retirada'

                // Release locks
                tx.delete(resCol.doc(phoneResKey))
                tx.delete(resCol.doc(emailResKey))

                // Redact personal information
                tx.update(docRef, {
                    status: 'retirada',
                    version: current.version + 1,
                    updatedAt: nowIso,
                    purgeAt: nowIso,
                    withdrawnBy: action.requestedBy,
                    candidate: {
                        displayName: '[DATOS SUPRIMIDOS POR SOLICITUD DE TITULAR]',
                        email: '[SUPRIMIDO]',
                        phoneE164: '[SUPRIMIDO]',
                        description: '[SUPRIMIDO]',
                    },
                })

                tx.set(
                    metaDocRef,
                    {
                        auditLog: [
                            ...currentAudit,
                            {
                                timestamp: nowIso,
                                performedBy: user.uid,
                                action: 'suprimida',
                                reason: action.reason || null,
                            },
                        ],
                    },
                    { merge: true },
                )
            } else if (action.type === 'actualizar_radar') {
                finalStatus = current.status
                tx.update(docRef, {
                    version: current.version + 1,
                    updatedAt: nowIso,
                    'decision.radarStatus': action.radarStatus,
                })

                tx.set(
                    metaDocRef,
                    {
                        auditLog: [
                            ...currentAudit,
                            {
                                timestamp: nowIso,
                                performedBy: user.uid,
                                action: 'actualizar_radar',
                                radarStatus: action.radarStatus,
                            },
                        ],
                    },
                    { merge: true },
                )
            }

            return {
                outcomeAuthorUid,
                outcomeCandidateName,
                finalStatus,
            }
        })

        // Dispatch notifications to author
        if (
            txOutcome.finalStatus === 'aprobada' ||
            txOutcome.finalStatus === 'rechazada' ||
            txOutcome.finalStatus === 'duplicada'
        ) {
            void sendModerationNotificationToAuthor({
                authorUid: txOutcome.outcomeAuthorUid,
                candidateName: txOutcome.outcomeCandidateName,
                preRegistrationId: id || '',
                outcome: txOutcome.finalStatus,
                ...(action.type === 'rechazar' ? { reasonCode: action.reasonCode } : {}),
            })
        }

        return c.json({
            success: true,
            id,
            status: txOutcome.finalStatus,
            version: expectedVersion + 1,
        })
    } catch (err: unknown) {
        const error = err as { message?: string }
        if (error?.message === 'NOT_FOUND') {
            return c.json({ error: 'Pre-registro no encontrado.' }, 404)
        }
        if (error?.message === 'VERSION_CONFLICT') {
            return c.json(
                {
                    error:
                        'El registro fue modificado por otro administrador. Por favor recarga la página.',
                    code: 'version_obsoleta',
                },
                409,
            )
        }
        if (error?.message === 'INVALID_TRANSITION') {
            return c.json(
                {
                    error: 'Transición de estado inválida para este pre-registro.',
                    code: 'transicion_invalida',
                },
                400,
            )
        }

        return c.json({ error: 'Error interno en la moderación.' }, 500)
    }
}

/**
 * POST /api/v1/pre-registrations/:id/withdraw
 */
export async function withdrawPreRegistrationHandler(c: Context) {
    const user = await authenticateRequest(c)
    if (!user) {
        return c.json({ error: 'Debes iniciar sesión.' }, 401)
    }

    const id = c.req.param('id')
    if (!adminFirestore) {
        return c.json({ error: 'Base de datos no disponible.' }, 500)
    }

    const docRef = adminFirestore.collection('preRegistrations').doc(id)
    const resCol = adminFirestore.collection('preRegistrationReservations')
    const now = new Date()
    const nowIso = now.toISOString()
    const purgeIso = new Date(
        now.getTime() + RETENTION_TTL_DAYS * 24 * 60 * 60 * 1000,
    ).toISOString()

    try {
        await adminFirestore.runTransaction(async (tx) => {
            const snap = await tx.get(docRef)
            if (!snap.exists) {
                throw new Error('NOT_FOUND')
            }

            const current = snap.data()
            if (current.submittedBy !== user.uid) {
                throw new Error('FORBIDDEN')
            }

            if (current.status !== 'pendiente') {
                throw new Error('NOT_PENDING')
            }

            const phoneResKey = createReservationKey('phone', current?.candidate?.phoneE164 || '')
            const emailResKey = createReservationKey('email', current?.candidate?.email || '')

            // Release locks
            tx.delete(resCol.doc(phoneResKey))
            tx.delete(resCol.doc(emailResKey))

            tx.update(docRef, {
                status: 'retirada',
                version: current.version + 1,
                withdrawnBy: 'autor',
                updatedAt: nowIso,
                purgeAt: purgeIso,
            })
        })

        return c.json({ success: true, id, status: 'retirada' })
    } catch (err: unknown) {
        const error = err as { message?: string }
        if (error?.message === 'NOT_FOUND') {
            return c.json({ error: 'Pre-registro no encontrado.' }, 404)
        }
        if (error?.message === 'FORBIDDEN') {
            return c.json({ error: 'No tienes permiso para retirar esta recomendación.' }, 403)
        }
        if (error?.message === 'NOT_PENDING') {
            return c.json({ error: 'Solo se pueden retirar recomendaciones pendientes.' }, 400)
        }

        return c.json({ error: 'Error al retirar la recomendación.' }, 500)
    }
}

/**
 * GET /api/v1/pre-registrations/my-submissions
 */
export async function getMySubmissionsHandler(c: Context) {
    const user = await authenticateRequest(c)
    if (!user) {
        return c.json({ error: 'Debes iniciar sesión.' }, 401)
    }

    if (!adminFirestore) {
        return c.json({ submissions: [] })
    }

    try {
        const snap = await adminFirestore
            .collection('preRegistrations')
            .where('submittedBy', '==', user.uid)
            .get()

        const submissions = snap.docs.map((doc) => {
            const data = doc.data()
            return {
                id: doc.id,
                status: data.status,
                createdAt: data.createdAt,
                candidate: {
                    displayName: data.candidate?.displayName,
                    skillIds: data.candidate?.skillIds || [],
                },
                reasonCode: data.reasonCode || null,
            }
        })

        return c.json({ success: true, submissions })
    } catch {
        return c.json({ success: true, submissions: [] })
    }
}
