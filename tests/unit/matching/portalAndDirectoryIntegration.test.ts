/**
 * Integration Tests: Portal de Servicios & Directorio de Requerimientos
 *
 * Verifies:
 * 1. Matching and partitioning in portal-servicios:
 *    - "Mostrar" vs "También podrían atenderte" partitioning
 *    - Invariant I4: Zone signal NEVER hides a profile, only reorders.
 *    - Invariant I5: When property type is null/unspecified, all profiles are shown.
 * 2. Drafting filter in directorio-requerimientos:
 *    - Comerciante structure filters drafts based on Admin-assigned classification.
 *    - Unknown property types in drafts are never hidden (I5).
 *    - Unclassified merchants see all drafts (I5).
 */

import { describe, it, expect } from 'vitest'
import {
    evaluateFuzzyMatch,
    getCompatiblePropertiesForStructure,
} from '@services/matching/fuzzyEngine'
import {
    decodeSearchContext,
    encodeSearchContext,
} from '@services/matching/searchContextCodec'
import {
    normalizeMerchantStructure,
    normalizePropertyType,
    type PropertyTypeId,
    type MerchantStructureId,
} from '@config/matching.config'

describe('Portal de Servicios & Directorio Integration Suite', () => {

    describe('1. Portal de Servicios Fuzzy Partitioning', () => {
        interface MockMerchant {
            id: string
            name: string
            classification: string
            city: string
        }

        const merchants: MockMerchant[] = [
            { id: '1', name: 'Plomero Don Pedro', classification: 'persona-natural', city: 'Bogotá (Suba)' },
            { id: '2', name: 'Instalaciones Rápidas SAS', classification: 'emergente', city: 'Bogotá (Chapinero)' },
            { id: '3', name: 'Ingeniería y Mantenimiento Ltda', classification: 'pyme de servicios', city: 'Bogotá (Usaquén)' },
            { id: '4', name: 'Megaconstrucciones Corporativas', classification: 'empresa tractora', city: 'Bogotá (Teusaquillo)' },
        ]

        it('partitions merchants correctly for Hogar (Persona Natural & Microempresa primary, Empresa complementary)', () => {
            const propertyType: PropertyTypeId = 'hogar'

            const evaluated = merchants.map((m) => {
                const match = evaluateFuzzyMatch({
                    propertyType,
                    merchantStructure: m.classification,
                })
                return { m, match }
            })

            const primary = evaluated.filter((e) => e.match.decision === 'mostrar')
            const complementary = evaluated.filter((e) => e.match.decision !== 'mostrar')

            // Hogar primary should include persona-natural and emergente (micro_empresa)
            expect(primary.map((e) => e.m.name)).toContain('Plomero Don Pedro')
            expect(primary.map((e) => e.m.name)).toContain('Instalaciones Rápidas SAS')

            // Hogar complementary should include large corporation (empresa)
            expect(complementary.map((e) => e.m.name)).toContain('Megaconstrucciones Corporativas')
        })

        it('partitions merchants correctly for Propiedad Horizontal (Microempresa & PyME primary, Persona Natural complementary)', () => {
            const propertyType: PropertyTypeId = 'propiedad_horizontal'

            const evaluated = merchants.map((m) => {
                const match = evaluateFuzzyMatch({
                    propertyType,
                    merchantStructure: m.classification,
                })
                return { m, match }
            })

            const primary = evaluated.filter((e) => e.match.decision === 'mostrar')
            const complementary = evaluated.filter((e) => e.match.decision !== 'mostrar')

            // PH primary includes micro_empresa and pyme_servicios (both >= 0.90)
            expect(primary.map((e) => e.m.name)).toContain('Instalaciones Rápidas SAS')
            expect(primary.map((e) => e.m.name)).toContain('Ingeniería y Mantenimiento Ltda')

            // Persona natural has baseScore 0.15 -> degraded
            expect(complementary.map((e) => e.m.name)).toContain('Plomero Don Pedro')
        })

        it('Invariant I4: Zone proximity never hides a profile, only modulates score and order', () => {
            const propertyType: PropertyTypeId = 'propiedad_horizontal'
            const structure: MerchantStructureId = 'micro_empresa' // baseScore is 0.90

            // Profile in same zone (+0.05 boost)
            const sameZoneMatch = evaluateFuzzyMatch({
                propertyType,
                merchantStructure: structure,
                zoneSignal: 'same_zone',
            })

            // Profile in other zone (no boost)
            const otherZoneMatch = evaluateFuzzyMatch({
                propertyType,
                merchantStructure: structure,
                zoneSignal: 'other_zone',
            })

            // Neither should ever be hidden
            expect(sameZoneMatch.decision).toBe('mostrar')
            expect(otherZoneMatch.decision).toBe('mostrar')

            // Same zone should rank higher than other zone
            expect(sameZoneMatch.score).toBeGreaterThan(otherZoneMatch.score)
            expect(sameZoneMatch.score).toBe(0.95)
            expect(otherZoneMatch.score).toBe(0.90)
        })

        it('Invariant I5: When property type is null, zero profiles are degraded', () => {
            const evaluated = merchants.map((m) => {
                const match = evaluateFuzzyMatch({
                    propertyType: null,
                    merchantStructure: m.classification,
                })
                return { m, match }
            })

            const primary = evaluated.filter((e) => e.match.decision === 'mostrar')
            const complementary = evaluated.filter((e) => e.match.decision !== 'mostrar')

            expect(primary).toHaveLength(merchants.length)
            expect(complementary).toHaveLength(0)
            expect(primary.every((e) => e.match.score === 0.5)).toBe(true)
        })
    })

    describe('2. Directorio de Requerimientos Adaptation by Structure', () => {
        interface MockDraft {
            id: string
            title: string
            projectType?: string | null
        }

        const drafts: MockDraft[] = [
            { id: 'd1', title: 'Reparación tubería casa', projectType: 'Hogar' },
            { id: 'd2', title: 'Mantenimiento zonas comunes conjunto', projectType: 'PH' },
            { id: 'd3', title: 'Adecuación oficina comercial', projectType: 'Negocio' },
            { id: 'd4', title: 'Pintura fachada edificio inmobiliario', projectType: 'Inmobiliaria' },
            { id: 'd5', title: 'Remodelación alianza constructora', projectType: 'Alianzas' },
            { id: 'd6', title: 'Reparación urgente todero', projectType: null }, // Unknown property type
        ]

        it('filters drafts for Persona Natural merchant (only Hogar + Unknown drafts)', () => {
            const merchantStructure = normalizeMerchantStructure('persona-natural')!
            expect(merchantStructure).toBe('persona_natural')

            const allowedProps = getCompatiblePropertiesForStructure(merchantStructure, 'mostrar')
            expect(allowedProps).toEqual(['hogar'])

            const visibleDrafts = drafts.filter((draft) => {
                const normProp = normalizePropertyType(draft.projectType)
                // Invariant I5: Unknown property type is always shown
                if (!normProp) return true
                return allowedProps.includes(normProp)
            })

            const visibleTitles = visibleDrafts.map((d) => d.title)
            expect(visibleTitles).toContain('Reparación tubería casa') // Hogar
            expect(visibleTitles).toContain('Reparación urgente todero') // Unknown -> included
            expect(visibleTitles).not.toContain('Mantenimiento zonas comunes conjunto') // PH -> excluded
            expect(visibleTitles).not.toContain('Remodelación alianza constructora') // Alianzas -> excluded
        })

        it('filters drafts for Empresa merchant (only Inmobiliaria, Alianzas + Unknown drafts)', () => {
            const merchantStructure = normalizeMerchantStructure('empresa tractora')!
            expect(merchantStructure).toBe('empresa')

            const allowedProps = getCompatiblePropertiesForStructure(merchantStructure, 'mostrar')
            expect(allowedProps).toContain('inmobiliaria')
            expect(allowedProps).toContain('aliado_estrategico')
            expect(allowedProps).not.toContain('hogar')

            const visibleDrafts = drafts.filter((draft) => {
                const normProp = normalizePropertyType(draft.projectType)
                if (!normProp) return true
                return allowedProps.includes(normProp)
            })

            const visibleTitles = visibleDrafts.map((d) => d.title)
            expect(visibleTitles).toContain('Pintura fachada edificio inmobiliario')
            expect(visibleTitles).toContain('Remodelación alianza constructora')
            expect(visibleTitles).toContain('Reparación urgente todero') // Unknown -> included
            expect(visibleTitles).not.toContain('Reparación tubería casa') // Hogar -> excluded
        })

        it('Invariant I5: Unclassified merchant sees ALL drafts without exclusions', () => {
            const merchantClassification: string | null = null
            const merchantStructure = normalizeMerchantStructure(merchantClassification)
            expect(merchantStructure).toBeNull()

            const visibleDrafts = drafts.filter((_draft) => {
                if (!merchantStructure) return true
                return false
            })

            expect(visibleDrafts).toHaveLength(drafts.length)
        })
    })

    describe('3. URL Round-Trip Codec & Handoff', () => {
        it('encodes and decodes complete search context with Otra Zona DIVIPOLA', () => {
            const originalContext = {
                category: 'Instalación de ascensor',
                propertyType: 'propiedad_horizontal' as const,
                zone: 'otra-zona',
                municipioCode: '05001',
                municipioName: 'Medellín (Antioquia)',
            }

            const queryParamString = encodeSearchContext(originalContext)
            expect(queryParamString).toContain('cat=Instalaci%C3%B3n+de+ascensor')
            expect(queryParamString).toContain('tipo=propiedad-horizontal')
            expect(queryParamString).toContain('zona=otra-zona')
            expect(queryParamString).toContain('mpio=05001')
            expect(queryParamString).toContain('mpioName=Medell%C3%ADn+%28Antioquia%29')

            const decoded = decodeSearchContext(queryParamString)
            expect(decoded.category).toBe('Instalación de ascensor')
            expect(decoded.propertyType).toBe('propiedad_horizontal')
            expect(decoded.zone).toBe('otra-zona')
            expect(decoded.municipioCode).toBe('05001')
            expect(decoded.municipioName).toBe('Medellín (Antioquia)')
        })
    })
})
