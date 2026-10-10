/**
 * Zod Validation Schemas for Pre-Registration (`preRegistration.schema.ts`)
 *
 * Universal shared schema for client and server validation.
 * Enforces sanitization, canonical privacy notice version, Colombian phone formats,
 * strict lengths, and typed moderation payloads.
 */

import { z } from 'zod'
import {
    CANONICAL_PRIVACY_NOTICE_VERSION,
    DESCRIPTION_MAX_LENGTH,
    DESCRIPTION_MIN_LENGTH,
    MAX_SKILLS_COUNT,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    ADDRESS_MAX_LENGTH,
    WEBSITE_MAX_LENGTH,
    REJECTION_REASONS,
    type RejectionReasonCode,
} from '@config/preRegistration.config'
import {
    normalizeCandidateEmail,
    normalizeCandidateName,
    normalizeCandidatePhone,
    normalizeCandidateWebsite,
    sanitizeText,
} from '../utils/normalization'

/**
 * Standard RFC 5322 compliant email regex.
 */
const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

/**
 * Valid Colombian mobile in E.164 format: +57 followed by 3 and 9 digits.
 */
const COLOMBIAN_E164_REGEX = /^\+573\d{9}$/

/**
 * Schema for candidate professional data.
 */
export const preRegistrationCandidateSchema = z.object({
    displayName: z
        .string()
        .transform(normalizeCandidateName)
        .pipe(
            z
                .string()
                .min(
                    NAME_MIN_LENGTH,
                    `El nombre debe tener al menos ${NAME_MIN_LENGTH} caracteres.`,
                )
                .max(
                    NAME_MAX_LENGTH,
                    `El nombre no puede superar los ${NAME_MAX_LENGTH} caracteres.`,
                ),
        ),

    email: z
        .string()
        .transform(normalizeCandidateEmail)
        .pipe(
            z
                .string()
                .max(254, 'El correo no puede superar los 254 caracteres.')
                .regex(EMAIL_REGEX, 'Ingresa un correo electrónico válido.'),
        ),

    phone: z
        .string()
        .transform(normalizeCandidatePhone)
        .pipe(
            z
                .string()
                .regex(
                    COLOMBIAN_E164_REGEX,
                    'Ingresa un número de celular colombiano válido (10 dígitos).',
                ),
        ),

    description: z
        .string()
        .transform(sanitizeText)
        .pipe(
            z
                .string()
                .min(
                    DESCRIPTION_MIN_LENGTH,
                    `Cuéntanos a qué se dedica en pocas palabras (mínimo ${DESCRIPTION_MIN_LENGTH} caracteres).`,
                )
                .max(
                    DESCRIPTION_MAX_LENGTH,
                    `La descripción no puede superar los ${DESCRIPTION_MAX_LENGTH} caracteres.`,
                ),
        ),

    skillIds: z
        .array(z.string().min(1))
        .max(
            MAX_SKILLS_COUNT,
            `Puedes seleccionar máximo ${MAX_SKILLS_COUNT} habilidades u oficios.`,
        )
        .optional()
        .default([]),

    address: z
        .string()
        .optional()
        .transform((val) => (val ? sanitizeText(val) : undefined))
        .pipe(
            z
                .string()
                .max(
                    ADDRESS_MAX_LENGTH,
                    `La dirección no puede superar los ${ADDRESS_MAX_LENGTH} caracteres.`,
                )
                .optional(),
        ),

    website: z
        .string()
        .optional()
        .transform(normalizeCandidateWebsite)
        .pipe(
            z
                .string()
                .max(
                    WEBSITE_MAX_LENGTH,
                    `El sitio web no puede superar los ${WEBSITE_MAX_LENGTH} caracteres.`,
                )
                .optional(),
        ),
})

export type PreRegistrationCandidateInput = z.infer<
    typeof preRegistrationCandidateSchema
>

/**
 * Schema for legal privacy consent evidence.
 */
export const preRegistrationConsentSchema = z.object({
    privacyNoticeVersion: z
        .string()
        .refine(
            (val) => val === CANONICAL_PRIVACY_NOTICE_VERSION,
            'La versión del aviso de privacidad no coincide con la versión vigente.',
        ),
    accepted: z
        .boolean()
        .refine(
            (val) => val === true,
            'Debes aceptar el Aviso de Privacidad y Tratamiento de Datos Personales.',
        ),
})

export type PreRegistrationConsentInput = z.infer<
    typeof preRegistrationConsentSchema
>

/**
 * Payload schema for creating a new pre-registration.
 */
export const createPreRegistrationSchema = z.object({
    candidate: preRegistrationCandidateSchema,
    consent: preRegistrationConsentSchema,
    idempotencyKey: z
        .string()
        .min(8, 'Clave de idempotencia inválida.')
        .max(128, 'Clave de idempotencia inválida.'),
})

export type CreatePreRegistrationInput = z.infer<
    typeof createPreRegistrationSchema
>

/**
 * Rejection reason enum schema.
 */
const rejectionReasonKeys = Object.keys(REJECTION_REASONS) as [
    RejectionReasonCode,
    ...RejectionReasonCode[],
]

export const rejectionReasonSchema = z.enum(rejectionReasonKeys)

/**
 * Verification checklist schema for human moderation.
 */
export const moderationVerificationSchema = z.object({
    contrastedWithSources: z
        .boolean()
        .refine(
            (val) => val === true,
            'Es obligatorio confirmar que se contrastaron los datos con fuentes de información en internet.',
        ),
    sourcesNote: z
        .string()
        .max(500, 'Las fuentes consultadas no pueden superar 500 caracteres.')
        .optional(),
})

/**
 * Actions supported in pre-registration moderation.
 */
export const moderationActionSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('aprobar'),
        edits: preRegistrationCandidateSchema.partial().optional(),
        verification: moderationVerificationSchema,
        internalNote: z.string().max(500).optional(),
    }),
    z.object({
        type: z.literal('rechazar'),
        reasonCode: rejectionReasonSchema,
        internalNote: z.string().max(500).optional(),
    }),
    z.object({
        type: z.literal('duplicada'),
        duplicateOf: z.object({
            type: z.enum(['merchant_profile', 'pre_registration']),
            targetId: z.string().min(1),
            displayName: z.string().min(1),
        }),
        internalNote: z.string().max(500).optional(),
    }),
    z.object({
        type: z.literal('suprimir'),
        requestedBy: z.enum(['titular', 'admin']),
        reason: z.string().max(500).optional(),
    }),
    z.object({
        type: z.literal('actualizar_radar'),
        radarStatus: z.enum([
            'por_contactar',
            'contactada',
            'registrada',
            'sin_respuesta',
        ]),
        internalNote: z.string().max(500).optional(),
    }),
])

export type ModerationActionInput = z.infer<typeof moderationActionSchema>

/**
 * Moderation API request envelope schema.
 */
export const moderatePreRegistrationSchema = z.object({
    id: z.string().min(1, 'El ID de pre-registro es obligatorio.'),
    expectedVersion: z
        .number()
        .int()
        .nonnegative('La versión esperada debe ser un número entero mayor o igual a 0.'),
    action: moderationActionSchema,
})

export type ModeratePreRegistrationInput = z.infer<
    typeof moderatePreRegistrationSchema
>
