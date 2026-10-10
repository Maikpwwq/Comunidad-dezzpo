/**
 * Golden Tests for Fuzzy Matching Engine
 *
 * Exhaustively evaluates the 20 pairs of the base matrix:
 * 4 merchant structures x 5 property types.
 *
 * AC-1 Verification:
 * With default thresholds, "mostrar" MUST EQUAL EXACTLY the 9 core pairs (núcleo duro)
 * and NONE of the remaining 11 pairs.
 */

import { describe, it, expect } from 'vitest'
import {
    PROPERTY_TYPE_IDS,
    MERCHANT_STRUCTURE_IDS,
    CORE_PAIRS,
    FUZZY_BASE_MATRIX,
    isCorePair,
    MATCH_CONFIG,
    type PropertyTypeId,
    type MerchantStructureId,
} from '@config/matching.config'
import {
    evaluateFuzzyMatch,
    getCompatibleStructuresForProperty,
    getCompatiblePropertiesForStructure,
} from '@services/matching/fuzzyEngine'

describe('AC-1 Golden Test: 20-Pair Matrix & Core 9-Pair Invariance', () => {
    it('matrix contains exactly 20 distinct structure x property pairs', () => {
        expect(MERCHANT_STRUCTURE_IDS).toHaveLength(4)
        expect(PROPERTY_TYPE_IDS).toHaveLength(5)

        let pairCount = 0
        for (const structure of MERCHANT_STRUCTURE_IDS) {
            for (const propertyType of PROPERTY_TYPE_IDS) {
                pairCount++
                expect(FUZZY_BASE_MATRIX[structure][propertyType]).toBeDefined()
            }
        }
        expect(pairCount).toBe(20)
    })

    it('core pairs array contains exactly 9 pairs', () => {
        expect(CORE_PAIRS).toHaveLength(9)
    })

    it('all 9 core pairs have baseScore >= 0.90 in the base matrix', () => {
        for (const pair of CORE_PAIRS) {
            const baseScore = FUZZY_BASE_MATRIX[pair.structure][pair.propertyType]
            expect(baseScore).toBeGreaterThanOrEqual(0.90)
        }
    })

    it('all 11 non-core pairs have baseScore < 0.50 in the base matrix', () => {
        for (const structure of MERCHANT_STRUCTURE_IDS) {
            for (const propertyType of PROPERTY_TYPE_IDS) {
                if (!isCorePair(structure, propertyType)) {
                    const baseScore = FUZZY_BASE_MATRIX[structure][propertyType]
                    expect(baseScore).toBeLessThan(MATCH_CONFIG.thresholds.mostrar)
                }
            }
        }
    })

    it('evaluateFuzzyMatch yields "mostrar" ONLY for the 9 core pairs and NEVER for the 11 others', () => {
        const shownPairs: Array<{ structure: MerchantStructureId; propertyType: PropertyTypeId }> = []
        const otherPairs: Array<{ structure: MerchantStructureId; propertyType: PropertyTypeId; decision: string }> = []

        for (const structure of MERCHANT_STRUCTURE_IDS) {
            for (const propertyType of PROPERTY_TYPE_IDS) {
                const result = evaluateFuzzyMatch({ merchantStructure: structure, propertyType })
                if (result.decision === 'mostrar') {
                    shownPairs.push({ structure, propertyType })
                } else {
                    otherPairs.push({ structure, propertyType, decision: result.decision })
                }
            }
        }

        // Exactly 9 shown pairs
        expect(shownPairs).toHaveLength(9)
        expect(otherPairs).toHaveLength(11)

        // The shown pairs must match the 9 core pairs
        for (const corePair of CORE_PAIRS) {
            const found = shownPairs.some(
                (p) => p.structure === corePair.structure && p.propertyType === corePair.propertyType
            )
            expect(found, `Core pair ${corePair.structure} x ${corePair.propertyType} must be shown`).toBe(true)
        }

        // Every non-core pair must have decision 'degradar' or 'ocultar'
        for (const item of otherPairs) {
            expect(isCorePair(item.structure, item.propertyType)).toBe(false)
            expect(['degradar', 'ocultar']).toContain(item.decision)
        }
    })

    describe('Query helper parity (getCompatibleStructuresForProperty)', () => {
        it('for hogar returns exactly persona_natural and micro_empresa', () => {
            const structures = getCompatibleStructuresForProperty('hogar', 'mostrar')
            expect(structures).toEqual(['persona_natural', 'micro_empresa'])
        })

        it('for negocio returns exactly micro_empresa and pyme_servicios', () => {
            const structures = getCompatibleStructuresForProperty('negocio', 'mostrar')
            expect(structures).toEqual(['micro_empresa', 'pyme_servicios'])
        })

        it('for propiedad_horizontal returns exactly micro_empresa and pyme_servicios', () => {
            const structures = getCompatibleStructuresForProperty('propiedad_horizontal', 'mostrar')
            expect(structures).toEqual(['micro_empresa', 'pyme_servicios'])
        })

        it('for inmobiliaria returns exactly pyme_servicios and empresa', () => {
            const structures = getCompatibleStructuresForProperty('inmobiliaria', 'mostrar')
            expect(structures).toEqual(['pyme_servicios', 'empresa'])
        })

        it('for aliado_estrategico returns exactly empresa', () => {
            const structures = getCompatibleStructuresForProperty('aliado_estrategico', 'mostrar')
            expect(structures).toEqual(['empresa'])
        })
    })

    describe('Query helper parity (getCompatiblePropertiesForStructure)', () => {
        it('for persona_natural returns exactly hogar', () => {
            const props = getCompatiblePropertiesForStructure('persona_natural', 'mostrar')
            expect(props).toEqual(['hogar'])
        })

        it('for micro_empresa returns hogar, negocio and propiedad_horizontal', () => {
            const props = getCompatiblePropertiesForStructure('micro_empresa', 'mostrar')
            expect(props).toEqual(['hogar', 'negocio', 'propiedad_horizontal'])
        })

        it('for pyme_servicios returns negocio, propiedad_horizontal and inmobiliaria', () => {
            const props = getCompatiblePropertiesForStructure('pyme_servicios', 'mostrar')
            expect(props).toEqual(['negocio', 'propiedad_horizontal', 'inmobiliaria'])
        })

        it('for empresa returns inmobiliaria and aliado_estrategico', () => {
            const props = getCompatiblePropertiesForStructure('empresa', 'mostrar')
            expect(props).toEqual(['inmobiliaria', 'aliado_estrategico'])
        })
    })
})
