/**
 * Coverage Zones Configuration
 *
 * Central configuration for coverage zones, caps, limits,
 * and mapping between curated slugs and official 5-digit DANE DIVIPOLA codes.
 */

export const MAX_COVERAGE_ZONES = 15 as const

export const DEFAULT_SEARCH_LIMIT = 25 as const
export const MAX_RENDERED_SEARCH_RESULTS = 50 as const

/**
 * Mapping between curated municipality slugs in ListadoZonas and official 5-digit DANE codes.
 * Ensures bidirectional deduplication so "Soacha" appears once in search.
 */
export const CURATED_MUNICIPALITY_DANE_CODES: Readonly<Record<string, string>> = {
    'bogota': '11001',
    'soacha': '25754',
    'chia': '25175',
    'cajica': '25126',
    'zipaquira': '25899',
    'cota': '25214',
    'funza': '25286',
    'mosquera': '25473',
    'madrid': '25430',
    'facatativa': '25269',
    'la-calera': '25377',
    'sopo': '25758',
    'tabio': '25785',
    'tenjo': '25799',
    'tocancipa': '25817',
    'gachancipa': '25295',
    'sibate': '25740',
} as const

/**
 * Inverse mapping from 5-digit DANE code to curated slug.
 */
export const DANE_CODE_TO_CURATED_SLUG: Readonly<Record<string, string>> = Object.entries(
    CURATED_MUNICIPALITY_DANE_CODES
).reduce((acc, [slug, code]) => {
    acc[code] = slug
    return acc
}, {} as Record<string, string>)

/**
 * Categorization of the 52 curated zones into functional kinds.
 */
export const CURATED_ZONE_KINDS: Readonly<Record<string, 'municipio' | 'localidad' | 'macrozona' | 'sector' | 'area_metropolitana'>> = {
    // Macro and Sub-macro
    'bogota': 'macrozona',
    'bogota-norte': 'macrozona',
    'bogota-sur': 'macrozona',
    'bogota-centro': 'macrozona',
    'bogota-occidente': 'macrozona',

    // 20 Localities of Bogotá
    'suba': 'localidad',
    'usaquen': 'localidad',
    'chapinero': 'localidad',
    'teusaquillo': 'localidad',
    'kennedy': 'localidad',
    'engativa': 'localidad',
    'fontibon': 'localidad',
    'barrios-unidos': 'localidad',
    'bosa': 'localidad',
    'puente-aranda': 'localidad',
    'los-martires': 'localidad',
    'santa-fe': 'localidad',
    'san-cristobal': 'localidad',
    'usme': 'localidad',
    'tunjuelito': 'localidad',
    'antonio-narino': 'localidad',
    'la-candelaria': 'localidad',
    'rafael-uribe-uribe': 'localidad',
    'ciudad-bolivar': 'localidad',
    'sumapaz': 'localidad',

    // 16 Cundinamarca Municipalities
    'soacha': 'municipio',
    'chia': 'municipio',
    'cajica': 'municipio',
    'zipaquira': 'municipio',
    'cota': 'municipio',
    'funza': 'municipio',
    'mosquera': 'municipio',
    'madrid': 'municipio',
    'facatativa': 'municipio',
    'la-calera': 'municipio',
    'sopo': 'municipio',
    'tabio': 'municipio',
    'tenjo': 'municipio',
    'tocancipa': 'municipio',
    'gachancipa': 'municipio',
    'sibate': 'municipio',

    // 9 Cardinal Sectors
    'centro': 'sector',
    'norte': 'sector',
    'sur': 'sector',
    'occidente': 'sector',
    'oriente': 'sector',
    'noroccidente': 'sector',
    'nororiente': 'sector',
    'suroccidente': 'sector',
    'suroriente': 'sector',

    // Metro Area
    'alrededores': 'area_metropolitana',
} as const

