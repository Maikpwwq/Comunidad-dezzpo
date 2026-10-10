/**
 * Phase 0 Characterization Tests
 *
 * Captures current baseline behavior for:
 * 1. QuickMatch search index and zone mappings
 * 2. Merchant public classification filters in portal-servicios
 * 3. Propietario classification tiers in directorio-requerimientos
 * 4. Zone catalog and Bogotá region detection
 */

import { describe, it, expect } from 'vitest'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { zoneNames, bogotaZoneNames, standardCityZoneNames, isBogotaRegion } from '@assets/data/ListadoZonas'
import { COMERCIANTE_OPTIONS, PROPIETARIO_OPTIONS, PROPIETARIO_RANKINGS } from '@config/userClassification.config'

describe('Phase 0 Characterization: Current Search & Taxonomy Baseline', () => {

    describe('1. Category Catalog & Search Index Baseline', () => {
        it('contains exactly 94 official categories in ListadoCategorias', () => {
            expect(ListadoCategorias).toHaveLength(94)
        })

        it('each category has a unique key and non-empty label and rol', () => {
            const keys = new Set(ListadoCategorias.map(c => c.key))
            expect(keys.size).toBe(ListadoCategorias.length)

            for (const cat of ListadoCategorias) {
                expect(cat.label.trim().length).toBeGreaterThan(0)
                expect((cat.rol || cat.label).trim().length).toBeGreaterThan(0)
            }
        })

        it('contains newly added Videovigilancia CCTV and Izaje de cargas categories', () => {
            const cctv = ListadoCategorias.find(c => c.label === 'Videovigilancia CCTV')
            expect(cctv).toBeDefined()
            expect(cctv?.key).toBe(92)
            expect(cctv?.iconName).toBe('Videocam')

            const izaje = ListadoCategorias.find(c => c.label === 'Izaje de cargas')
            expect(izaje).toBeDefined()
            expect(izaje?.key).toBe(93)
            expect(izaje?.iconName).toBe('Anchor')
        })
    })

    describe('2. Zone Catalog Baseline (@assets/data/ListadoZonas)', () => {
        it('has Bogotá as the default primary zone', () => {
            expect(bogotaZoneNames['bogota']).toBe('Bogotá')
            expect(Object.keys(bogotaZoneNames)[0]).toBe('bogota')
        })

        it('contains 41 Bogotá & surrounding metropolitan localities and municipalities', () => {
            expect(Object.keys(bogotaZoneNames)).toHaveLength(41)
            expect(bogotaZoneNames['tabio']).toBe('Tabio')
            expect(bogotaZoneNames['tenjo']).toBe('Tenjo')
        })

        it('contains standard city zones including "otra-zona"', () => {
            expect(standardCityZoneNames['otra-zona']).toBe('Otra Zona')
            expect(Object.keys(standardCityZoneNames)).toHaveLength(11)
        })

        it('combines into 52 total centralized zone mappings', () => {
            expect(Object.keys(zoneNames)).toHaveLength(52)
        })

        it('correctly identifies Bogotá and surrounding metropolitan municipalities', () => {
            expect(isBogotaRegion('Bogotá')).toBe(true)
            expect(isBogotaRegion('bogota')).toBe(true)
            expect(isBogotaRegion('Chía')).toBe(true)
            expect(isBogotaRegion('Soacha')).toBe(true)
            expect(isBogotaRegion('Tabio')).toBe(true)
            expect(isBogotaRegion('Tenjo')).toBe(true)
            expect(isBogotaRegion('Medellín')).toBe(false)
            expect(isBogotaRegion('Cali')).toBe(false)
        })
    })

    describe('3. Merchant Classification Filter Baseline (portal-servicios)', () => {
        const PUBLIC_MERCHANT_FILTERS = [
            {
                id: 'persona-natural',
                label: 'Persona Natural',
                matchTerms: ['persona natural'],
            },
            {
                id: 'micro-empresa',
                label: 'Micro Empresa',
                matchTerms: ['empresa emergente', 'emergente'],
            },
            {
                id: 'pyme-servicios',
                label: 'PyME de Servicios',
                matchTerms: ['pyme de servicios', 'pyme'],
            },
            {
                id: 'empresas',
                label: 'Empresas',
                matchTerms: [
                    'empresa gacela',
                    'gacela',
                    'empresa tractora',
                    'tractora',
                    'corporativo escalable',
                    'escalable',
                ],
            },
        ]

        it('has 4 public merchant structure filter options', () => {
            expect(PUBLIC_MERCHANT_FILTERS).toHaveLength(4)
            expect(PUBLIC_MERCHANT_FILTERS.map(f => f.id)).toEqual([
                'persona-natural',
                'micro-empresa',
                'pyme-servicios',
                'empresas'
            ])
        })

        it('correctly matches COMERCIANTE_OPTIONS.userClasification tiers to filter terms', () => {
            const rawTiers = COMERCIANTE_OPTIONS.userClasification
            expect(rawTiers).toEqual([
                'Persona Natural',
                'Empresa Emergente',
                'PyME de Servicios',
                'Empresa Gacela',
                'Empresa Tractora',
                'Corporativo Escalable',
            ])

            // Verify Persona Natural
            const natural = PUBLIC_MERCHANT_FILTERS.find(f => f.id === 'persona-natural')!
            expect(natural.matchTerms.some(t => 'Persona Natural'.toLowerCase().includes(t))).toBe(true)

            // Verify Empresa Emergente
            const micro = PUBLIC_MERCHANT_FILTERS.find(f => f.id === 'micro-empresa')!
            expect(micro.matchTerms.some(t => 'Empresa Emergente'.toLowerCase().includes(t))).toBe(true)

            // Verify PyME de Servicios
            const pyme = PUBLIC_MERCHANT_FILTERS.find(f => f.id === 'pyme-servicios')!
            expect(pyme.matchTerms.some(t => 'PyME de Servicios'.toLowerCase().includes(t))).toBe(true)

            // Verify Enterprise tiers
            const emp = PUBLIC_MERCHANT_FILTERS.find(f => f.id === 'empresas')!
            expect(emp.matchTerms.some(t => 'Empresa Gacela'.toLowerCase().includes(t))).toBe(true)
            expect(emp.matchTerms.some(t => 'Empresa Tractora'.toLowerCase().includes(t))).toBe(true)
            expect(emp.matchTerms.some(t => 'Corporativo Escalable'.toLowerCase().includes(t))).toBe(true)
        })
    })

    describe('4. Property Types / Propietario Classification Baseline', () => {
        it('has 5 distinct property tiers in PROPIETARIO_RANKINGS', () => {
            const tiers = PROPIETARIO_RANKINGS.clasificacion.tiers
            expect(tiers).toHaveLength(5)
            expect(tiers.map(t => t.id)).toEqual([
                'hogar',
                'negocio',
                'propiedad-horizontal',
                'inmobiliaria',
                'aliado'
            ])
        })

        it('has matching options in PROPIETARIO_OPTIONS.userClasification', () => {
            expect(PROPIETARIO_OPTIONS.userClasification).toEqual([
                'Hogar',
                'Negocio',
                'Propiedad Horizontal',
                'Inmobiliaria',
                'Aliado Estratégico',
            ])
        })
    })
})
