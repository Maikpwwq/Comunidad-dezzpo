/**
 * Coverage Zones Pure Domain Unit & Property Tests
 *
 * Verifies Invariants I1–I5, I8 and domain rules:
 * - I1: parseStoredZones is total, never throws, and never loses unrecognized tags
 * - I2: searchZones is case/accent-insensitive, deterministic, and deduplicated
 * - I3: 'otra-zona' and unrecognized items do not count toward the cap
 * - I5: Same query & catalog always yields identical ranking
 * - I8: Cap preserves grandfathered selections beyond max
 */

import { describe, it, expect } from 'vitest'
import {
    buildUnifiedCatalog,
    merchantCoversZone,
} from '../../../../src/features/zones/domain/catalog'
import {
    searchZones,
} from '../../../../src/features/zones/domain/search'
import {
    parseStoredZones,
    canAddZone,
    formatZoneCount,
    resolveZoneDisplay,
} from '../../../../src/features/zones/domain/parser'
import type { DivipolaMunicipality } from '@services/matching/divipolaService'

const sampleDivipola: DivipolaMunicipality[] = [
    {
        code: '11001',
        departamentoCode: '11',
        municipio: 'Bogotá, D.C.',
        departamento: 'Bogotá, D.C.',
        label: 'Bogotá, D.C., Bogotá, D.C.',
        normalized: 'bogota d.c. bogota d.c.',
    },
    {
        code: '25754',
        departamentoCode: '25',
        municipio: 'Soacha',
        departamento: 'Cundinamarca',
        label: 'Soacha, Cundinamarca',
        normalized: 'soacha cundinamarca',
    },
    {
        code: '05001',
        departamentoCode: '05',
        municipio: 'Medellín',
        departamento: 'Antioquia',
        label: 'Medellín, Antioquia',
        normalized: 'medellin antioquia',
    },
    {
        code: '76001',
        departamentoCode: '76',
        municipio: 'Cali',
        departamento: 'Valle Del Cauca',
        label: 'Cali, Valle Del Cauca',
        normalized: 'cali valle del cauca',
    },
    {
        code: '54001',
        departamentoCode: '54',
        municipio: 'Cúcuta',
        departamento: 'Norte De Santander',
        label: 'Cúcuta, Norte De Santander',
        normalized: 'cucuta norte de santander',
    },
    {
        code: '68001',
        departamentoCode: '68',
        municipio: 'Bucaramanga',
        departamento: 'Santander',
        label: 'Bucaramanga, Santander',
        normalized: 'bucaramanga santander',
    },
]

