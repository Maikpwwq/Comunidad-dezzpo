/**
 * Search Context Codec
 *
 * Encodes, decodes and persists search context across URL query params,
 * page reloads, browser history, and auth handoffs (login/registration).
 *
 * URL Schema:
 * ?cat={category}&tipo={propertyType}&zona={zoneSlug}&mpio={divipolaCode}
 */

import { type PropertyTypeId, normalizePropertyType, PROPERTY_TYPE_METADATA } from '@config/matching.config'
import { zoneNames } from '@assets/data/ListadoZonas'

export interface SearchContextState {
    /** Category keyword, slug, or label */
    category: string | null
    /** Canonical property type */
    propertyType: PropertyTypeId | null
    /** Zone slug from ListadoZonas (e.g., 'bogota', 'chapinero', 'otra-zona') */
    zone: string | null
    /** Official DIVIPOLA 5-digit municipality code if zone === 'otra-zona' */
    municipioCode: string | null
    /** Descriptive municipality name if zone === 'otra-zona' */
    municipioName?: string | null
}

const STORAGE_KEY = 'dezzpo_pending_search_context'

/**
 * Sanitizes an arbitrary string, trimming and capping length to avoid URL payload abuse.
 */
function sanitizeParam(val: unknown, maxLen = 120): string | null {
    if (typeof val !== 'string') return null
    const trimmed = val.trim()
    if (!trimmed || trimmed.length > maxLen) return null
    // Strip control characters and HTML tags
    return trimmed.replace(/[<>'"]/g, '')
}

/**
 * Decodes URL search parameters into a safe, strongly-typed SearchContextState.
 * Invalid values are gracefully ignored without throwing errors.
 */
export function decodeSearchContext(input: URLSearchParams | string | Record<string, unknown>): SearchContextState {
    let params: URLSearchParams

    if (input instanceof URLSearchParams) {
        params = input
    } else if (typeof input === 'string') {
        const query = input.includes('?') ? input.split('?')[1] : input
        params = new URLSearchParams(query || '')
    } else if (typeof input === 'object' && input !== null) {
        params = new URLSearchParams()
        for (const [key, value] of Object.entries(input)) {
            if (value !== undefined && value !== null) {
                params.set(key, String(value))
            }
        }
    } else {
        params = new URLSearchParams()
    }

    // Category (alias: cat or category or q)
    const rawCat = params.get('cat') || params.get('category') || params.get('q')
    const category = sanitizeParam(rawCat)

    // Property Type (alias: tipo or property or propertyType or draftProject)
    const rawTipo = params.get('tipo') || params.get('property') || params.get('propertyType') || params.get('draftProject')
    const propertyType = normalizePropertyType(rawTipo)

    // Zone (alias: zona or zone or city or draftCity)
    const rawZona = params.get('zona') || params.get('zone') || params.get('city') || params.get('draftCity')
    let zone: string | null = null
    if (rawZona) {
        const cleanZona = rawZona.toLowerCase().trim()
        if (cleanZona in zoneNames || cleanZona === 'otra-zona') {
            zone = cleanZona
        }
    }

    // DIVIPOLA Municipality Code (alias: mpio or divipola)
    const rawMpio = params.get('mpio') || params.get('divipola')
    const municipioCode = rawMpio && /^\d{5}$/.test(rawMpio.trim()) ? rawMpio.trim() : null

    const rawMpioName = params.get('mpioName')
    const municipioName = sanitizeParam(rawMpioName)

    return {
        category,
        propertyType,
        zone,
        municipioCode,
        municipioName,
    }
}

/**
 * Encodes a SearchContextState into URL query string format.
 * Only includes non-null values. Returns empty string if all null.
 */
export function encodeSearchContext(state: Partial<SearchContextState>): string {
    const params = new URLSearchParams()

    if (state.category && state.category.trim()) {
        params.set('cat', state.category.trim())
    }

    if (state.propertyType) {
        const meta = PROPERTY_TYPE_METADATA[state.propertyType]
        params.set('tipo', meta?.slug || state.propertyType)
    }

    if (state.zone && state.zone.trim()) {
        params.set('zona', state.zone.trim())
    }

    if (state.municipioCode && state.municipioCode.trim()) {
        params.set('mpio', state.municipioCode.trim())
    }

    if (state.municipioName && state.municipioName.trim()) {
        params.set('mpioName', state.municipioName.trim())
    }

    const str = params.toString()
    return str ? `?${str}` : ''
}

/**
 * Persists current search intent to sessionStorage so it survives login/registration.
 */
export function persistPendingSearchContext(state: Partial<SearchContextState>): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return
    try {
        const serialized = JSON.stringify(state)
        window.sessionStorage.setItem(STORAGE_KEY, serialized)
    } catch {
        // Ignore storage write errors (e.g. private mode quota)
    }
}

/**
 * Retrieves pending search intent from sessionStorage after auth resolution.
 */
export function retrievePendingSearchContext(): SearchContextState | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        return decodeSearchContext(parsed)
    } catch {
        return null
    }
}

/**
 * Clears pending search context from sessionStorage once applied.
 */
export function clearPendingSearchContext(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return
    try {
        window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
        // Ignore storage errors
    }
}
