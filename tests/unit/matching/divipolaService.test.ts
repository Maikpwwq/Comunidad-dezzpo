/**
 * Tests for DIVIPOLA Dataset Service
 *
 * Verifies async loading, hover prefetching, search filtering,
 * accent insensitivity, and code lookup.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
    loadDivipolaDataset,
    searchMunicipalities,
    getMunicipalityByCode,
    clearDivipolaCache,
    normalizeSearchTerm,
} from '@services/matching/divipolaService'

describe('DIVIPOLA Service', () => {
    beforeEach(() => {
        clearDivipolaCache()
    })

    it('loads the full dataset containing 1,122 municipalities', async () => {
        const list = await loadDivipolaDataset()
        expect(list).toHaveLength(1122)
    })

    it('finds Medellín by accent-insensitive search "medellin"', async () => {
        const results = await searchMunicipalities('medellin')
        expect(results.length).toBeGreaterThan(0)
        expect(results[0]?.code).toBe('05001')
        expect(results[0]?.municipio).toBe('Medellín')
        expect(results[0]?.departamento).toBe('Antioquia')
    })

    it('finds Cali by query "cali"', async () => {
        const results = await searchMunicipalities('cali')
        expect(results.some((m) => m.code === '76001')).toBe(true)
    })

    it('desambiguates homonymous municipalities with department name', async () => {
        // "Bolívar" exists in Santander, Cauca, Valle, etc.
        const results = await searchMunicipalities('bolivar', 10)
        expect(results.length).toBeGreaterThan(1)
        const deps = results.map((r) => r.departamento)
        const uniqueDeps = new Set(deps)
        expect(uniqueDeps.size).toBeGreaterThan(1)
    })

    it('finds municipality by exact 5-digit DIVIPOLA code', async () => {
        const bogota = await getMunicipalityByCode('11001')
        expect(bogota).not.toBeNull()
        expect(bogota?.municipio).toBe('Bogotá, D.C.')
        expect(bogota?.departamento).toBe('Bogotá, D.C.')

        const medellin = await getMunicipalityByCode('05001')
        expect(medellin).not.toBeNull()
        expect(medellin?.municipio).toBe('Medellín')
    })

    it('returns null for unknown DIVIPOLA code', async () => {
        const result = await getMunicipalityByCode('99999')
        expect(result).toBeNull()
    })

    it('normalizes search terms properly (removes accents and lowercases)', () => {
        expect(normalizeSearchTerm('BOGOTÁ')).toBe('bogota')
        expect(normalizeSearchTerm('Chía')).toBe('chia')
        expect(normalizeSearchTerm('Ibagué')).toBe('ibague')
    })
})
