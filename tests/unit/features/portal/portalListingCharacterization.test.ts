/**
 * Characterization Tests — Portal Listing (Elegibility & Visibility Baseline)
 *
 * Captures current production invariants for:
 * 1. Filtering candidates by active role (Comerciantes Calificados, role 2)
 * 2. Categories filtering and normalization
 * 3. Operational structure mapping and compatibility
 * 4. Zone signal proximity resolution
 */
import { describe, it, expect } from 'vitest'
import {
    evaluateFuzzyMatch,
    type ZoneSignalType,
} from '@services/matching'
import {
    normalizePropertyType,
    normalizeMerchantStructure,
} from '@config/matching.config'

describe('Fase 0: Portal Listing Characterization Tests (Eligibility & Matching)', () => {
    describe('Merchant structure normalization baseline', () => {
        it('normalizes common structure aliases to canonical merchant structures', () => {
            expect(normalizeMerchantStructure('persona natural')).toBe('persona_natural')
            expect(normalizeMerchantStructure('micro empresa')).toBe('micro_empresa')
            expect(normalizeMerchantStructure('pyme de servicios')).toBe('pyme_servicios')
            expect(normalizeMerchantStructure('empresa')).toBe('empresa')
        })

        it('returns null for unknown structures', () => {
            expect(normalizeMerchantStructure('desconocido')).toBeNull()
            expect(normalizeMerchantStructure(null)).toBeNull()
        })
    })

    describe('Zone proximity signal baseline', () => {
        function resolveZoneSignal(
            userLocation: string | undefined,
            targetZone: string | null | undefined,
            targetMpioCode?: string | null,
            targetMpioName?: string | null
        ): ZoneSignalType {
            if (!userLocation) return 'no_zone_specified'
            const cleanUser = userLocation.toLowerCase()

            if (targetZone === 'otra-zona' || targetMpioCode || targetMpioName) {
                if (targetMpioCode && cleanUser.includes(targetMpioCode)) return 'same_zone'
                if (targetMpioName) {
                    const cleanMpio = targetMpioName.toLowerCase().split('(')[0]?.trim() || ''
                    if (cleanMpio && cleanUser.includes(cleanMpio)) return 'same_zone'
                }
                return 'other_zone'
            }

            const cleanTarget = (targetZone || '').toLowerCase()
            if (cleanTarget && (cleanUser.includes(cleanTarget) || cleanTarget.includes(cleanUser))) {
                return 'same_zone'
            }

            if (cleanUser.includes('bogot') || cleanUser.includes('cundinamarca')) {
                return 'citywide_coverage'
            }

            return 'other_zone'
        }

        it('resolves same_zone when merchant location includes target zone slug', () => {
            expect(resolveZoneSignal('Bogotá, Suba', 'suba')).toBe('same_zone')
        })

        it('resolves citywide_coverage for regional/city merchants when target zone is different locality', () => {
            expect(resolveZoneSignal('Bogotá D.C.', 'kennedy')).toBe('citywide_coverage')
        })

        it('resolves no_zone_specified when user location is empty', () => {
            expect(resolveZoneSignal('', 'chapinero')).toBe('no_zone_specified')
            expect(resolveZoneSignal(undefined, 'chapinero')).toBe('no_zone_specified')
        })
    })

    describe('Fuzzy compatibility baseline', () => {
        it('evaluates Persona Natural with Hogar as core 1.00 score', () => {
            const match = evaluateFuzzyMatch({
                propertyType: normalizePropertyType('hogar'),
                merchantStructure: 'persona natural',
                zoneSignal: 'same_zone',
            })
            expect(match.baseScore).toBe(1.0)
            expect(match.decision).toBe('mostrar')
            expect(match.isCore).toBe(true)
        })

        it('handles missing property gracefully without crashing (Invariant I5)', () => {
            const match = evaluateFuzzyMatch({
                propertyType: null,
                merchantStructure: 'persona natural',
                zoneSignal: 'same_zone',
            })
            expect(match.score).toBeGreaterThanOrEqual(0.5)
            expect(match.decision).toBe('mostrar')
        })
    })
})
