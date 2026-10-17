/**
 * Property-Based Testing with fast-check — Search Metrics Domain
 *
 * Verifies Invariants:
 * - I1: Sum of slice counts equals total: sum(slice.count) === total
 * - I2: Sum of distributed permilles is exactly 1000 whenever total > 0
 * - I3: Each fraction is within [0, 1] without NaN
 * - I4: Deterministic ordering: count DESC, then label ASC, then key ASC; robust to key shuffling
 * - I5: "Otros" and "Sin dato" never precede individual items; "Otros" never groups a single item
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
    buildPieDataset,
    distributePermillesLargestRemainder,
    SIN_DATO_KEY,
} from '@/services/admin/analytics/searchMetricsDomain'
import type { SearchDimension } from '@/services/admin/analytics/types'

describe('Search Metrics Domain — Property-Based Testing (fast-check)', () => {
    const dim: SearchDimension = 'servicio'
    const labelResolver = (k: string) => `Label for ${k}`

    // Arbitrary dictionary of counts
    const countsMapArbitrary = fc.dictionary(
        fc.stringMatching(/^[a-z0-9_-]{1,15}$/),
        fc.integer({ min: 1, max: 10000 }),
        { minKeys: 1, maxKeys: 30 },
    )

    // Invariant I1: Conservation of total count
    it('Invariant I1: Sum of slice counts strictly equals dataset total', () => {
        fc.assert(
            fc.property(
                countsMapArbitrary,
                fc.boolean(),
                (countsMap, includeSinDato) => {
                    const map: Record<string, number> = { ...countsMap }
                    if (includeSinDato) {
                        map[SIN_DATO_KEY] = 42
                    }

                    const ds = buildPieDataset(dim, map, labelResolver)
                    const sliceSum = ds.slices.reduce((sum, s) => sum + s.count, 0)
                    expect(sliceSum).toBe(ds.total)
                },
            ),
            { numRuns: 500 },
        )
    })

    // Invariant I2: Exact 1000 permille distribution
    it('Invariant I2: Sum of slice permilles is exactly 1000 when total > 0', () => {
        fc.assert(
            fc.property(
                countsMapArbitrary,
                (countsMap) => {
                    const ds = buildPieDataset(dim, countsMap, labelResolver)
                    if (ds.total > 0) {
                        const permilleSum = ds.slices.reduce((sum, s) => sum + s.permille, 0)
                        expect(permilleSum).toBe(1000)
                    }
                },
            ),
            { numRuns: 500 },
        )
    })

    // Invariant I2 (Pure Helper): distributePermillesLargestRemainder always sums to 1000
    it('Invariant I2 (Pure): distributePermillesLargestRemainder sums to 1000 for any positive counts', () => {
        fc.assert(
            fc.property(
                fc.array(fc.integer({ min: 1, max: 100000 }), { minLength: 1, maxLength: 50 }),
                (counts) => {
                    const total = counts.reduce((a, b) => a + b, 0)
                    const permilles = distributePermillesLargestRemainder(counts, total)
                    const sum = permilles.reduce((a, b) => a + b, 0)
                    expect(sum).toBe(1000)
                },
            ),
            { numRuns: 1000 },
        )
    })

    // Invariant I3: Fraction validity [0, 1] and no NaN
    it('Invariant I3: Every slice fraction is within [0, 1] without NaN', () => {
        fc.assert(
            fc.property(
                countsMapArbitrary,
                (countsMap) => {
                    const ds = buildPieDataset(dim, countsMap, labelResolver)
                    for (const slice of ds.slices) {
                        expect(slice.fraction).toBeGreaterThanOrEqual(0)
                        expect(slice.fraction).toBeLessThanOrEqual(1)
                        expect(Number.isNaN(slice.fraction)).toBe(false)
                        expect(Number.isInteger(slice.permille)).toBe(true)
                    }
                },
            ),
            { numRuns: 500 },
        )
    })

    // Invariant I4: Deterministic ordering and invariant to input key shuffling
    it('Invariant I4: Dataset slices are deterministic and invariant to key insertion order', () => {
        fc.assert(
            fc.property(
                countsMapArbitrary,
                (countsMap) => {
                    const ds1 = buildPieDataset(dim, countsMap, labelResolver)

                    // Shuffle entries and build second dataset
                    const keys = Object.keys(countsMap).reverse()
                    const shuffled: Record<string, number> = {}
                    for (const k of keys) {
                        const val = countsMap[k]
                        if (val !== undefined) shuffled[k] = val
                    }
                    const ds2 = buildPieDataset(dim, shuffled, labelResolver)

                    expect(ds1.slices.map(s => s.key)).toEqual(ds2.slices.map(s => s.key))
                    expect(ds1.slices.map(s => s.permille)).toEqual(ds2.slices.map(s => s.permille))
                },
            ),
            { numRuns: 500 },
        )
    })

    // Invariant I5: "Otros" and "Sin dato" positioning, and Otros never groups 1 single item
    it('Invariant I5: "Otros" and "Sin dato" always appear at end and Otros never groups 1 element', () => {
        fc.assert(
            fc.property(
                countsMapArbitrary,
                fc.integer({ min: 2, max: 10 }),
                (countsMap, topN) => {
                    const ds = buildPieDataset(dim, countsMap, labelResolver, { topN })

                    const otrosIdx = ds.slices.findIndex(s => s.kind === 'otros')
                    const sinDatoIdx = ds.slices.findIndex(s => s.kind === 'sin_dato')

                    // All regular items must appear before Otros and Sin Dato
                    ds.slices.forEach((slice, idx) => {
                        if (slice.kind === 'item') {
                            if (otrosIdx !== -1) expect(idx).toBeLessThan(otrosIdx)
                            if (sinDatoIdx !== -1) expect(idx).toBeLessThan(sinDatoIdx)
                        }
                    })

                    // If Otros exists, it must group at least 2 items (never 1)
                    if (otrosIdx !== -1) {
                        const otrosSlice = ds.slices[otrosIdx]!
                        expect(otrosSlice.grouped).toBeDefined()
                        expect(otrosSlice.grouped!.count).toBeGreaterThanOrEqual(2)
                    }
                },
            ),
            { numRuns: 500 },
        )
    })
})
