/**
 * Tests for SearchContextCodec
 *
 * Verifies URL encode/decode, parameter sanitization, XSS payload defense,
 * and sessionStorage round-trip for auth flows.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
    decodeSearchContext,
    encodeSearchContext,
    persistPendingSearchContext,
    retrievePendingSearchContext,
    clearPendingSearchContext,
} from '@services/matching/searchContextCodec'

describe('SearchContextCodec', () => {
    beforeEach(() => {
        clearPendingSearchContext()
    })

    describe('decodeSearchContext', () => {
        it('decodes complete valid query string correctly', () => {
            const qs = '?cat=plomeria&tipo=propiedad-horizontal&zona=chapinero'
            const ctx = decodeSearchContext(qs)

            expect(ctx.category).toBe('plomeria')
            expect(ctx.propertyType).toBe('propiedad_horizontal')
            expect(ctx.zone).toBe('chapinero')
            expect(ctx.municipioCode).toBeNull()
        })

        it('decodes "otra-zona" with DIVIPOLA code', () => {
            const qs = '?cat=pintura&tipo=hogar&zona=otra-zona&mpio=05001&mpioName=Medellin'
            const ctx = decodeSearchContext(qs)

            expect(ctx.category).toBe('pintura')
            expect(ctx.propertyType).toBe('hogar')
            expect(ctx.zone).toBe('otra-zona')
            expect(ctx.municipioCode).toBe('05001')
            expect(ctx.municipioName).toBe('Medellin')
        })

        it('ignores invalid property types and invalid zones gracefully', () => {
            const qs = '?cat=electricista&tipo=invalido_random&zona=zona_inexistente&mpio=abc'
            const ctx = decodeSearchContext(qs)

            expect(ctx.category).toBe('electricista')
            expect(ctx.propertyType).toBeNull()
            expect(ctx.zone).toBeNull()
            expect(ctx.municipioCode).toBeNull()
        })

        it('sanitizes XSS payloads and strips angle brackets and quotes', () => {
            const qs = '?cat=<script>alert(1)</script>&tipo=hogar&zona=bogota'
            const ctx = decodeSearchContext(qs)

            expect(ctx.category).not.toContain('<')
            expect(ctx.category).not.toContain('>')
            expect(ctx.propertyType).toBe('hogar')
            expect(ctx.zone).toBe('bogota')
        })

        it('handles URLSearchParams instance and plain objects', () => {
            const params = new URLSearchParams()
            params.set('cat', 'carpinteria')
            params.set('tipo', 'negocio')

            const fromParams = decodeSearchContext(params)
            expect(fromParams.category).toBe('carpinteria')
            expect(fromParams.propertyType).toBe('negocio')

            const fromObj = decodeSearchContext({ cat: 'carpinteria', tipo: 'negocio' })
            expect(fromObj.category).toBe('carpinteria')
            expect(fromObj.propertyType).toBe('negocio')
        })
    })

    describe('encodeSearchContext', () => {
        it('encodes non-null search state into standard query string', () => {
            const encoded = encodeSearchContext({
                category: 'plomeria',
                propertyType: 'propiedad_horizontal',
                zone: 'suba',
            })

            expect(encoded).toContain('cat=plomeria')
            expect(encoded).toContain('tipo=propiedad-horizontal')
            expect(encoded).toContain('zona=suba')
        })

        it('returns empty string if all fields are empty or null', () => {
            expect(encodeSearchContext({})).toBe('')
            expect(encodeSearchContext({ category: null, propertyType: null, zone: null })).toBe('')
        })

        it('encodes "otra-zona" with DIVIPOLA parameters', () => {
            const encoded = encodeSearchContext({
                category: 'arquitectura',
                propertyType: 'inmobiliaria',
                zone: 'otra-zona',
                municipioCode: '05001',
                municipioName: 'Medellín',
            })

            expect(encoded).toContain('zona=otra-zona')
            expect(encoded).toContain('mpio=05001')
            expect(encoded).toContain('mpioName=Medell%C3%ADn')
        })
    })

    describe('sessionStorage intent preservation across auth', () => {
        it('persists and retrieves pending search context', () => {
            const state = {
                category: 'impermeabilizacion',
                propertyType: 'propiedad_horizontal' as const,
                zone: 'bogota',
                municipioCode: null,
            }

            persistPendingSearchContext(state)
            const retrieved = retrievePendingSearchContext()

            expect(retrieved).not.toBeNull()
            expect(retrieved?.category).toBe('impermeabilizacion')
            expect(retrieved?.propertyType).toBe('propiedad_horizontal')
            expect(retrieved?.zone).toBe('bogota')

            clearPendingSearchContext()
            expect(retrievePendingSearchContext()).toBeNull()
        })
    })
})
