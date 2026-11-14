/**
 * Colombian NIT (Número de Identificación Tributaria) Validator
 *
 * Implements the official DIAN Module 11 check digit (Dígito de Verificación - DV)
 * calculation according to Colombian tax regulations (Decreto 624 de 1989 / Estatuto Tributario Art. 555-2).
 */

const DIAN_WEIGHTS = [71, 67, 59, 53, 47, 43, 41, 37, 29, 23, 19, 17, 13, 7, 3] as const

/**
 * Calculates the DIAN verification digit for a Colombian NIT number.
 * @param nitClean Raw numeric string without dashes or DV (max 15 digits)
 * @returns Verification digit (0-9) or null if invalid
 */
export function calculateNitDv(nitClean: string): number | null {
    const cleaned = nitClean.replace(/\D/g, '')
    if (!cleaned || cleaned.length === 0 || cleaned.length > 15) {
        return null
    }

    const padded = cleaned.padStart(15, '0')
    let sum = 0

    for (let i = 0; i < 15; i++) {
        const digit = parseInt(padded[i] || '0', 10)
        const weight = DIAN_WEIGHTS[i] ?? 0
        sum += digit * weight
    }

    const remainder = sum % 11
    if (remainder === 0 || remainder === 1) {
        return remainder
    }
    return 11 - remainder
}

export interface NitValidationResult {
    readonly isValid: boolean
    readonly cleanNit: string
    readonly dv: number | null
    readonly formatted: string
    readonly error?: string
}

/**
 * Validates a formatted or unformatted Colombian NIT with its verification digit.
 * Supported formats:
 * - "900.123.456-7"
 * - "900123456-7"
 * - "9001234567" (last digit taken as DV if 10 digits)
 */
export function validateColombianNit(rawNit: string): NitValidationResult {
    if (!rawNit || typeof rawNit !== 'string') {
        return {
            isValid: false,
            cleanNit: '',
            dv: null,
            formatted: '',
            error: 'El NIT no puede estar vacío.',
        }
    }

    const trimmed = rawNit.trim()

    // Case 1: NIT has an explicit dash separator (e.g. 900.123.456-7 or 900123456-7)
    if (trimmed.includes('-')) {
        const parts = trimmed.split('-')
        if (parts.length !== 2) {
            return {
                isValid: false,
                cleanNit: '',
                dv: null,
                formatted: '',
                error: 'Formato de NIT inválido. Debe contener un único guion antes del dígito de verificación.',
            }
        }

        const nitBase = (parts[0] ?? '').replace(/\D/g, '')
        const providedDv = parseInt((parts[1] ?? '').trim(), 10)

        if (!nitBase || nitBase.length < 8 || nitBase.length > 15) {
            return {
                isValid: false,
                cleanNit: nitBase,
                dv: null,
                formatted: '',
                error: 'El número base del NIT debe tener entre 8 y 15 dígitos.',
            }
        }

        if (isNaN(providedDv) || providedDv < 0 || providedDv > 9) {
            return {
                isValid: false,
                cleanNit: nitBase,
                dv: null,
                formatted: '',
                error: 'El dígito de verificación debe ser un número entre 0 y 9.',
            }
        }

        const calculatedDv = calculateNitDv(nitBase)
        const isValid = calculatedDv === providedDv

        return {
            isValid,
            cleanNit: nitBase,
            dv: calculatedDv,
            formatted: `${formatNitNumber(nitBase)}-${providedDv}`,
            ...(isValid ? {} : { error: `Dígito de verificación incorrecto. Esperado: ${calculatedDv}, proporcionado: ${providedDv}.` }),
        }
    }

    // Case 2: Only digits provided
    const digitsOnly = trimmed.replace(/\D/g, '')
    if (digitsOnly.length < 9) {
        return {
            isValid: false,
            cleanNit: digitsOnly,
            dv: null,
            formatted: digitsOnly,
            error: 'El NIT debe tener al menos 8 dígitos base y 1 dígito de verificación.',
        }
    }

    // Treat last digit as DV
    const nitBase = digitsOnly.slice(0, -1)
    const providedDv = parseInt(digitsOnly.slice(-1), 10)
    const calculatedDv = calculateNitDv(nitBase)
    const isValid = calculatedDv === providedDv

    return {
        isValid,
        cleanNit: nitBase,
        dv: calculatedDv,
        formatted: `${formatNitNumber(nitBase)}-${providedDv}`,
        ...(isValid ? {} : { error: `Dígito de verificación incorrecto. Calculado: ${calculatedDv}.` }),
    }
}

/**
 * Formats a clean NIT with Colombian thousands dots (e.g. 900.123.456)
 */
export function formatNitNumber(nitBase: string): string {
    const cleaned = nitBase.replace(/\D/g, '')
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
