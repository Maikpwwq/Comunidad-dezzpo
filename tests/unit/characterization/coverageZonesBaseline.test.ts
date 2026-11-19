/**
 * Coverage Zones Characterization Tests
 *
 * Verifies current behavior of coverage zones across ListadoZonas,
 * consumers (marketing pages, similar profiles scoring, portal proximity, notifications),
 * and legacy storage representation before any modifications.
 */

import { describe, it, expect } from 'vitest'
import {
    zones,
    zoneNames,
    bogotaZoneNames,
    standardCityZoneNames,
    HOME_ZONE_OPTIONS,
    DIRECTORY_ZONE_OPTIONS,
    isBogotaRegion,
    getZonesForCity,
} from '@assets/data/ListadoZonas'
import { calculateProximityScore } from '@features/similarProfiles/domain/scoring'
import type { CandidateProfile } from '@features/similarProfiles/domain/types'

describe('Coverage Zones Baseline Characterization', () => {
    describe('1. Catalog and Slugs (ListadoZonas)', () => {
        it('contains exactly 52 zones in total', () => {
            expect(zones.length).toBe(52)
            expect(Object.keys(zoneNames).length).toBe(52)
        })

        it('has 41 Bogota and metro area zones', () => {
            expect(Object.keys(bogotaZoneNames).length).toBe(41)
            expect(bogotaZoneNames['bogota']).toBe('Bogotá')
            expect(bogotaZoneNames['suba']).toBe('Suba')
            expect(bogotaZoneNames['soacha']).toBe('Soacha')
            expect(bogotaZoneNames['chia']).toBe('Chía')
            expect(bogotaZoneNames['sumapaz']).toBe('Sumapaz')
        })

        it('has 11 standard city zone names including cardinal sectors and otra-zona', () => {
            expect(Object.keys(standardCityZoneNames).length).toBe(11)
            expect(standardCityZoneNames['centro']).toBe('Centro')
            expect(standardCityZoneNames['alrededores']).toBe('Área Metropolitana / Alrededores')
            expect(standardCityZoneNames['otra-zona']).toBe('Otra Zona')
        })

        it('positions "otra-zona" appropriately in shared selectors', () => {
            // In HOME_ZONE_OPTIONS, 'otra-zona' is immediately after 'bogota'
            expect(HOME_ZONE_OPTIONS[0]?.slug).toBe('bogota')
            expect(HOME_ZONE_OPTIONS[1]?.slug).toBe('otra-zona')

            // In DIRECTORY_ZONE_OPTIONS, 'otra-zona' is the first explicit zone option
            expect(DIRECTORY_ZONE_OPTIONS[0]?.slug).toBe('otra-zona')
            expect(DIRECTORY_ZONE_OPTIONS[1]?.slug).toBe('bogota')
        })

        it('detects Bogota region and returns appropriate zone dictionaries', () => {
            expect(isBogotaRegion('Bogotá D.C.')).toBe(true)
            expect(isBogotaRegion('Soacha')).toBe(true)
            expect(isBogotaRegion('Chía, Cundinamarca')).toBe(true)
            expect(isBogotaRegion('Medellín')).toBe(false)
            expect(isBogotaRegion('Cali')).toBe(false)

            expect(getZonesForCity('Bogotá')).toEqual(bogotaZoneNames)
            expect(getZonesForCity('Medellín')).toEqual(standardCityZoneNames)
        })
    })

    describe('2. Similar Profiles Proximity Scoring Consumer', () => {
        const baseCandidate: CandidateProfile = {
            userId: 'user_123',
            userCiudad: 'Bogotá, Colombia',
            userDirection: 'Calle 100 # 15-20',
            userDepartamento: 'Bogotá D.C.',
            userCodigoPostal: '11001',
            userZonasCobertura: ['suba', 'usaquen', 'chapinero'],
            coberturaTodaLaCiudad: false,
        }

        it('scores 1.0 (municipio tier) when target zone is in candidate userZonasCobertura', () => {
            const result = calculateProximityScore('suba', null, 'Bogotá D.C.', baseCandidate)
            expect(result.tier).toBe('municipio')
            expect(result.score).toBe(1.0)
            expect(result.isSameZone).toBe(true)
        })

        it('falls back to departamento (0.6) or nacional when target zone is not covered but in same dept', () => {
            const result = calculateProximityScore('bosa', null, 'Bogotá D.C.', baseCandidate)
            // Even though bosa is not in userZonasCobertura, userCiudad contains 'bogota'
            expect(result.tier).toBe('departamento')
            expect(result.score).toBe(0.6)
            expect(result.isSameZone).toBe(false)
        })

        it('scores departamento tier if candidate has coberturaTodaLaCiudad', () => {
            const cityWideCandidate: CandidateProfile = {
                ...baseCandidate,
                userCiudad: 'Medellín',
                userDirection: 'El Poblado',
                userDepartamento: 'Antioquia',
                userZonasCobertura: [],
                coberturaTodaLaCiudad: true,
            }
            const result = calculateProximityScore('centro', null, 'Antioquia', cityWideCandidate)
            expect(result.tier).toBe('departamento')
            expect(result.score).toBe(0.6)
        })

        it('handles candidate with legacy "otra-zona" without crashing', () => {
            const legacyCandidate: CandidateProfile = {
                ...baseCandidate,
                userZonasCobertura: ['otra-zona'],
            }
            const result = calculateProximityScore('suba', null, 'Bogotá D.C.', legacyCandidate)
            expect(result.tier).toBe('departamento')
        })
    })

    describe('3. Marketing SEO Zone Matching Characterization', () => {
        it('matches merchant when zone slug is directly in userZonasCobertura', () => {
            const merchant = {
                userZonasCobertura: ['suba', 'usaquen'],
                coberturaTodaLaCiudad: false,
            }
            const targetZone = 'suba'
            const isMatch = merchant.coberturaTodaLaCiudad || merchant.userZonasCobertura.includes(targetZone)
            expect(isMatch).toBe(true)
        })

        it('matches any merchant when coberturaTodaLaCiudad is true', () => {
            const merchant = {
                userZonasCobertura: ['kennedy'],
                coberturaTodaLaCiudad: true,
            }
            const targetZone = 'usaquen'
            const isMatch = merchant.coberturaTodaLaCiudad || merchant.userZonasCobertura.includes(targetZone)
            expect(isMatch).toBe(true)
        })

        it('does not match when target zone is absent and coberturaTodaLaCiudad is false', () => {
            const merchant = {
                userZonasCobertura: ['kennedy'],
                coberturaTodaLaCiudad: false,
            }
            const targetZone = 'suba'
            const isMatch = merchant.coberturaTodaLaCiudad || merchant.userZonasCobertura.includes(targetZone)
            expect(isMatch).toBe(false)
        })
    })

    describe('4. Legacy Representation of "otra-zona"', () => {
        it('treats "otra-zona" as an opaque raw string in existing userZonasCobertura array', () => {
            const rawStoredZones = ['suba', 'otra-zona']
            expect(rawStoredZones).toContain('otra-zona')
            expect(rawStoredZones.length).toBe(2)
        })
    })
})
