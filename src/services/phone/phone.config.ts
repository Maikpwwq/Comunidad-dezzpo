/**
 * Phone System Configuration & Official Colombian Registry
 *
 * References:
 * - Comisión de Regulación de Comunicaciones (CRC), Resolución 5886 de 2020.
 * - Plan Nacional de Numeración de Colombia (Decreto 1078 de 2015).
 * - ITU-T Recommendation E.164 (International Public Telecommunication Numbering Plan).
 */

/** Default country code prefix for Colombia */
export const DEFAULT_COUNTRY_CODE = '+57' as const
export const DEFAULT_COUNTRY_ISO = 'CO' as const

/** Exactly 10 digits required for all national numbers in Colombia */
export const COLOMBIA_NATIONAL_LENGTH = 10 as const

/** Initial digit for all Colombian mobile numbers (3XX + 7 digits) */
export const COLOMBIA_MOBILE_PREFIX = '3' as const

/**
 * Official administrative unified fixed-line departmental codes in Colombia:
 * - 601: Bogotá D.C. y Cundinamarca
 * - 602: Valle del Cauca, Cauca, Nariño
 * - 604: Antioquia, Córdoba, Chocó
 * - 605: Atlántico, Bolívar, Cesar, Magdalena, La Guajira, Sucre
 * - 606: Caldas, Quindío, Risaralda
 * - 607: Santander, Norte de Santander, Arauca
 * - 608: Boyacá, Tolima, Huila, San Andrés, Meta, Caquetá, Casanare, Guaviare, Amazonas, Guainía, Putumayo, Vaupés, Vichada
 * Note: 603 and 609 do NOT exist in the CRC registry.
 */
export const COLOMBIA_VALID_FIXED_PREFIXES = [
    '601',
    '602',
    '604',
    '605',
    '606',
    '607',
    '608',
] as const

/** Typical transpositions from legacy dialing habits (e.g. 064 instead of 604) */
export const COLOMBIA_TRANSPOSED_PREFIX_MAP: Record<string, string> = {
    '061': '601',
    '062': '602',
    '064': '604',
    '065': '605',
    '066': '606',
    '067': '607',
    '068': '608',
}

/** E.164 boundary constraints */
export const E164_MAX_TOTAL_DIGITS = 15 as const
export const E164_MIN_NATIONAL_DIGITS = 4 as const

/**
 * Standard ITU-T E.164 calling codes set (1 to 3 digits).
 * Covers North America, Latin America, Europe, Asia, Africa, Oceania.
 */
export const KNOWN_COUNTRY_CODES: readonly string[] = Object.freeze([
    // 1-digit
    '1', '7',
    // 2-digit
    '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46',
    '47', '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63',
    '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98',
    // 3-digit Latin America & common international
    '212', '213', '216', '218', '220', '221', '222', '223', '224', '225', '226', '227', '228',
    '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241',
    '242', '243', '244', '245', '246', '248', '249', '250', '251', '252', '253', '254', '255',
    '256', '257', '258', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269',
    '290', '291', '297', '298', '299', '350', '351', '352', '353', '354', '355', '356', '357',
    '358', '359', '370', '371', '372', '373', '374', '375', '376', '377', '378', '379', '380',
    '381', '382', '383', '385', '386', '387', '389', '420', '421', '423', '500', '501', '502',
    '503', '504', '505', '506', '507', '508', '509', '590', '591', '592', '593', '594', '595',
    '596', '597', '598', '599', '670', '672', '673', '674', '675', '676', '677', '678', '679',
    '680', '681', '682', '683', '685', '686', '687', '688', '689', '690', '691', '692', '850',
    '852', '853', '855', '856', '880', '886', '960', '961', '962', '963', '964', '965', '966',
    '967', '968', '970', '971', '972', '973', '974', '975', '976', '977', '992', '993', '994',
    '995', '996', '998',
])

/**
 * Standard, concise Colombian Spanish messages (§6).
 * Formulated to avoid repeating label, helperText, or decorative scaffolding.
 */
export const PHONE_MESSAGES = {
    missingDigits: (delta: number): string =>
        delta === 1 ? 'Falta 1 dígito.' : `Faltan ${delta} dígitos.`,
    excessDigits: (delta: number): string =>
        delta === 1 ? 'Sobra 1 dígito.' : `Sobran ${delta} dígitos.`,
    invalidPrefix: 'Los fijos empiezan por 60X y los celulares por 3XX.',
    invalidCountryCode: 'Código de país no válido.',
    unrecognizedFormat: 'Formato no reconocido.',
    whatsappNonMobileWarning: 'No parece un celular. ¿Tiene WhatsApp?',
    duplicateNumber: 'Este número ya está en la lista.',
    transpositionSuggestion: (suggested: string): string =>
        `¿Quisiste decir ${suggested}?`,
} as const