describe('Coverage Zones Domain Logic', () => {
    describe('Invariant I1: parseStoredZones is total and never loses data', () => {
        it('handles null, undefined, primitives and empty array without throwing', () => {
            expect(parseStoredZones(null)).toEqual({
                zoneIds: [],
                hasLegacyOtherZone: false,
                unrecognized: [],
            })
            expect(parseStoredZones(undefined)).toEqual({
                zoneIds: [],
                hasLegacyOtherZone: false,
                unrecognized: [],
            })
            expect(parseStoredZones([])).toEqual({
                zoneIds: [],
                hasLegacyOtherZone: false,
                unrecognized: [],
            })
            expect(parseStoredZones('suba')).toEqual({
                zoneIds: ['suba'],
                hasLegacyOtherZone: false,
                unrecognized: [],
            })
        })

        it('recognizes curated slugs and separates legacy "otra-zona"', () => {
            const raw = ['suba', 'usaquen', 'otra-zona', 'soacha']
            const state = parseStoredZones(raw, sampleDivipola)
            expect(state.zoneIds).toContain('suba')
            expect(state.zoneIds).toContain('usaquen')
            expect(state.zoneIds).toContain('soacha')
            expect(state.hasLegacyOtherZone).toBe(true)
            expect(state.unrecognized).toEqual([])
        })

        it('recognizes 5-digit DANE codes as valid zoneIds', () => {
            const raw = ['05001', '76001']
            const state = parseStoredZones(raw, sampleDivipola)
            expect(state.zoneIds).toEqual(['05001', '76001'])
            expect(state.hasLegacyOtherZone).toBe(false)
        })

        it('preserves unknown strings in unrecognized array without dropping them', () => {
            const raw = ['suba', 'zona_extraterrestre_99', 'otra-zona', 'barrio_antiguo_1920']
            const state = parseStoredZones(raw, sampleDivipola)
            expect(state.zoneIds).toEqual(['suba'])
            expect(state.hasLegacyOtherZone).toBe(true)
            expect(state.unrecognized).toContain('zona_extraterrestre_99')
            expect(state.unrecognized).toContain('barrio_antiguo_1920')
        })

        it('deduplicates recognized IDs', () => {
            const raw = ['suba', 'suba', 'suba']
            const state = parseStoredZones(raw)
            expect(state.zoneIds).toEqual(['suba'])
        })
    })

    describe('Invariant I2: Catalog deduplication and search invariance', () => {
        it('deduplicates curated municipalities against DIVIPOLA (Soacha and Bogotá appear once)', () => {
            const catalog = buildUnifiedCatalog(sampleDivipola)
            const soachaItems = catalog.filter((opt) => opt.id === 'soacha' || opt.daneCode === '25754')
            expect(soachaItems.length).toBe(1)
            expect(soachaItems[0]?.id).toBe('soacha')
            expect(soachaItems[0]?.curated).toBe(true)
            expect(soachaItems[0]?.daneCode).toBe('25754')

            const bogotaItems = catalog.filter((opt) => opt.id === 'bogota' || opt.daneCode === '11001')
            expect(bogotaItems.length).toBe(1)
            expect(bogotaItems[0]?.id).toBe('bogota')
        })

        it('searches regardless of accents, case, and whitespace', () => {
            const catalog = buildUnifiedCatalog(sampleDivipola)
            const resLower = searchZones(catalog, 'medellin', { selectedIds: new Set() })
            const resAccents = searchZones(catalog, 'MEDELLÍN', { selectedIds: new Set() })
            const resSpaces = searchZones(catalog, '   mÉdÉllIn   ', { selectedIds: new Set() })

            expect(resLower.length).toBeGreaterThan(0)
            expect(resLower[0]?.option.id).toBe('05001')
            expect(resLower[0]?.option.id).toBe(resAccents[0]?.option.id)
            expect(resLower[0]?.option.id).toBe(resSpaces[0]?.option.id)
        })

        it('disambiguates by department query (e.g. searching "Santander" finds Santander locations)', () => {
            const catalog = buildUnifiedCatalog(sampleDivipola)
            const results = searchZones(catalog, 'Santander', { selectedIds: new Set() })
            expect(results.length).toBeGreaterThan(0)
            const hasSantander = results.some((r) => r.option.parentLabel?.includes('Santander'))
            expect(hasSantander).toBe(true)
        })
    })

    describe('Invariant I3: Cap evaluation and "otra-zona" non-counting', () => {
        it('does not count "otra-zona" nor unrecognized items toward the cap', () => {
            const state = {
                zoneIds: ['suba', 'usaquen', 'chapinero'], // 3 real zones
                hasLegacyOtherZone: true,                 // 1 legacy item
                unrecognized: ['barrio_desconocido'],      // 1 unrecognized item
            }
            // Max 15: With 3 real zones, canAddZone must be true
            expect(canAddZone(state, 15)).toBe(true)
            expect(canAddZone(state, 3)).toBe(false) // 3 < 3 is false
        })
    })

    describe('Invariant I5: Deterministic ranking order', () => {
        it('produces identical result order across multiple calls', () => {
            const catalog = buildUnifiedCatalog(sampleDivipola)
            const query = 'c'
            const run1 = searchZones(catalog, query, { selectedIds: new Set() }).map((r) => r.option.id)
            const run2 = searchZones(catalog, query, { selectedIds: new Set() }).map((r) => r.option.id)
            const run3 = searchZones(catalog, query, { selectedIds: new Set() }).map((r) => r.option.id)

            expect(run1).toEqual(run2)
            expect(run2).toEqual(run3)
        })

        it('ranks prefix matches on name above substring matches', () => {
            const catalog = buildUnifiedCatalog(sampleDivipola)
            // "Cali" starts with "Cal", whereas "Cundinamarca" has "C" but is a department
            const results = searchZones(catalog, 'cali', { selectedIds: new Set() })
            expect(results[0]?.option.label).toBe('Cali')
        })
    })

    describe('Invariant I8: Grandfathering for existing profiles exceeding cap', () => {
        it('preserves all zones for a profile that already exceeds the max cap', () => {
            const sixteenZones = [
                'suba', 'usaquen', 'chapinero', 'teusaquillo', 'kennedy',
                'engativa', 'fontibon', 'barrios-unidos', 'bosa', 'puente-aranda',
                'los-martires', 'santa-fe', 'san-cristobal', 'usme', 'tunjuelito',
                'antonio-narino'
            ]
            const state = parseStoredZones(sixteenZones)
            expect(state.zoneIds.length).toBe(16)
            // Cannot add more zones
            expect(canAddZone(state, 15)).toBe(false)
        })
    })

    describe('Invariant I6: merchantCoversZone consumer compatibility', () => {
        it('matches zone slug directly', () => {
            expect(merchantCoversZone(['suba', 'usaquen'], 'suba')).toBe(true)
            expect(merchantCoversZone(['suba'], 'kennedy')).toBe(false)
        })

        it('matches cross-representation between DANE code and curated slug (Soacha)', () => {
            // Target is slug 'soacha', merchant stored DANE code '25754'
            expect(merchantCoversZone(['25754'], 'soacha')).toBe(true)
            // Target is DANE code '25754', merchant stored slug 'soacha'
            expect(merchantCoversZone(['soacha'], '25754')).toBe(true)
        })

        it('returns true if citywide coverage is enabled', () => {
            expect(merchantCoversZone([], 'cali', true)).toBe(true)
            expect(merchantCoversZone(['suba'], 'medellin', true)).toBe(true)
        })

        it('enforces business rule: "otra-zona" without specifying does NOT cover any zone', () => {
            expect(merchantCoversZone(['otra-zona'], 'suba')).toBe(false)
            expect(merchantCoversZone(['otra-zona'], 'otra-zona')).toBe(false)
            expect(merchantCoversZone(['otra-zona'], 'cali')).toBe(false)
        })
    })

    describe('Formatting & Display Helpers', () => {
        it('correctly pluralizes count in Colombian Spanish', () => {
            expect(formatZoneCount(0)).toBe('0 zonas seleccionadas')
            expect(formatZoneCount(1)).toBe('1 zona seleccionada')
            expect(formatZoneCount(2)).toBe('2 zonas seleccionadas')
            expect(formatZoneCount(15)).toBe('15 zonas seleccionadas')
        })

        it('resolves friendly display for curated slugs and DANE codes', () => {
            expect(resolveZoneDisplay('suba')).toEqual({
                label: 'Suba',
                parentLabel: 'Bogotá D.C.',
            })
            expect(resolveZoneDisplay('05001', sampleDivipola)).toEqual({
                label: 'Medellín',
                parentLabel: 'Antioquia',
            })
        })
    })
})

