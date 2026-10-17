/**
 * Pure Domain Engine for Admin Search Analytics (`searchMetricsDomain.ts`)
 *
 * Implements:
 * - Largest Remainder Method (Método del mayor resto) for exact 100,0% permille distribution
 * - Deterministic partitioning: Top N + Otros + Sin dato
 * - Slices grouping rules: Otros never groups a single item
 * - Strict Invariants I1, I2, I3, I4, I5
 * - Zero I/O, zero external dependencies
 */

import {
    ANALYTICS_CONFIG,
    type PieDataset,
    type PieSlice,
    type SearchDimension,
    type SliceKind,
} from './types'

export const SIN_DATO_KEY = '__sin_dato__' as const

/**
 * Normalizes text by removing accents, lowercasing and trimming for stable dictionary lookups.
 */
export function normalizeSearchCatalogText(text: string | null | undefined): string {
    if (!text) return ''
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

/**
 * Distributes 1000 permille (milésimas) among items using the Hamilton / Largest Remainder Method.
 * Guarantees that the sum of distributed permilles is EXACTLY 1000 when total > 0.
 */
export function distributePermillesLargestRemainder(
    counts: readonly number[],
    total: number,
): readonly number[] {
    if (total <= 0 || counts.length === 0) {
        return counts.map(() => 0)
    }

    const n = counts.length
    const floors: number[] = new Array<number>(n)
    const remainders: { index: number; remainder: number }[] = new Array(n)
    let sumFloors = 0

    for (let i = 0; i < n; i++) {
        const count = counts[i]!
        const rawPermille = (count / total) * 1000
        const floorVal = Math.floor(rawPermille)
        floors[i] = floorVal
        remainders[i] = { index: i, remainder: rawPermille - floorVal }
        sumFloors += floorVal
    }

    let surplus = 1000 - sumFloors
    // Sort by remainder descending, tie-break by index
    remainders.sort((a, b) => {
        if (b.remainder !== a.remainder) {
            return b.remainder - a.remainder
        }
        return a.index - b.index
    })

    for (let i = 0; i < remainders.length && surplus > 0; i++) {
        const item = remainders[i]!
        const idx = item.index
        floors[idx] = floors[idx]! + 1
        surplus--
    }

    return floors
}

export interface BuildPieDatasetOptions {
    readonly topN?: number | undefined
    readonly minPercentageThreshold?: number | undefined
    readonly sinDatoLabel?: string | undefined
    readonly otrosLabel?: string | undefined
}

interface RawSliceCandidate {
    readonly key: string
    readonly label: string
    readonly count: number
    readonly isSinDato: boolean
}

/**
 * Pure function to build a structured PieDataset with deterministic ranking,
 * threshold filtering, Otros grouping, and largest-remainder permille distribution.
 */
export function buildPieDataset(
    dimension: SearchDimension,
    countsMap: Readonly<Record<string, number>>,
    labelResolver: (key: string) => string,
    options: BuildPieDatasetOptions = {},
): PieDataset {
    const topN = options.topN ?? ANALYTICS_CONFIG.defaultTopN
    const minThresholdPct = options.minPercentageThreshold ?? ANALYTICS_CONFIG.minPercentageThreshold
    const otrosLabel = options.otrosLabel ?? 'Otros'

    // 1. Calculate overall total and distinct keys (filtering out zero or negative counts)
    const validEntries: RawSliceCandidate[] = []
    let total = 0
    let distinct = 0

    const keys = Object.keys(countsMap)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (!key) continue
        const count = countsMap[key] ?? 0
        if (count <= 0) continue

        total += count
        distinct++
        const isSinDato = key === SIN_DATO_KEY
        const label = isSinDato
            ? options.sinDatoLabel ?? 'Sin dato'
            : labelResolver(key)

        validEntries.push({
            key,
            label,
            count,
            isSinDato,
        })
    }

    if (total === 0 || validEntries.length === 0) {
        return {
            dimension,
            total: 0,
            distinct: 0,
            slices: [],
        }
    }

    // 2. Separate regular items from Sin Dato
    const regularItems: RawSliceCandidate[] = []
    let sinDatoCandidate: RawSliceCandidate | undefined = undefined

    for (let i = 0; i < validEntries.length; i++) {
        const item = validEntries[i]!
        if (item.isSinDato) {
            sinDatoCandidate = item
        } else {
            regularItems.push(item)
        }
    }

    // 3. Sort regular items deterministically: count DESC, then label ASC, then key ASC
    regularItems.sort((a, b) => {
        if (b.count !== a.count) {
            return b.count - a.count
        }
        const labelCompare = a.label.localeCompare(b.label, 'es-CO')
        if (labelCompare !== 0) {
            return labelCompare
        }
        return a.key.localeCompare(b.key)
    })

    // 4. Partition regular items into Top N (and above minThreshold) vs Candidates for "Otros"
    const topCandidates: RawSliceCandidate[] = []
    const tailCandidates: RawSliceCandidate[] = []

    for (let i = 0; i < regularItems.length; i++) {
        const item = regularItems[i]!
        const pct = (item.count / total) * 100
        if (i < topN && pct >= minThresholdPct) {
            topCandidates.push(item)
        } else {
            tailCandidates.push(item)
        }
    }

    // 5. Invariant I5: "Otros" never groups a single element!
    // If tailCandidates has exactly 1 element, promote it to top candidates so it shows as itself.
    if (tailCandidates.length === 1) {
        topCandidates.push(tailCandidates[0]!)
        tailCandidates.length = 0
    }

    // 6. Build the intermediate list of slices before permille distribution
    interface IntermediateSlice {
        key: string
        label: string
        count: number
        kind: SliceKind
        rank: number | null
        grouped?: {
            count: number
            top: readonly { label: string; count: number }[]
        } | undefined
    }

    const intermediate: IntermediateSlice[] = []

    // Add individual top items
    for (let i = 0; i < topCandidates.length; i++) {
        const item = topCandidates[i]!
        intermediate.push({
            key: item.key,
            label: item.label,
            count: item.count,
            kind: 'item',
            rank: i + 1,
        })
    }

    // Add "Otros" if tailCandidates has >= 2 elements
    if (tailCandidates.length > 0) {
        let otrosCount = 0
        for (let i = 0; i < tailCandidates.length; i++) {
            otrosCount += tailCandidates[i]!.count
        }

        // Top 3 for tooltip / summary detail
        const top3Grouped = tailCandidates.slice(0, 3).map((it) => ({
            key: it.key,
            label: it.label,
            count: it.count,
        }))

        intermediate.push({
            key: '__otros__',
            label: otrosLabel,
            count: otrosCount,
            kind: 'otros',
            rank: null,
            grouped: {
                count: tailCandidates.length,
                top: top3Grouped,
            },
        })
    }

    // Add "Sin Dato" at the very end if it exists
    if (sinDatoCandidate) {
        intermediate.push({
            key: SIN_DATO_KEY,
            label: sinDatoCandidate.label,
            count: sinDatoCandidate.count,
            kind: 'sin_dato',
            rank: null,
        })
    }

    // 7. Calculate exact fractions and permilles using Largest Remainder Method
    const sliceCounts = intermediate.map((s) => s.count)
    const permilles = distributePermillesLargestRemainder(sliceCounts, total)

    const finalSlices: PieSlice[] = intermediate.map((s, idx) => {
        const fraction = s.count / total
        const permille = permilles[idx]!
        return {
            key: s.key,
            label: s.label,
            count: s.count,
            fraction,
            permille,
            rank: s.rank,
            kind: s.kind,
            ...(s.grouped ? { grouped: s.grouped } : {}),
        }
    })

    return {
        dimension,
        total,
        distinct,
        slices: finalSlices,
    }
}

/**
 * Helper to format a slice's percentage for UI presentation (e.g. "14,3 %").
 */
export function formatSlicePercentage(permille: number): string {
    const pct = permille / 10
    return `${pct.toFixed(1).replace('.', ',')} %`
}
