/**
 * Pure and Deterministic Coverage Zone Search Engine
 *
 * Implements prefix-first ranking, department disambiguation,
 * stable tie-breaking, and deduplication across curated zones and DIVIPOLA.
 */

import { normalizeZoneText } from './catalog'
import type { ZoneOption, ZoneMatch, SearchZonesOptions } from './types'
import {
    DEFAULT_SEARCH_LIMIT,
    MAX_RENDERED_SEARCH_RESULTS,
} from '@config/zones.config'

/**
 * Calculates match rank for a candidate ZoneOption against a normalized query:
 * Lower score = higher relevance.
 *
 * - 10: Exact match on label
 * - 20: Starts-with match on label
 * - 30: Word-prefix match on label (e.g. "san" matching "San Cristóbal")
 * - 40: Substring match inside label
 * - 50: Starts-with match on parentLabel (department)
 * - 60: Substring match in parentLabel
 * - 70: Match by DANE code
 * - Infinity: No match
 */
export function computeMatchScore(
    option: ZoneOption,
    cleanQuery: string
): number {
    if (!cleanQuery) return 100

    const normLabel = normalizeZoneText(option.label)
    const normParent = normalizeZoneText(option.parentLabel)

    if (normLabel === cleanQuery) return 10
    if (normLabel.startsWith(cleanQuery)) return 20

    const words = normLabel.split(/\s+/)
    if (words.some((w) => w.startsWith(cleanQuery))) return 30

    if (normLabel.includes(cleanQuery)) return 40

    if (normParent && normParent.startsWith(cleanQuery)) return 50
    if (normParent && normParent.includes(cleanQuery)) return 60

    if (option.daneCode && option.daneCode.startsWith(cleanQuery)) return 70

    // Full search string match fallback
    if (option.normalizedSearch.includes(cleanQuery)) return 80

    return Infinity
}

/**
 * Pure and deterministic search over a list of ZoneOption items.
 *
 * @param catalog List of ZoneOption items to search over
 * @param query Raw user search input string
 * @param options Selected IDs, limit, and optional base department preference
 */
export function searchZones(
    catalog: readonly ZoneOption[],
    query: string,
    options: SearchZonesOptions
): ZoneMatch[] {
    const cleanQuery = normalizeZoneText(query)
    const limit = Math.min(
        options.limit ?? DEFAULT_SEARCH_LIMIT,
        MAX_RENDERED_SEARCH_RESULTS
    )
    const selectedIds = options.selectedIds

    // If query is empty, return popular / curated zones first
    if (!cleanQuery) {
        const defaultList = catalog.slice(0, limit).map((option) => ({
            option,
            selected: selectedIds.has(option.id),
            matchRank: 100,
        }))
        return defaultList
    }

    const matches: ZoneMatch[] = []

    for (const option of catalog) {
        const score = computeMatchScore(option, cleanQuery)
        if (score !== Infinity) {
            matches.push({
                option,
                selected: selectedIds.has(option.id),
                matchRank: score,
            })
        }
    }

    // Deterministic sorting
    matches.sort((a, b) => {
        // 1. Match score (relevance: prefix > substring)
        if (a.matchRank !== b.matchRank) {
            return a.matchRank - b.matchRank
        }

        // 2. Curated options first
        if (a.option.curated !== b.option.curated) {
            return a.option.curated ? -1 : 1
        }

        // 3. Alphabetical by label
        const labelCompare = a.option.label.localeCompare(
            b.option.label,
            'es',
            { sensitivity: 'base' }
        )
        if (labelCompare !== 0) {
            return labelCompare
        }

        // 4. Alphabetical by parentLabel
        const parentA = a.option.parentLabel || ''
        const parentB = b.option.parentLabel || ''
        const parentCompare = parentA.localeCompare(parentB, 'es', {
            sensitivity: 'base',
        })
        if (parentCompare !== 0) {
            return parentCompare
        }

        // 5. Stable tie-breaker by id
        return a.option.id.localeCompare(b.option.id)
    })

    return matches.slice(0, limit)
}
