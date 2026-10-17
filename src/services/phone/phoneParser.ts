/**
 * Pure Domain Phone Parser, Normalizer & Formatter
 *
 * Implements ITU-T E.164 and CRC Resolución 5886 de 2020 (Colombia).
 * Zero I/O, zero external dependencies, 100% total (never throws).
 */

import {
    DEFAULT_COUNTRY_CODE,
    COLOMBIA_NATIONAL_LENGTH,
    COLOMBIA_MOBILE_PREFIX,
    COLOMBIA_VALID_FIXED_PREFIXES,
    COLOMBIA_TRANSPOSED_PREFIX_MAP,
    E164_MAX_TOTAL_DIGITS,
    E164_MIN_NATIONAL_DIGITS,
    KNOWN_COUNTRY_CODES,
    PHONE_MESSAGES,
} from './phone.config'
import type { PhoneParts, PhoneParse } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// Normalization Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps Unicode fullwidth digits (０-９) and Arabic-Indic digits (٠-٩) to ASCII '0'-'9'.
 */
function toAsciiDigits(str: string): string {
    return str
        // Fullwidth digits 0xFF10 - 0xFF19
        .replace(/[\uFF10-\uFF19]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 48))
        // Arabic-Indic digits 0x0660 - 0x0669
        .replace(/[\u0660-\u0669]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x0660 + 48))
        // Eastern Arabic-Indic digits 0x06F0 - 0x06F9
        .replace(/[\u06F0-\u06F9]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x06F0 + 48))
}

/**
 * Strips zero-width chars, NBSP, bidirectional formatting marks, and label prefixes.
 */
function cleanRawString(input: string): string {
    return toAsciiDigits(input)
        // Remove zero-width spaces, BOM, NBSP, direction marks
        .replace(/[\u200B-\u200D\uFEFF\u00A0\u200E\u200F\u202A-\u202E]/g, '')
        // Strip common prefix noise like "Tel:", "Cel:", "WhatsApp:", "WA:"
        .replace(/^(tel(?:[ée]fono)?|cel(?:ular)?|whatsapp|wa|movil|m[oó]vil)[\s.:-]*/i, '')
        // Trim whitespace
        .trim()
}

/**
 * Finds the matching ITU-T country code prefix in a digits string (e.g. '57320...' -> '57').
 * Prioritizes 3-digit, then 2-digit, then 1-digit matches.
 */
