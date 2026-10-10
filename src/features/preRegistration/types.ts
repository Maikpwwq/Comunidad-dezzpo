/**
 * Types & Domain Model for Pre-Registration (`types.ts`)
 *
 * Defines the immutable state transition graph, candidate data models,
 * discriminated unions for pre-registration lifecycles, and moderation contracts.
 */

import type { RejectionReasonCode } from '@config/preRegistration.config'

/**
 * Valid lifecycle states for a pre-registration.
 */
export type PreRegistrationStatus =
    | 'pendiente'
    | 'aprobada'
    | 'rechazada'
    | 'duplicada'
    | 'retirada'

/**
 * Radar outreach lifecycle for approved pre-registrations (R13).
 */
export type RadarOutreachStatus =
    | 'por_contactar'
    | 'contactada'
    | 'registrada'
    | 'sin_respuesta'

/**
 * Strict transition matrix for pre-registrations.
 * Terminal states (rechazada, duplicada, retirada) have empty transition arrays.
 * An aprobada pre-registration may only transition to 'retirada' upon explicit GDPR/Habeas Data suppression request.
 */
export const ALLOWED_TRANSITIONS = {
    pendiente: ['aprobada', 'rechazada', 'duplicada', 'retirada'],
    aprobada: ['retirada'],
    rechazada: [],
    duplicada: [],
    retirada: [],
} as const satisfies Readonly<Record<PreRegistrationStatus, readonly PreRegistrationStatus[]>>

/**
 * Normalized data of the recommended professional candidate.
 */
export interface PreRegistrationCandidate {
    readonly displayName: string
    readonly email: string
    readonly phoneE164: string
    readonly description: string
    readonly skillIds?: readonly string[]
    readonly address?: string
    readonly website?: string
}

/**
 * Evidence of consent captured at submission time.
 */
export interface PreRegistrationConsent {
    readonly privacyNoticeVersion: string
    readonly acceptedAt: string
}

/**
 * Base pre-registration envelope.
 */
export interface PreRegistrationBase {
    readonly id: string
    readonly version: number
    readonly submittedBy: string
    readonly candidate: PreRegistrationCandidate
    readonly consent: PreRegistrationConsent
    readonly createdAt: string
    readonly updatedAt: string
    readonly hasPossibleMatch?: boolean
    readonly matchedUserId?: string
    readonly purgeAt?: string | null
}

/**
 * Human moderation decision data recorded by an administrator.
 */
export interface ModerationDecision {
    readonly moderatedBy: string
    readonly moderatedAt: string
    readonly verification: {
        readonly contrastedWithSources: true
        readonly sourcesNote?: string
    }
    readonly internalNote?: string
    readonly radarStatus?: RadarOutreachStatus
}

/**
 * Reference to an existing entity when marked as duplicate.
 */
export interface DuplicateRef {
    readonly type: 'merchant_profile' | 'pre_registration'
    readonly targetId: string
    readonly displayName: string
}

/**
 * Discriminated union of pre-registration documents by status.
 */
export type PreRegistration =
    | (PreRegistrationBase & {
          readonly status: 'pendiente'
      })
    | (PreRegistrationBase & {
          readonly status: 'aprobada'
          readonly decision: ModerationDecision
      })
    | (PreRegistrationBase & {
          readonly status: 'rechazada'
          readonly decision: ModerationDecision
          readonly reasonCode: RejectionReasonCode
      })
    | (PreRegistrationBase & {
          readonly status: 'duplicada'
          readonly decision: ModerationDecision
          readonly duplicateOf: DuplicateRef
      })
    | (Omit<PreRegistrationBase, 'candidate'> & {
          readonly status: 'retirada'
          readonly withdrawnBy: 'autor' | 'titular'
          readonly candidate?: Partial<PreRegistrationCandidate>
      })

/**
 * Admin-only metadata and internal signals (stored in `admin_meta/internal`).
 */
export interface PreRegistrationAdminMeta {
    readonly id: string
    readonly preRegistrationId: string
    readonly internalNotes: readonly string[]
    readonly duplicateSignals?: {
        readonly phoneMatchUid?: string | null
        readonly emailMatchUid?: string | null
        readonly nameHomonymCount: number
    }
    readonly auditLog: readonly {
        readonly timestamp: string
        readonly performedBy: string
        readonly action: string
        readonly changedFields?: readonly string[]
        readonly reasonCode?: string
    }[]
}

/**
 * Actions that can be performed by an admin on a pre-registration.
 */
export type ModerationAction =
    | {
          readonly type: 'aprobar'
          readonly edits?: Partial<PreRegistrationCandidate>
          readonly verification: {
              readonly contrastedWithSources: true
              readonly sourcesNote?: string
          }
          readonly internalNote?: string
      }
    | {
          readonly type: 'rechazar'
          readonly reasonCode: RejectionReasonCode
          readonly internalNote?: string
      }
    | {
          readonly type: 'duplicada'
          readonly duplicateOf: DuplicateRef
          readonly internalNote?: string
      }
    | {
          readonly type: 'suprimir'
          readonly requestedBy: 'titular' | 'admin'
          readonly reason?: string
      }
    | {
          readonly type: 'actualizar_radar'
          readonly radarStatus: RadarOutreachStatus
          readonly internalNote?: string
      }

/**
 * Standard error codes for moderation operations.
 */
export type ModerationErrorCode =
    | 'no_autorizado'
    | 'no_encontrado'
    | 'version_obsoleta'
    | 'transicion_invalida'
    | 'duplicado_detectado'
    | 'invalido'

export interface ModerationError {
    readonly code: ModerationErrorCode
    readonly message: string
    readonly details?: unknown
}

/**
 * Result outcome of a moderation operation.
 */
export interface ModerationOutcome {
    readonly id: string
    readonly previousStatus: PreRegistrationStatus
    readonly newStatus: PreRegistrationStatus
    readonly version: number
    readonly timestamp: string
}
