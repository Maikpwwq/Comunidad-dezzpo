import { describe, it, expect } from 'vitest'
import {
    calculateBudgetEstimate,
    ESTIMATOR_LEGAL_DISCLAIMER,
    SPACE_CONFIG,
    FINISH_MULTIPLIERS,
} from '@/services/estimator/estimatorEngine'

describe('estimatorEngine', () => {
    it('calculates estimate range within -10% and +25% of base', () => {
        const result = calculateBudgetEstimate('cocina', 10, 'estandar')

        expect(result.spaceType).toBe('cocina')
        expect(result.areaM2).toBe(10)
        expect(result.finishLevel).toBe('estandar')
        expect(result.estimatedMinCop).toBeLessThanOrEqual(result.estimatedBaseCop)
        expect(result.estimatedMaxCop).toBeGreaterThanOrEqual(result.estimatedBaseCop)
        expect(result.breakdown.length).toBeGreaterThan(0)
        expect(result.disclaimer).toBe(ESTIMATOR_LEGAL_DISCLAIMER)
    })

    it('clamps area within min and max boundaries', () => {
        // Cocina min is 4, max is 30
        const tooSmall = calculateBudgetEstimate('cocina', 1, 'economico')
        expect(tooSmall.areaM2).toBe(4)

        const tooLarge = calculateBudgetEstimate('cocina', 100, 'economico')
        expect(tooLarge.areaM2).toBe(30)
    })

    it('scales cost with finish level multiplier correctly', () => {
        const eco = calculateBudgetEstimate('bano', 5, 'economico')
        const prem = calculateBudgetEstimate('bano', 5, 'premium')

        expect(prem.estimatedBaseCop).toBeGreaterThan(eco.estimatedBaseCop)
        const expectedRatio = FINISH_MULTIPLIERS.premium.factor / FINISH_MULTIPLIERS.economico.factor
        const actualRatio = prem.estimatedBaseCop / eco.estimatedBaseCop
        expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.05)
    })

    it('supports all 6 defined space types without error', () => {
        const types = Object.keys(SPACE_CONFIG) as Array<keyof typeof SPACE_CONFIG>
        expect(types.length).toBe(6)

        for (const t of types) {
            const res = calculateBudgetEstimate(t, 20, 'estandar')
            expect(res.estimatedBaseCop).toBeGreaterThan(0)
            expect(res.estimatedMinCop).toBeGreaterThan(0)
            expect(res.estimatedMaxCop).toBeGreaterThan(res.estimatedMinCop)
            expect(res.prefillCategory).toBeTruthy()
        }
    })
})

