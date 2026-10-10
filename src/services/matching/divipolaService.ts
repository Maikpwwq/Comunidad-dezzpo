/**
 * DIVIPOLA Dataset Service
 *
 * Provides async on-demand loading, hover prefetching, and accent-insensitive
 * municipality lookup across Colombia's 1,122 municipalities.
 *
 * Keeps initial bundle size lean: JSON dataset is dynamically imported
 * only when user interacts with or hovers over the zone selector.
 */

import type { DivipolaMunicipality } from '../../../scripts/fetch-divipola'

export type { DivipolaMunicipality }

let cachedDataset: DivipolaMunicipality[] | null = null
let pendingLoadPromise: Promise<DivipolaMunicipality[]> | null = null

/**
 * Loads the DIVIPOLA dataset asynchronously.
 * Idempotent: subsequent calls return the existing cached in-memory dataset.
 */
export async function loadDivipolaDataset(): Promise<DivipolaMunicipality[]> {
    if (cachedDataset) {
        return cachedDataset
    }

    if (!pendingLoadPromise) {
        pendingLoadPromise = import('@assets/data/divipola-colombia.json')
            .then((module) => {
                const data = (module.default || module) as DivipolaMunicipality[]
                cachedDataset = data
                return data
            })
            .catch((err) => {
                pendingLoadPromise = null
                console.error('Error loading DIVIPOLA dataset:', err)
                return []
            })
    }

    return pendingLoadPromise
}

/**
 * Pre-fetches the dataset into browser memory on user hover / focus.
 * Non-blocking, fails silently if network is unavailable.
 */
export function prefetchDivipolaDataset(): void {
    if (!cachedDataset && !pendingLoadPromise) {
        loadDivipolaDataset().catch(() => {
            // Silently handled
        })
    }
}

/**
 * Normalizes input string for search (lowercase, accent-free, trimmed).
 */
export function normalizeSearchTerm(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

/**
 * Searches municipalities matching query term.
 * Searches against municipality name, department name, or code.
 */
export async function searchMunicipalities(
    query: string,
    maxResults = 10
): Promise<DivipolaMunicipality[]> {
    const list = await loadDivipolaDataset()
    const clean = normalizeSearchTerm(query)

    if (!clean) {
        // Return top default major cities if empty
        return list.filter((m) => ['11001', '05001', '76001', '08001', '68001'].includes(m.code))
    }

    const matches: DivipolaMunicipality[] = []

    for (const item of list) {
        if (item.normalized.includes(clean) || item.code.includes(clean)) {
            matches.push(item)
            if (matches.length >= maxResults) break
        }
    }

    return matches
}

/**
 * Finds a specific municipality by its 5-digit DIVIPOLA code.
 */
export async function getMunicipalityByCode(code: string): Promise<DivipolaMunicipality | null> {
    const list = await loadDivipolaDataset()
    const found = list.find((m) => m.code === code)
    return found || null
}

/**
 * Clears the in-memory cache (useful for testing).
 */
export function clearDivipolaCache(): void {
    cachedDataset = null
    pendingLoadPromise = null
}
