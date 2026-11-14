import { describe, it, expect } from 'vitest'
import {
    ARCHITECTURAL_STYLES,
    getStyleBySlug,
    estimateStyleBudget,
} from '@/services/inspiration/architecturalStyles'

describe('Architectural Styles Catalog (T-I8.1)', () => {
    it('contains exactly 12 architectural styles', () => {
        expect(ARCHITECTURAL_STYLES.length).toBe(12)
    })

    it('every style has a non-empty palette, materials, and recommended trades', () => {
        for (const style of ARCHITECTURAL_STYLES) {
            expect(style.palette.length).toBeGreaterThanOrEqual(3)
            expect(style.keyMaterials.length).toBeGreaterThanOrEqual(2)
            expect(style.recommendedTrades.length).toBeGreaterThanOrEqual(1)
            expect(style.typicalBudgetRange.minCopPerM2).toBeGreaterThan(0)
            expect(style.typicalBudgetRange.maxCopPerM2).toBeGreaterThan(
                style.typicalBudgetRange.minCopPerM2
            )
        }
    })

    it('retrieves style by slug or id', () => {
        const nordic = getStyleBySlug('nordico-calmo')
        expect(nordic).toBeDefined()
        expect(nordic?.name).toContain('Nórdico')

        const industrial = getStyleBySlug('style-industrial')
        expect(industrial).toBeDefined()
        expect(industrial?.name).toContain('Industrial')
    })

    it('calculates estimated budget accurately based on area in m2', () => {
        const style = ARCHITECTURAL_STYLES[0]!
        const budget = estimateStyleBudget(style, 25)
        expect(budget.minCop).toBe(style.typicalBudgetRange.minCopPerM2 * 25)
        expect(budget.maxCop).toBe(style.typicalBudgetRange.maxCopPerM2 * 25)
    })
})