function matchCountryCode(digits: string): string | null {
    if (digits.length >= 3) {
        const c3 = digits.slice(0, 3)
        if (KNOWN_COUNTRY_CODES.includes(c3)) return c3
    }
    if (digits.length >= 2) {
        const c2 = digits.slice(0, 2)
        if (KNOWN_COUNTRY_CODES.includes(c2)) return c2
    }
    if (digits.length >= 1) {
        const c1 = digits.slice(0, 1)
        if (KNOWN_COUNTRY_CODES.includes(c1)) return c1
    }
    return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Parser
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Total parser for telephone and WhatsApp inputs.
 * Strictly adheres to Invariant I1: NEVER throws under any input (null, objects, huge strings).
 *
 * @param raw - Any raw value (string, number, null, undefined, object)
 * @param options - Configuration options, including default country code (default: '+57')
 */
export function parsePhone(
    raw: unknown,
    options?: { readonly defaultCountry?: string }
): PhoneParse {
    const defaultCountry = (options?.defaultCountry || DEFAULT_COUNTRY_CODE).trim()
    const defaultCodeFormatted = defaultCountry.startsWith('+') ? defaultCountry : `+${defaultCountry}`
    const defaultCodeDigits = defaultCodeFormatted.replace(/\D/g, '')

    // Total type safety: normalize raw into string representation
    if (raw === null || raw === undefined) {
        return { status: 'vacio', parts: null, raw: '' }
    }

    let rawStr: string
    if (typeof raw === 'string') {
        rawStr = raw
    } else if (typeof raw === 'number' || typeof raw === 'bigint') {
        rawStr = String(raw)
    } else {
        // Objects, arrays, booleans, functions -> treat as unrecognized format
        let safeRepr = ''
        try {
            safeRepr = String(raw)
        } catch {
            safeRepr = ''
        }
        return {
            status: 'invalido',
            issue: 'formato_no_reconocido',
            parts: null,
            raw: safeRepr,
        }
    }

    const cleaned = cleanRawString(rawStr)
    if (!cleaned) {
        return { status: 'vacio', parts: null, raw: rawStr }
    }

    // Determine country code and national digits
    let countryCode = defaultCodeFormatted
    let nationalDigits = ''
    let isExplicitCountryCode = false

    if (cleaned.startsWith('+')) {
        isExplicitCountryCode = true
        const afterPlus = cleaned.slice(1).replace(/\D/g, '')
        const matched = matchCountryCode(afterPlus)
        if (!matched) {
            return {
                status: 'invalido',
                issue: 'codigo_pais_invalido',
                parts: null,
                raw: rawStr,
            }
        }
        countryCode = `+${matched}`
        nationalDigits = afterPlus.slice(matched.length)
    } else if (cleaned.startsWith('00')) {
        isExplicitCountryCode = true
        const after00 = cleaned.slice(2).replace(/\D/g, '')
        const matched = matchCountryCode(after00)
        if (!matched) {
            return {
                status: 'invalido',
                issue: 'codigo_pais_invalido',
                parts: null,
                raw: rawStr,
            }
        }
        countryCode = `+${matched}`
        nationalDigits = after00.slice(matched.length)
    } else {
        // No '+' or '00'. Extract pure digits
        const allDigits = cleaned.replace(/\D/g, '')

        // Check if starts with default country digits redundantly (e.g. 573204842897 -> 12 digits starting with 57)
        if (
            defaultCodeDigits === '57' &&
            allDigits.length === 12 &&
            allDigits.startsWith('57')
        ) {
            const remainder = allDigits.slice(2)
            if (
                remainder.startsWith(COLOMBIA_MOBILE_PREFIX) ||
                COLOMBIA_VALID_FIXED_PREFIXES.some((p) => remainder.startsWith(p))
            ) {
                countryCode = '+57'
                nationalDigits = remainder
                isExplicitCountryCode = true
            } else {
                // If remainder is not a valid Colombian start, keep default
                countryCode = defaultCodeFormatted
                nationalDigits = allDigits
            }
        } else {
            countryCode = defaultCodeFormatted
            nationalDigits = allDigits
        }
    }

    const parts: PhoneParts = {
        countryCode,
        national: nationalDigits,
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Colombia-specific validation (+57)
    // ─────────────────────────────────────────────────────────────────────────
    if (countryCode === '+57') {
        const len = nationalDigits.length

        if (len === 0) {
            if (isExplicitCountryCode) {
                return {
                    status: 'incompleto',
                    issue: 'faltan_digitos',
                    parts,
                    raw: rawStr,
                    digitDelta: COLOMBIA_NATIONAL_LENGTH,
                }
            }
            return {
                status: 'vacio',
                parts: null,
                raw: rawStr,
            }
        }

        if (len < COLOMBIA_NATIONAL_LENGTH) {
            const delta = COLOMBIA_NATIONAL_LENGTH - len
            const suggestion = getTranspositionSuggestion(nationalDigits)
            return {
                status: 'incompleto',
                issue: 'faltan_digitos',
                parts,
                raw: rawStr,
                digitDelta: delta,
                ...(suggestion ? { suggestion } : {}),
            }
        }

        if (len > COLOMBIA_NATIONAL_LENGTH) {
            const delta = len - COLOMBIA_NATIONAL_LENGTH
            return {
                status: 'invalido',
                issue: 'sobran_digitos',
                parts,
                raw: rawStr,
                digitDelta: delta,
            }
        }

        // Exactly 10 digits in Colombia
        if (nationalDigits.startsWith(COLOMBIA_MOBILE_PREFIX)) {
            return {
                status: 'valido',
                e164: `+57${nationalDigits}`,
                parts,
                kind: 'celular',
                raw: rawStr,
            }
        }

        const isFixed = COLOMBIA_VALID_FIXED_PREFIXES.some((p) => nationalDigits.startsWith(p))
        if (isFixed) {
            return {
                status: 'valido',
                e164: `+57${nationalDigits}`,
                parts,
                kind: 'fijo',
                raw: rawStr,
            }
        }

        // 10 digits but invalid prefix
        const suggestion = getTranspositionSuggestion(nationalDigits)
        return {
            status: 'invalido',
            issue: 'prefijo_invalido',
            parts,
            raw: rawStr,
            ...(suggestion ? { suggestion } : {}),
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // International validation (+XX != +57) — E.164 permissive
    // ─────────────────────────────────────────────────────────────────────────
    const codeDigits = countryCode.replace(/\D/g, '')
    const totalDigits = codeDigits.length + nationalDigits.length

    if (nationalDigits.length < E164_MIN_NATIONAL_DIGITS) {
        return {
            status: 'incompleto',
            issue: 'faltan_digitos',
            parts,
            raw: rawStr,
            digitDelta: E164_MIN_NATIONAL_DIGITS - nationalDigits.length,
        }
    }

    if (totalDigits > E164_MAX_TOTAL_DIGITS) {
        return {
            status: 'invalido',
            issue: 'sobran_digitos',
            parts,
            raw: rawStr,
            digitDelta: totalDigits - E164_MAX_TOTAL_DIGITS,
        }
    }

    return {
        status: 'valido',
        e164: `${countryCode}${nationalDigits}`,
        parts,
        kind: 'otro',
        raw: rawStr,
    }
}

/**
 * Detects legacy transposition prefixes (e.g. '064' -> '604') in Colombian national numbers.
 */
function getTranspositionSuggestion(nationalDigits: string): string | null {
    if (nationalDigits.length >= 3) {
        const prefix3 = nationalDigits.slice(0, 3)
        if (COLOMBIA_TRANSPOSED_PREFIX_MAP[prefix3]) {
            return COLOMBIA_TRANSPOSED_PREFIX_MAP[prefix3]
        }
    }
    return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatters & URL Builders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats phone parts or parse object into the standardized visual mask:
 * - Colombia (+57): «+57 (604) 290 5320» or «+57 (320) 484 2897» (3 + 3 + 4 structure)
 * - International (+XX): «+XX (XXX) XXXXXX»
 * Never alters canonical storage; purely for display presentation.
 */
export function formatPhone(input: PhoneParts | PhoneParse | string | null | undefined): string {
    if (!input) return ''

    let parts: PhoneParts | null = null

    if (typeof input === 'string') {
        const parse = parsePhone(input)
        if (parse.status === 'vacio') return ''
        parts = parse.parts
        if (!parts) return input.trim()
    } else if ('countryCode' in input && 'national' in input) {
        parts = input as PhoneParts
    } else if ('parts' in input) {
        parts = input.parts
        if (!parts) return (input.raw || '').trim()
    }

    if (!parts) return ''

    const { countryCode, national } = parts
    const digits = national.replace(/\D/g, '')

    if (!digits) {
        return countryCode
    }

    if (countryCode === '+57') {
        const p1 = digits.slice(0, 3)
        const p2 = digits.slice(3, 6)
        const p3 = digits.slice(6, 10)
        const extra = digits.slice(10) // Preserves overflow without silent trimming

        if (digits.length <= 3) {
            return `${countryCode} (${p1}`
        }
        if (digits.length <= 6) {
            return `${countryCode} (${p1}) ${p2}`
        }
        const formatted = `${countryCode} (${p1}) ${p2} ${p3}`
        return extra ? `${formatted}${extra}` : formatted
    }

    // Generic international format (3-digit area + remaining)
    if (digits.length <= 3) {
        return `${countryCode} (${digits}`
    }
    const area = digits.slice(0, 3)
    const rest = digits.slice(3)
    return `${countryCode} (${area}) ${rest}`
}

/**
 * Extracts canonical E.164 string (+ and up to 15 digits) if valid, or null.
 */
export function toE164(raw: unknown, options?: { readonly defaultCountry?: string }): string | null {
    const parse = parsePhone(raw, options)
    return parse.status === 'valido' ? parse.e164 : null
}

/**
 * Builds safe `tel:` URI only from validated E.164 strings.
 * Adheres to Invariant I7: never builds from raw or invalid text.
 */
export function toTelHref(raw: unknown, options?: { readonly defaultCountry?: string }): string | null {
    const e164 = toE164(raw, options)
    return e164 ? `tel:${e164}` : null
}

/**
 * Builds safe WhatsApp URL `https://wa.me/573204842897` (without '+').
 * Encodes optional message parameter safely with `encodeURIComponent`.
 */
export function toWhatsAppHref(
    raw: unknown,
    text?: string,
    options?: { readonly defaultCountry?: string }
): string | null {
    const e164 = toE164(raw, options)
    if (!e164) return null

    // Strip leading '+' for wa.me format
    const digits = e164.replace(/\D/g, '')
    const base = `https://wa.me/${digits}`

    if (text && text.trim()) {
        return `${base}?text=${encodeURIComponent(text.trim())}`
    }
    return base
}

/**
 * Returns single highest priority error or advisory message for a field (§6, I9).
 */
export function getPhoneMessage(
    parse: PhoneParse,
    variant: 'telefono' | 'whatsapp' = 'telefono'
): string | null {
    if (parse.status === 'vacio') {
        return null
    }

    if (parse.status === 'incompleto') {
        if (parse.issue === 'faltan_digitos') {
            const base = PHONE_MESSAGES.missingDigits(parse.digitDelta || 1)
            return parse.suggestion
                ? `${base} ${PHONE_MESSAGES.transpositionSuggestion(parse.suggestion)}`
                : base
        }
    }

    if (parse.status === 'invalido') {
        switch (parse.issue) {
            case 'codigo_pais_invalido':
                return PHONE_MESSAGES.invalidCountryCode
            case 'prefijo_invalido': {
                const base = PHONE_MESSAGES.invalidPrefix
                return parse.suggestion
                    ? `${base} ${PHONE_MESSAGES.transpositionSuggestion(parse.suggestion)}`
                    : base
            }
            case 'sobran_digitos':
                return PHONE_MESSAGES.excessDigits(parse.digitDelta || 1)
            case 'formato_no_reconocido':
                return PHONE_MESSAGES.unrecognizedFormat
            default:
                return PHONE_MESSAGES.unrecognizedFormat
        }
    }

    // Valid number check for whatsapp variant (non-blocking warning for landlines)
    if (parse.status === 'valido' && variant === 'whatsapp' && parse.kind === 'fijo') {
        return PHONE_MESSAGES.whatsappNonMobileWarning
    }

    return null
}
