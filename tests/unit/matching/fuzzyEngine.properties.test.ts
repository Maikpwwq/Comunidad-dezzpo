/**
 * Property-Based Tests for Fuzzy Engine Invariants (I1 - I7)
 *
 * Uses @fast-check/vitest to verify mathematical and behavioral invariants across
 * arbitrarily generated inputs.
 *
 * Invariants:
 * I1: score in [0.00, 1.00] and !isNaN(score)
 * I2: Determinism and client/server parity
 * I3: Refiners never drop a core pair below 0.50 nor elevate a non-core pair to >= 0.50
 * I4: Zone signal never alters the decision (with or without zone, decision is identical)
 * I5: Unknown data -> score = 0.50, decision = 'mostrar', never 'ocultar'
 * I6: Unimodality across every row and column of the base matrix
 * I7: Every output contains explanation and rulesApplied
 */

import { describe, it, expect } from 'vitest'
import { test, fc } from '@fast-check/vitest'
import {
    PROPERTY_TYPE_IDS,
    MERCHANT_STRUCTURE_IDS,
    FORMALITY_LEVELS,
    FUZZY_BASE_MATRIX,
    isCorePair,
} from '@config/matching.config'
import {
    evaluateFuzzyMatch,
    type ZoneSignalType,
} from '@services/matching/fuzzyEngine'

const ZONE_SIGNALS: ZoneSignalType[] = [
    'same_zone',
    'citywide_coverage',
    'other_zone',
    'no_zone_specified',
]

// Arbitrary generators
const propArb = fc.constantFrom(...PROPERTY_TYPE_IDS)
const structArb = fc.constantFrom(...MERCHANT_STRUCTURE_IDS)
const formalityArb = fc.constantFrom(...FORMALITY_LEVELS)
const zoneArb = fc.constantFrom(...ZONE_SIGNALS)
const fuzzyInputArb = fc.record({
    propertyType: fc.oneof(propArb, fc.string(), fc.constant(null), fc.constant(undefined)),
    merchantStructure: fc.oneof(structArb, fc.string(), fc.constant(null), fc.constant(undefined)),
    categoryFormality: fc.oneof(formalityArb, fc.integer({ min: 0, max: 91 }), fc.constant(undefined)),
    zoneSignal: fc.oneof(zoneArb, fc.constant(undefined)),
})

