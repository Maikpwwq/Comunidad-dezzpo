/**
 * Pre-Registration Configuration (`preRegistration.config.ts`)
 *
 * Centralized business constants, rate limits, data retention rules,
 * validation boundaries, and user-facing notification copies for
 * the professional recommendation and pre-registration workflow.
 */

/**
 * Maximum submissions allowed per user within a rolling 24-hour window.
 */
export const MAX_SUBMISSIONS_PER_24H = 5

/**
 * Maximum concurrent pending pre-registrations allowed per user.
 */
export const MAX_PENDING_PER_USER = 5

/**
 * Candidate description length boundaries.
 */
export const DESCRIPTION_MIN_LENGTH = 15
export const DESCRIPTION_MAX_LENGTH = 300

/**
 * Candidate display name boundaries.
 */
export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 100

/**
 * Candidate address max length.
 */
export const ADDRESS_MAX_LENGTH = 200

/**
 * Candidate website/social max length.
 */
export const WEBSITE_MAX_LENGTH = 500

/**
 * Maximum number of skill/category tags selectable per recommendation.
 */
export const MAX_SKILLS_COUNT = 5

/**
 * Data retention policy: Days after which personal data in terminal
 * pre-registrations (rechazada, duplicada, retirada) is permanently purged via TTL.
 */
export const RETENTION_TTL_DAYS = 30

/**
 * Current canonical privacy notice version required for legal consent.
 * Must match the active version in `src/assets/data/legalDocuments.ts`.
 */
export const CANONICAL_PRIVACY_NOTICE_VERSION = 'V1.1' as const

/**
 * Emergency operational kill-switch.
 * When false, the recommendation endpoint rejects submissions with a friendly notice.
 */
export const PRE_REGISTRATION_ENABLED = true

/**
 * Standard closed list of rejection reason codes and their internal explanations.
 */
export const REJECTION_REASONS = {
    informacion_insuficiente:
        'Información insuficiente para verificar la actividad comercial o profesional.',
    no_verificable:
        'No fue posible verificar la identidad o datos de contacto a través de fuentes públicas.',
    no_cumple_criterios:
        'La actividad u oficio no corresponde a los sectores de construcción, hábitat o mantenimiento de Dezzpo.',
    contenido_inapropiado:
        'El contenido enviado infringe los términos y políticas comunitarias.',
    otro: 'Otro motivo verificado por el equipo de moderación.',
} as const

export type RejectionReasonCode = keyof typeof REJECTION_REASONS

/**
 * Friendly user-facing labels for rejection reasons displayed in author notifications.
 * Strictly avoids exposing internal moderation notes or sensitive details.
 */
export const REJECTION_REASON_LABELS: Readonly<Record<RejectionReasonCode, string>> = {
    informacion_insuficiente: 'Información insuficiente para verificación',
    no_verificable: 'Datos no contrastables en fuentes públicas',
    no_cumple_criterios: 'Actividad fuera de la cobertura de la plataforma',
    contenido_inapropiado: 'Contenido no admitido por políticas comunitarias',
    otro: 'No cumple con los criterios de moderación',
} as const

/**
 * User-facing copy for author notifications.
 */
export const NOTIFICATION_TEMPLATES = {
    approved: (name: string): string =>
        `Revisamos tu recomendación: pronto contactaremos a ${name}. ¡Gracias por ayudar a crecer la comunidad!`,
    rejected: (name: string, friendlyReason: string): string =>
        `No pudimos aceptar tu recomendación de ${name}. Motivo: ${friendlyReason}.`,
    duplicate: (name: string): string =>
        `${name} ya forma parte de Dezzpo o ya había sido recomendado. ¡Gracias!`,
} as const

/**
 * Outreach contact template for Dezzpo team to contact recommended professionals.
 *
 * [BORRADOR PARA REVISIÓN LEGAL]
 * Cumple con principios de transparencia de la Ley 1581 de 2012 (Habeas Data):
 * informa el origen de los datos, enlaza la política y proporciona canal directo de supresión.
 */
export const OUTREACH_MESSAGE_TEMPLATE = (candidateName: string): string =>
    `Hola ${candidateName}, un miembro de la comunidad Dezzpo recomendó tus servicios profesionales. ` +
    `Te invitamos a conocer nuestra red y activar tu perfil profesional verificado en: https://dezzpo.com/registro?ref=radar . ` +
    `Tratamos tus datos bajo nuestro Aviso de Privacidad disponible en: https://dezzpo.com/legal?doc=aviso-privacidad . ` +
    `Si no deseas recibir más comunicaciones o solicitas la supresión de tus datos de contacto, responde a este mensaje con la palabra SUPRIMIR.`
