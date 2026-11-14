/**
 * Category Chip Filtering Utility
 *
 * Reduces category chip lists based on active text search queries
 * (e.g., searching "plomería" or "plomero" narrows chips down to "Plomería").
 */

/**
 * Normalizes text for case and accent insensitive search in Spanish.
 */
export function normalizeSearchText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

const STOP_WORDS = new Set([
    'de',
    'en',
    'y',
    'e',
    'el',
    'la',
    'los',
    'las',
    'un',
    'una',
    'unos',
    'unas',
    'para',
    'con',
    'por',
    'del',
    'al',
    'o',
    'u',
])

export interface CategoryItemLike {
    key: number | string
    label: string
    rol?: string
    [key: string]: unknown
}

export interface FilterCategoriesOptions<T extends CategoryItemLike> {
    readonly categories: ReadonlyArray<T>
    readonly searchQuery?: string | null | undefined
    readonly selectedKey?: string | null | undefined
    readonly contextualCategoryNames?: Iterable<string> | undefined
}

/**
 * Filters a list of categories according to a user's search query.
 */
export function filterCategoriesBySearch<T extends CategoryItemLike>(
    options: FilterCategoriesOptions<T>
): T[] {
    const { categories, searchQuery, selectedKey, contextualCategoryNames } = options

    const queryTerm = (searchQuery || '').trim()
    if (!queryTerm) {
        return [...categories]
    }

    const queryNorm = normalizeSearchText(queryTerm)
    const queryWords = queryNorm
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 2 && !STOP_WORDS.has(w))

    // 1. Direct match on label or rol
    const directMatches = categories.filter((cat) => {
        const lNorm = normalizeSearchText(cat.label)
        const rNorm = normalizeSearchText(cat.rol || '')

        // Whole-query substring match
        if (lNorm.includes(queryNorm) || rNorm.includes(queryNorm)) return true

        // Word-level match with prefix/stem heuristics
        const catWords = [...lNorm.split(/\s+/), ...(rNorm ? rNorm.split(/\s+/) : [])]
            .map((w) => w.trim())
            .filter((w) => w.length >= 2 && !STOP_WORDS.has(w))

        return queryWords.some((qw) =>
            catWords.some((cw) => {
                if (qw.length >= 3 && cw.length >= 3) {
                    if (cw.includes(qw) || qw.includes(cw)) return true
                    if (qw.length >= 4 && cw.length >= 4 && qw.slice(0, 4) === cw.slice(0, 4)) {
                        return true
                    }
                }
                return false
            })
        )
    })

    let candidates: T[] = directMatches

    // 2. If no direct match on category labels, check contextual category names (e.g. from matching merchants)
    if (candidates.length === 0 && contextualCategoryNames) {
        const contextualNormSet = new Set<string>()
        for (const name of contextualCategoryNames) {
            if (name) contextualNormSet.add(normalizeSearchText(name))
        }

        if (contextualNormSet.size > 0) {
            const contextualMatches = categories.filter((cat) => {
                const lNorm = normalizeSearchText(cat.label)
                return (
                    contextualNormSet.has(lNorm) ||
                    Array.from(contextualNormSet).some(
                        (ctx) => ctx.includes(lNorm) || lNorm.includes(ctx)
                    )
                )
            })

            if (contextualMatches.length > 0) {
                candidates = contextualMatches
            }
        }
    }

    // 3. Ensure currently selected category remains in the list so the user can see & toggle it
    if (selectedKey !== undefined && selectedKey !== null && String(selectedKey).trim() !== '') {
        const currentSelected = categories.find((c) => String(c.key) === String(selectedKey))
        if (currentSelected && !candidates.some((c) => String(c.key) === String(currentSelected.key))) {
            candidates = [currentSelected, ...candidates]
        }
    }

    return candidates
}