describe('Fuzzy Matching Engine Invariants (I1 - I7)', () => {
    // Invariant I1
    test.prop([fuzzyInputArb])('I1: score is always within [0, 1] and never NaN', (input) => {
        const result = evaluateFuzzyMatch(input)
        expect(Number.isNaN(result.score)).toBe(false)
        expect(Number.isNaN(result.baseScore)).toBe(false)
        expect(result.score).toBeGreaterThanOrEqual(0.0)
        expect(result.score).toBeLessThanOrEqual(1.0)
        expect(result.baseScore).toBeGreaterThanOrEqual(0.0)
        expect(result.baseScore).toBeLessThanOrEqual(1.0)
    })

    // Invariant I2
    test.prop([fuzzyInputArb])('I2: determinism - repeated evaluations on identical inputs produce identical outputs', (input) => {
        const result1 = evaluateFuzzyMatch(input)
        const result2 = evaluateFuzzyMatch(input)

        expect(result1.score).toBe(result2.score)
        expect(result1.baseScore).toBe(result2.baseScore)
        expect(result1.decision).toBe(result2.decision)
        expect(result1.band).toBe(result2.band)
        expect(result1.explanation).toBe(result2.explanation)
        expect(result1.rulesApplied).toEqual(result2.rulesApplied)
    })

    // Invariant I3
    test.prop([propArb, structArb, formalityArb, zoneArb])(
        'I3: refiners never drop a core pair out of "mostrar" nor elevate a non-core pair to "mostrar"',
        (propertyType, merchantStructure, categoryFormality, zoneSignal) => {
            const isCore = isCorePair(merchantStructure, propertyType)
            const result = evaluateFuzzyMatch({
                propertyType,
                merchantStructure,
                categoryFormality,
                zoneSignal,
            })

            if (isCore) {
                expect(result.decision).toBe('mostrar')
                expect(result.score).toBeGreaterThanOrEqual(0.50)
            } else {
                expect(result.decision).not.toBe('mostrar')
                expect(result.score).toBeLessThan(0.50)
            }
        }
    )

    // Invariant I4
    test.prop([propArb, structArb, formalityArb, zoneArb])(
        'I4: zone signal NEVER alters the visibility decision',
        (propertyType, merchantStructure, categoryFormality, zoneSignal) => {
            const baseline = evaluateFuzzyMatch({
                propertyType,
                merchantStructure,
                categoryFormality,
                zoneSignal: 'no_zone_specified',
            })

            const withZone = evaluateFuzzyMatch({
                propertyType,
                merchantStructure,
                categoryFormality,
                zoneSignal,
            })

            expect(withZone.decision).toBe(baseline.decision)
        }
    )

    // Invariant I5
    describe('I5: unknown data handling', () => {
        it('null/undefined merchantStructure results in score 0.50 and "mostrar", never "ocultar"', () => {
            for (const prop of PROPERTY_TYPE_IDS) {
                const res = evaluateFuzzyMatch({ propertyType: prop, merchantStructure: null })
                expect(res.score).toBe(0.50)
                expect(res.decision).toBe('mostrar')
                expect(res.rulesApplied).toContain('RULE_UNKNOWN_DATA_NEUTRAL')
            }
        })

        it('null/undefined propertyType results in score 0.50 and "mostrar", never "ocultar"', () => {
            for (const struct of MERCHANT_STRUCTURE_IDS) {
                const res = evaluateFuzzyMatch({ propertyType: null, merchantStructure: struct })
                expect(res.score).toBe(0.50)
                expect(res.decision).toBe('mostrar')
                expect(res.rulesApplied).toContain('RULE_UNKNOWN_DATA_NEUTRAL')
            }
        })

        it('completely empty input results in neutral 0.50 and "mostrar"', () => {
            const res = evaluateFuzzyMatch({ propertyType: undefined, merchantStructure: undefined })
            expect(res.score).toBe(0.50)
            expect(res.decision).toBe('mostrar')
        })
    })

    // Invariant I6
    describe('I6: unimodality across every row and column of the base matrix', () => {
        /**
         * Checks unimodality of a sequence: rises to a peak, then falls, without rising again.
         */
        function isUnimodal(seq: number[]): boolean {
            let hasDecreased = false
            for (let i = 1; i < seq.length; i++) {
                const prev = seq[i - 1]!
                const curr = seq[i]!
                if (curr < prev) {
                    hasDecreased = true
                } else if (curr > prev) {
                    if (hasDecreased) return false // Rose again after decreasing!
                }
            }
            return true
        }

        it('every row (merchant structure) in base matrix is unimodal across property types', () => {
            for (const struct of MERCHANT_STRUCTURE_IDS) {
                const rowValues = PROPERTY_TYPE_IDS.map((p) => FUZZY_BASE_MATRIX[struct][p])
                expect(isUnimodal(rowValues), `Row for ${struct} must be unimodal: ${rowValues.join(', ')}`).toBe(true)
            }
        })

        it('every column (property type) in base matrix is unimodal across merchant structures', () => {
            for (const prop of PROPERTY_TYPE_IDS) {
                const colValues = MERCHANT_STRUCTURE_IDS.map((s) => FUZZY_BASE_MATRIX[s][prop])
                expect(isUnimodal(colValues), `Column for ${prop} must be unimodal: ${colValues.join(', ')}`).toBe(true)
            }
        })
    })

    // Invariant I7
    test.prop([fuzzyInputArb])('I7: every decision includes explainable rules and non-empty explanation', (input) => {
        const result = evaluateFuzzyMatch(input)
        expect(result.explanation.trim().length).toBeGreaterThan(10)
        expect(result.rulesApplied.length).toBeGreaterThan(0)
    })
})
