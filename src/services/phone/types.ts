/**
 * Phone Domain Types
 *
 * Single source of truth for telephone and WhatsApp data contracts,
 * validation states, structural parts, and parsing outcomes.
 */

/**
 * Structural classification of a validated phone number.
 */
export type PhoneKind = 'celular' | 'fijo' | 'otro'

/**
 * Normalized validation issues defined in requirement R4 and §6.
 */
export type PhoneIssue =
    | 'faltan_digitos'
    | 'sobran_digitos'
    | 'prefijo_invalido'
    | 'codigo_pais_invalido'
    | 'formato_no_reconocido'

/**
 * Structural components of a phone number (E.164 country code + national number).
 */
export interface PhoneParts {
    /** International calling code with leading '+' (e.g. '+57', '+1', '+34') */
    readonly countryCode: string
    /** Pure national number digits without punctuation (e.g. '3204842897', '6042905320') */
    readonly national: string
}

/**
 * Comprehensive outcome of parsing any raw phone input.
 * Fully discriminated union over `status`.
 */
export type PhoneParse =
    | {
          readonly status: 'vacio'
          readonly parts: null
          readonly raw: string
      }
    | {
          readonly status: 'valido'
          /** Normalized E.164 string (+ followed by digits, e.g. '+573204842897') */
          readonly e164: string
          readonly parts: PhoneParts
          readonly kind: PhoneKind
          readonly raw: string
      }
    | {
          readonly status: 'incompleto' | 'invalido'
          readonly issue: PhoneIssue
          readonly parts: PhoneParts | null
          readonly raw: string
          /** In case of missing or excess digits, how many digits are off */
          readonly digitDelta?: number
          /** Suggestion for typical transposition, e.g. '604' when typing '064' */
          readonly suggestion?: string
      }

/**
 * Controlled change payload emitted by the PhoneField component.
 */
export interface PhoneChange {
    /** Canonical E.164 string if valid; otherwise the cleaned/unformatted input */
    readonly value: string
    /** Complete parsing result with status, issue, parts, and kind */
    readonly parse: PhoneParse
}

/**
 * Props contract for the unified PhoneField component.
 */
export interface PhoneFieldProps {
    readonly label: string
    readonly value: string | null | undefined
    readonly onChange: (change: PhoneChange) => void
    readonly variant?: 'telefono' | 'whatsapp' | undefined
    readonly required?: boolean | undefined
    readonly disabled?: boolean | undefined
    readonly helperText?: string | undefined
    readonly autoComplete?: ('off' | 'tel') | undefined
    readonly id?: string | undefined
    readonly name?: string | undefined
    readonly error?: boolean | undefined
    readonly fullWidth?: boolean | undefined
    readonly size?: ('small' | 'medium') | undefined
    readonly className?: string | undefined
    readonly sx?: import('@mui/material').SxProps<import('@mui/material').Theme> | undefined
}
