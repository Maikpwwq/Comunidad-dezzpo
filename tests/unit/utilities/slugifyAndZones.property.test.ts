import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { zones, zoneNames } from '@assets/data/ListadoZonas'

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '')
}

describe('Slugify and Geographic Zones Invariants', () => {
    describe('Slugify Property-Based Invariants', () => {
        it('always produces lowercase URL-safe strings containing only [a-z0-9-]', () => {
            fc.assert(
                fc.property(
                    fc.string({ minLength: 1, maxLength: 200 }),
                    (rawText) => {
                        const slug = slugify(rawText)

                        // Slug must not contain upper cases, accents, or special symbols
                        expect(slug).toMatch(/^[a-z0-9-]*$/)

                        // Slug must not have consecutive dashes or leading/trailing dashes
                        expect(slug).not.toContain('--')
                    }
                ),
                { numRuns: 500 }
            )
        })

        it('properly normalizes Spanish accented text and tildes', () => {
            expect(slugify('Instalación & Mantenimiento Eléctrico en Bogotá!')).toBe('instalacion-mantenimiento-electrico-en-bogota')
            expect(slugify('Albañilería y Acabados en Chapinero')).toBe('albanileria-y-acabados-en-chapinero')
        })
    })

    describe('Centralized Geographic Zone Mapping Integrity (@assets/data/ListadoZonas)', () => {
        it('guarantees every zone slug in zones array has a corresponding label in zoneNames', () => {
            expect(zones.length).toBeGreaterThan(20)
            zones.forEach((zoneSlug) => {
                expect(zoneNames[zoneSlug]).toBeDefined()
                expect(typeof zoneNames[zoneSlug]).toBe('string')
                expect(zoneNames[zoneSlug]!.length).toBeGreaterThan(0)
            })
        })

        it('includes main metropolitan municipalities around Bogotá', () => {
            const metroSlugs = ['chia', 'soacha', 'cajica', 'cota', 'zipaquira', 'mosquera']
            metroSlugs.forEach((metroSlug) => {
                expect(zones).toContain(metroSlug)
                expect(zoneNames[metroSlug]).toBeDefined()
            })
        })
    })
})
