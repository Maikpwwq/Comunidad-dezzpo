/**
 * Unit Tests — Section Title Pure Generator (Invariant I7 & Honest Copy)
 */
import { describe, it, expect } from 'vitest'
import { sectionTitle } from '@/features/similarProfiles/domain/sectionTitle'
import type { SimilarProfilesData } from '@/features/similarProfiles/domain/types'

describe('Fase 1: sectionTitle Generator (Invariant I7)', () => {
    const dummyItems = [
        {
            profileId: 'p1',
            displayName: 'Plomero 1',
            userCategories: ['Plomería'],
            tier: 'municipio' as const,
            score: 0.95,
            reasons: ['mismo_oficio' as const, 'tu_zona' as const],
            reasonLabels: ['Mismo oficio', 'En tu zona'],
            featured: false,
        },
        {
            profileId: 'p2',
            displayName: 'Plomero 2',
            userCategories: ['Plomería'],
            tier: 'municipio' as const,
            score: 0.88,
            reasons: ['mismo_oficio' as const],
            reasonLabels: ['Mismo oficio'],
            featured: true,
        },
    ]

    it('claims «cerca de ti» ONLY when zoneSource is busqueda or visitante AND farthestTier is municipio', () => {
        const dataSearch: SimilarProfilesData = {
            items: dummyItems,
            basis: {
                categoryName: 'Plomería',
                zoneName: 'suba',
                zoneSource: 'busqueda',
                farthestTier: 'municipio',
            },
            generatedAt: '2026-11-14T10:00:00Z',
        }
        const resSearch = sectionTitle(dataSearch)
        expect(resSearch.title).toBe('Más profesionales de Plomería cerca de ti')
        expect(resSearch.subtitle).toBe('Según el oficio y la zona de este perfil.')

        const dataVisitor: SimilarProfilesData = {
            items: dummyItems,
            basis: {
                categoryName: 'Plomería',
                zoneName: 'chapinero',
                zoneSource: 'visitante',
                farthestTier: 'municipio',
            },
            generatedAt: '2026-11-14T10:00:00Z',
        }
        const resVisitor = sectionTitle(dataVisitor)
        expect(resVisitor.title).toBe('Más profesionales de Plomería cerca de ti')
    })

    it('says «en {zona}» when zoneSource is perfil_visitado', () => {
        const data: SimilarProfilesData = {
            items: dummyItems,
            basis: {
                categoryName: 'Plomería',
                zoneName: 'Suba',
                zoneSource: 'perfil_visitado',
                farthestTier: 'municipio',
            },
            generatedAt: '2026-11-14T10:00:00Z',
        }
        const res = sectionTitle(data)
        expect(res.title).toBe('Más profesionales de Plomería en Suba')
    })

    it('falls back to «Profesionales destacados de {categoría}» when tier is not municipio and quality items present', () => {
        const data: SimilarProfilesData = {
            items: dummyItems, // p2 has featured: true
            basis: {
                categoryName: 'Pintura',
                zoneName: null,
                zoneSource: null,
                farthestTier: 'nacional',
            },
            generatedAt: '2026-11-14T10:00:00Z',
        }
        const res = sectionTitle(data)
        expect(res.title).toBe('Profesionales destacados de Pintura')
    })

    it('falls back to «Profesionales similares de {categoría}» when no featured items and tier is nacional', () => {
        const unfeaturedItems = dummyItems.map((item) => ({ ...item, featured: false }))
        const data: SimilarProfilesData = {
            items: unfeaturedItems,
            basis: {
                categoryName: 'Albañilería',
                zoneName: null,
                zoneSource: null,
                farthestTier: 'nacional',
            },
            generatedAt: '2026-11-14T10:00:00Z',
        }
        const res = sectionTitle(data)
        expect(res.title).toBe('Profesionales similares de Albañilería')
    })

    it('does not pluralize categories as professions (e.g. Plomería remains Plomería)', () => {
        const data: SimilarProfilesData = {
            items: dummyItems,
            basis: {
                categoryName: 'Plomería',
                zoneName: 'Bogotá',
                zoneSource: 'perfil_visitado',
                farthestTier: 'departamento',
            },
            generatedAt: '2026-11-14T10:00:00Z',
        }
        const res = sectionTitle(data)
        expect(res.title).not.toContain('Plomeros')
        expect(res.title).not.toContain('Plomerías')
        expect(res.title).toContain('Plomería')
    })
})

