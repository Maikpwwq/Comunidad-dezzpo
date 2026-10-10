/**
 * Normalization & Sanitization Utilities (`normalization.ts`)
 *
 * Provides pure functions for input sanitization (NFC/NFKC, control char stripping,
 * zero-width removal, HTML stripping), standardizing emails, Colombian phone E.164
 * formatting, secure URL normalization, and transition enforcement.
 */

import { formatToE164, isValidColombianPhone } from '@services/utils/phoneUtils'
import {
    ALLOWED_TRANSITIONS,
    type PreRegistrationStatus,
} from '../types'

/**
 * Regex for matching zero-width and directional unicode override characters.
 */
const ZERO_WIDTH_AND_DIR_REGEX =
    /[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E\u2066-\u2069]/g

/**
 * Regex for matching control characters (ASCII 0-31 except tab & newline, and ASCII 127).
 */
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g

/**
 * Regex for stripping HTML tags to prevent XSS.
 */
const HTML_TAG_REGEX = /<[^>]*>/g

/**
 * Dangerous URI schemes that must be strictly rejected.
 */
const DISALLOWED_URI_SCHEMES = /^(javascript|data|vbscript|file):/i

/**
 * Sanitizes arbitrary text input by:
 * 1. Stripping zero-width and directional control chars.
 * 2. Stripping non-printable control characters.
 * 3. Stripping HTML tags.
 * 4. Normalizing to Unicode NFC standard.
 * 5. Trimming leading/trailing whitespace.
 */
export function sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return ''

    return input
        .replace(ZERO_WIDTH_AND_DIR_REGEX, '')
        .replace(CONTROL_CHARS_REGEX, '')
        .replace(HTML_TAG_REGEX, '')
        .normalize('NFC')
        .trim()
}

/**
 * Normalizes a professional or company display name:
 * Sanitizes, normalizes to NFC, and collapses duplicate spaces.
 */
export function normalizeCandidateName(name: string): string {
    const sanitized = sanitizeText(name)
    return sanitized.replace(/\s+/g, ' ')
}

/**
 * Normalizes an email address:
 * Sanitizes, applies NFKC normalization, converts to lowercase and trims.
 */
export function normalizeCandidateEmail(email: string): string {
    if (!email || typeof email !== 'string') return ''
    const sanitized = sanitizeText(email)
    return sanitized.normalize('NFKC').toLowerCase().trim()
}

/**
 * Normalizes a Colombian phone number to international E.164 format.
 * Returns empty string if invalid.
 */
export function normalizeCandidatePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') return ''
    const cleaned = sanitizeText(phone)
    if (!isValidColombianPhone(cleaned)) {
        return ''
    }
    return formatToE164(cleaned)
}

/**
 * Normalizes a website or social media URL:
 * - Prepends 'https://' if protocol is omitted.
 * - Rejects non-http/https schemes (e.g. javascript:, data:).
 * - Trims and normalizes NFC.
 */
export function normalizeCandidateWebsite(url: string | undefined): string | undefined {
    if (!url || typeof url !== 'string') return undefined

    const cleaned = sanitizeText(url)
    if (!cleaned) return undefined

    if (DISALLOWED_URI_SCHEMES.test(cleaned)) {
        return undefined
    }

    // If an explicit protocol is present and it is not http:// or https://, reject it
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(cleaned) && !/^https?:\/\//i.test(cleaned)) {
        return undefined
    }

    let normalized = cleaned
    if (!/^https?:\/\//i.test(normalized)) {
        normalized = `https://${normalized}`
    }

    try {
        const parsed = new URL(normalized)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return undefined
        }
        return parsed.toString()
    } catch {
        return undefined
    }
}

/**
 * Determines whether a status transition is permitted by the state machine.
 */
export function canTransition(
    from: PreRegistrationStatus,
    to: PreRegistrationStatus,
): boolean {
    const allowed = ALLOWED_TRANSITIONS[from] as readonly PreRegistrationStatus[]
    return allowed.includes(to)
}

/**
 * Enforces transition validity, throwing an error if invalid.
 */
export function assertValidTransition(
    from: PreRegistrationStatus,
    to: PreRegistrationStatus,
): void {
    if (!canTransition(from, to)) {
        throw new Error(
            `Transición inválida de pre-registro: no se permite cambiar de '${from}' a '${to}'.`,
        )
    }
}
