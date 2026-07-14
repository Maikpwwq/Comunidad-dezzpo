/**
 * WhatsApp Smart-Handoff Utility
 *
 * Generates contextual wa.me deep links pre-filled with structured messages
 * derived from platform data (requirements, quotes, profiles).
 *
 * Design note: The `buildHandoffUrl` function returns a URL string.
 * A future server-side tracking endpoint can be injected by replacing
 * the direct wa.me link with a redirect through `/api/v1/handoff/whatsapp`
 * that logs the event before redirecting to wa.me.
 */

import { zoneNames } from '@assets/data/ListadoZonas'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WhatsAppHandoffContext {
    /** Recipient phone number (international format, e.g. +573001234567) */
    phone: string
    /** Name of the person initiating the contact */
    senderName: string
    /** Type of handoff — determines the message template */
    type: 'quote_response' | 'requirement_inquiry' | 'direct_contact'
    /** Optional: Requirement/draft description */
    description?: string | undefined
    /** Optional: Zone slug (will be resolved to human-readable label) */
    zone?: string | undefined
    /** Optional: Category name */
    category?: string | undefined
    /** Optional: Quoted price */
    price?: number | undefined
    /** Optional: Quote or draft ID for reference */
    referenceId?: string | undefined
}

export interface HandoffResult {
    /** The wa.me URL ready to open */
    url: string
    /** The pre-filled message (for display/preview) */
    message: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Strips a phone number to digits only, ensuring it starts with country code.
 * Colombian numbers: +57 → 57...
 */
function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    // If it starts with 0, assume local Colombian and prepend 57
    if (digits.startsWith('0')) return `57${digits.slice(1)}`
    // If it doesn't start with country code, assume Colombian
    if (!digits.startsWith('57') && digits.length === 10) return `57${digits}`
    return digits
}

function resolveZone(zone?: string): string {
    if (!zone) return ''
    return zoneNames[zone] || zone
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount)
}

// ─────────────────────────────────────────────────────────────────────────────
// Message Templates
// ─────────────────────────────────────────────────────────────────────────────

function buildQuoteResponseMessage(ctx: WhatsAppHandoffContext): string {
    const zoneName = resolveZone(ctx.zone)
    const lines = [
        `Hola, soy *${ctx.senderName}* de Dezzpo.`,
        '',
    ]
    if (ctx.description) {
        lines.push(`Te escribo por tu solicitud: _"${ctx.description}"_`)
    }
    if (zoneName) {
        lines.push(`📍 Zona: ${zoneName}`)
    }
    if (ctx.category) {
        lines.push(`🔧 Categoría: ${ctx.category}`)
    }
    if (ctx.price != null) {
        lines.push(`💰 Mi cotización: ${formatCurrency(ctx.price)}`)
    }
    if (ctx.referenceId) {
        lines.push(`📋 Ref: ${ctx.referenceId}`)
    }
    lines.push('', '¿Cuándo te queda bien para coordinar?')
    return lines.join('\n')
}

function buildRequirementInquiryMessage(ctx: WhatsAppHandoffContext): string {
    const zoneName = resolveZone(ctx.zone)
    const lines = [
        `Hola, soy *${ctx.senderName}*.`,
        `Vi tu requerimiento en Dezzpo y me interesa ayudarte.`,
        '',
    ]
    if (ctx.description) {
        lines.push(`📝 _"${ctx.description}"_`)
    }
    if (zoneName) {
        lines.push(`📍 ${zoneName}`)
    }
    if (ctx.category) {
        lines.push(`🔧 ${ctx.category}`)
    }
    lines.push('', '¿Podemos hablar sobre los detalles?')
    return lines.join('\n')
}

function buildDirectContactMessage(ctx: WhatsAppHandoffContext): string {
    return [
        `Hola, soy *${ctx.senderName}* de Dezzpo.`,
        '',
        'Me gustaría hablar contigo sobre un servicio.',
        ctx.category ? `🔧 ${ctx.category}` : '',
        resolveZone(ctx.zone) ? `📍 ${resolveZone(ctx.zone)}` : '',
    ].filter(Boolean).join('\n')
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a WhatsApp handoff URL with a contextual pre-filled message.
 *
 * @example
 * ```tsx
 * const { url } = buildHandoffUrl({
 *   phone: '+573001234567',
 *   senderName: 'Carlos',
 *   type: 'quote_response',
 *   description: 'Arreglo de tubería',
 *   zone: 'suba',
 *   price: 150000,
 * })
 * window.open(url, '_blank')
 * ```
 */
export function buildHandoffUrl(ctx: WhatsAppHandoffContext): HandoffResult {
    let message: string

    switch (ctx.type) {
        case 'quote_response':
            message = buildQuoteResponseMessage(ctx)
            break
        case 'requirement_inquiry':
            message = buildRequirementInquiryMessage(ctx)
            break
        case 'direct_contact':
            message = buildDirectContactMessage(ctx)
            break
    }

    const normalizedPhone = normalizePhone(ctx.phone)
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${normalizedPhone}?text=${encodedMessage}`

    return { url, message }
}
