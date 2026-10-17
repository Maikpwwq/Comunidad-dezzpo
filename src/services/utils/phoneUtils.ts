/**
 * Phone Utility Functions (Compatibility Layer)
 *
 * Re-exports the unified domain logic from `@services/phone`
 * while maintaining existing function signatures for legacy consumers.
 */

import {
    parsePhone,
    formatPhone as domainFormatPhone,
    toE164,
    toTelHref,
    toWhatsAppHref,
} from '@services/phone'

export {
    parsePhone,
    toE164,
    toTelHref,
    toWhatsAppHref,
}

export type {
    PhoneKind,
    PhoneIssue,
    PhoneParts,
    PhoneParse,
    PhoneChange,
    PhoneFieldProps,
} from '@services/phone'

/**
 * Normalizes a raw phone number input into international E.164 format.
 * Returns empty string if the input cannot be parsed into a phone number.
 */
export function formatToE164(rawPhone: string, defaultCountryCode: string = '+57'): string {
    if (!rawPhone || !rawPhone.trim()) return ''
    const result = toE164(rawPhone, { defaultCountry: defaultCountryCode })
    return result || ''
}

/**
 * Validates whether a phone number matches standard Colombian format.
 * Supports both mobile numbers (3XX) and unified fixed-lines (60X).
 */
export function isValidColombianPhone(phone: string): boolean {
    if (!phone) return false
    const parsed = parsePhone(phone, { defaultCountry: '+57' })
    return parsed.status === 'valido' && parsed.parts.countryCode === '+57'
}

/**
 * Formats a phone number for user-friendly display using the official mask.
 * e.g. '+573204842897' -> '+57 (320) 484 2897'
 */
export function formatPhoneDisplay(phone: string): string {
    if (!phone) return ''
    return domainFormatPhone(phone)
}
