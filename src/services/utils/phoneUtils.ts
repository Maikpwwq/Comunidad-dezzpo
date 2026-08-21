/**
 * Phone Utility Functions
 *
 * Normalization, validation, and display formatting for phone numbers
 * adhering to the E.164 international standard.
 */

/**
 * Normalizes a raw phone number input into international E.164 format.
 * Defaults to Colombia (+57) if no international code prefix is present.
 *
 * @example
 * formatToE164('320 484 2897') // '+573204842897'
 * formatToE164('3204842897')   // '+573204842897'
 * formatToE164('+57 320 484 2897') // '+573204842897'
 * formatToE164('+1 650 555 1234')  // '+16505551234'
 */
export function formatToE164(rawPhone: string, defaultCountryCode: string = '+57'): string {
    if (!rawPhone) return ''

    // Remove all whitespace, hyphens, and parentheses
    let cleaned = rawPhone.trim().replace(/[\s\-()]/g, '')

    // If starts with +, ensure clean digits following
    if (cleaned.startsWith('+')) {
        return '+' + cleaned.slice(1).replace(/\D/g, '')
    }

    // Remove any non-digits
    cleaned = cleaned.replace(/\D/g, '')

    if (!cleaned) return ''

    // If 10 digits starting with 3 (standard Colombian mobile), prepend +57
    if (cleaned.length === 10 && cleaned.startsWith('3')) {
        const prefix = defaultCountryCode.startsWith('+') ? defaultCountryCode : `+${defaultCountryCode}`
        return `${prefix}${cleaned}`
    }

    // If 12 digits starting with 57 (Colombia country code without +)
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
        return `+${cleaned}`
    }

    // Fallback: prepend default country code
    const prefix = defaultCountryCode.startsWith('+') ? defaultCountryCode : `+${defaultCountryCode}`
    return `${prefix}${cleaned}`
}

/**
 * Validates whether a phone number matches standard Colombian mobile format.
 * (10 digits starting with 3, or E.164 +573XXXXXXXXX)
 */
export function isValidColombianPhone(phone: string): boolean {
    if (!phone) return false
    const e164 = formatToE164(phone)
    // +57 followed by 3 and 9 digits (total 12 chars after +: 57 + 3XXXXXXXXX)
    return /^\+573\d{9}$/.test(e164)
}

/**
 * Formats a phone number for user-friendly display.
 * e.g. '+573204842897' -> '+57 320 484 2897'
 */
export function formatPhoneDisplay(phone: string): string {
    if (!phone) return ''
    const e164 = formatToE164(phone)

    if (e164.startsWith('+57') && e164.length === 13) {
        const country = e164.slice(0, 3)
        const part1 = e164.slice(3, 6)
        const part2 = e164.slice(6, 9)
        const part3 = e164.slice(9)
        return `${country} ${part1} ${part2} ${part3}`
    }

    return e164
}
