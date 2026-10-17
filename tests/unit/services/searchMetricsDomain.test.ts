import { describe, it, expect } from 'vitest'
import {
    buildPieDataset,
    distributePermillesLargestRemainder,
    normalizeSearchCatalogText,
    formatSlicePercentage,
    SIN_DATO_KEY,
} from '@/services/admin/analytics/searchMetricsDomain'
import type { SearchDimension } from '@/services/admin/analytics/types'

describe('searchMetricsDomain — Pure Domain Unit Tests', () => {
    const mockResolver = (key: string) => `Servicio ${key}`

    describe('normalizeSearchCatalogText', () => {
        it('strips accents, lowercases and trims text', () => {
            expect(normalizeSearchCatalogText('  CÁMARAS DE SEGURIDAD  ')).toBe('camaras de seguridad')
            expect(normalizeSearchCatalogText('Plomería & Redes Hidrosanitarias')).toBe('plomeria & redes hidrosanitarias')
        })

        it('handles null and undefined gracefully', () => {
            expect(normalizeSearchCatalogText(null)).toBe('')
            expect(normalizeSearchCatalogText(undefined)).toBe('')
            expect(normalizeSearchCatalogText('')).toBe('')
        })
    })

    describe('distributePermillesLargestRemainder', () => {
        it('returns empty array when counts are empty', () => {
            expect(distributePermillesLargestRemainder([], 0)).toEqual([])
        })

        it('returns zeroes when total is 0 or negative', () => {
            expect(distributePermillesLargestRemainder([10, 20], 0)).toEqual([0, 0])
            expect(distributePermillesLargestRemainder([10, 20], -5)).toEqual([0, 0])
        })

        it('distributes 1000 permille accurately for simple halves', () => {
            const result = distributePermillesLargestRemainder([50, 50], 100)
            expect(result).toEqual([500, 500])
            expect(result[0]! + result[1]!).toBe(1000)
        })

        it('handles 3-way split (1/3 each) without rounding leakage (must sum to 1000)', () => {
            const result = distributePermillesLargestRemainder([1, 1, 1], 3)
            // 333 + 333 + 334 = 1000
            expect(result.reduce((a, b) => a + b, 0)).toBe(1000)
            expect(result).toEqual([334, 333, 333])
        })

        it('distributes uneven remainders according to highest remainder first', () => {
            // counts: 70, 20, 10 -> total 100 -> exactly 700, 200, 100
            const result = distributePermillesLargestRemainder([70, 20, 10], 100)
            expect(result).toEqual([700, 200, 100])
            expect(result.reduce((a, b) => a + b, 0)).toBe(1000)
        })
    })

    describe('buildPieDataset', () => {
        const dim: SearchDimension = 'servicio'

        it('returns empty dataset when map is empty', () => {
            const ds = buildPieDataset(dim, {}, mockResolver)
            expect(ds).toEqual({
                dimension: dim,
                total: 0,
                distinct: 0,
                slices: [],
            })
        })

        it('filters out zero and negative counts', () => {
            const ds = buildPieDataset(dim, { a: 10, b: 0, c: -5, '': 10 }, mockResolver)
            expect(ds.total).toBe(10)
            expect(ds.distinct).toBe(1)
            expect(ds.slices.length).toBe(1)
            expect(ds.slices[0]?.key).toBe('a')
            expect(ds.slices[0]?.permille).toBe(1000)
        })

        it('builds dataset with a single element as full circle (1000 permille)', () => {
            const ds = buildPieDataset(dim, { plomeria: 42 }, mockResolver)
            expect(ds.total).toBe(42)
            expect(ds.distinct).toBe(1)
            expect(ds.slices).toHaveLength(1)
            expect(ds.slices[0]).toEqual({
                key: 'plomeria',
                label: 'Servicio plomeria',
                count: 42,
                fraction: 1,
                permille: 1000,
                rank: 1,
                kind: 'item',
            })
        })

        it('orders elements deterministically by count DESC, then label ASC, then key ASC', () => {
            const customResolver = (k: string) => {
                if (k === 'k1') return 'Beta'
                if (k === 'k2') return 'Alpha'
                if (k === 'k3') return 'Alpha'
                return k
            }

            // k2 and k3 have same count 50 and same label 'Alpha', so key ASC breaks tie ('k2' < 'k3')
            // k1 has count 50 but label 'Beta' -> comes after Alpha
            const counts = { k1: 50, k3: 50, k2: 50, top: 100 }
            const ds = buildPieDataset(dim, counts, customResolver)

            expect(ds.slices.map(s => s.key)).toEqual(['top', 'k2', 'k3', 'k1'])
            expect(ds.slices[0]?.rank).toBe(1)
            expect(ds.slices[1]?.rank).toBe(2)
            expect(ds.slices[2]?.rank).toBe(3)
            expect(ds.slices[3]?.rank).toBe(4)
        })

        it('places Otros at the end and never groups a single item (Invariant I5)', () => {
            // With topN=2:
            // S1 (100), S2 (80), S3 (2)
            // S3 is the only one in tail -> tail length is 1 -> MUST be shown as itself!
            const counts = { s1: 100, s2: 80, s3: 20 }
            const ds = buildPieDataset(dim, counts, mockResolver, { topN: 2 })

            // Because tail has only 1 item, it is promoted to top so Otros is NOT created!
            expect(ds.slices.map(s => s.key)).toEqual(['s1', 's2', 's3'])
            expect(ds.slices.some(s => s.kind === 'otros')).toBe(false)
        })

        it('groups into Otros when tail has 2 or more elements', () => {
            const counts = {
                s1: 100,
                s2: 80,
                s3: 10,
                s4: 5,
            }
            const ds = buildPieDataset(dim, counts, mockResolver, { topN: 2 })

            expect(ds.slices).toHaveLength(3)
            expect(ds.slices[0]?.key).toBe('s1')
            expect(ds.slices[1]?.key).toBe('s2')

            const otros = ds.slices[2]
            expect(otros?.key).toBe('__otros__')
            expect(otros?.kind).toBe('otros')
            expect(otros?.count).toBe(15) // 10 + 5
            expect(otros?.rank).toBeNull()
            expect(otros?.grouped).toBeDefined()
            expect(otros?.grouped?.count).toBe(2)
            expect(otros?.grouped?.top).toEqual([
                { key: 's3', label: 'Servicio s3', count: 10 },
                { key: 's4', label: 'Servicio s4', count: 5 },
            ])
        })

        it('groups items below minPercentageThreshold into Otros', () => {
            // Total = 1000. 1% is 10 count. minThreshold = 2% (20 count).
            // Items with count < 20 will be in tail.
            const counts = {
                s1: 500,
                s2: 460,
                s3: 15, // 1.5%
                s4: 15, // 1.5%
                s5: 10, // 1.0%
            }
            const ds = buildPieDataset(dim, counts, mockResolver, { topN: 7, minPercentageThreshold: 2.0 })

            expect(ds.slices).toHaveLength(3) // s1, s2, Otros
            expect(ds.slices[0]?.key).toBe('s1')
            expect(ds.slices[1]?.key).toBe('s2')
            expect(ds.slices[2]?.key).toBe('__otros__')
            expect(ds.slices[2]?.count).toBe(40)
            expect(ds.slices[2]?.grouped?.count).toBe(3)
        })

        it('places Sin dato at the very end with custom label', () => {
            const counts = {
                s1: 60,
                s2: 30,
                [SIN_DATO_KEY]: 10,
            }
            const ds = buildPieDataset(dim, counts, mockResolver, {
                sinDatoLabel: 'Sin zona indicada',
            })

            expect(ds.slices).toHaveLength(3)
            const sinDatoSlice = ds.slices[2]
            expect(sinDatoSlice?.key).toBe(SIN_DATO_KEY)
            expect(sinDatoSlice?.label).toBe('Sin zona indicada')
            expect(sinDatoSlice?.kind).toBe('sin_dato')
            expect(sinDatoSlice?.rank).toBeNull()
            expect(sinDatoSlice?.count).toBe(10)
            expect(sinDatoSlice?.permille).toBe(100)
        })

        it('places Otros before Sin dato when both exist (both at the end)', () => {
            const counts = {
                s1: 100,
                s2: 50,
                s3: 5,
                s4: 4,
                [SIN_DATO_KEY]: 20,
            }
            const ds = buildPieDataset(dim, counts, mockResolver, { topN: 2 })

            expect(ds.slices.map(s => s.kind)).toEqual(['item', 'item', 'otros', 'sin_dato'])
        })
    })

    describe('formatSlicePercentage', () => {
        it('formats permilles with 1 decimal and es-CO comma', () => {
            expect(formatSlicePercentage(500)).toBe('50,0 %')
            expect(formatSlicePercentage(143)).toBe('14,3 %')
            expect(formatSlicePercentage(7)).toBe('0,7 %')
            expect(formatSlicePercentage(1000)).toBe('100,0 %')
            expect(formatSlicePercentage(0)).toBe('0,0 %')
        })
    })
})
