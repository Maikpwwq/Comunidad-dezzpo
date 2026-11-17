/**
 * Tests for normalizeSocialUrl()
 *
 * Verifies auto-prepend of https:// prefix on social URL fields,
 * analogous to PhoneField's +57 auto-formatting.
 */
import { describe, it, expect } from 'vitest'
import { normalizeSocialUrl } from '@utilities/socialUtils'

describe('normalizeSocialUrl', () => {
    // ── Empty / whitespace ──────────────────────────────────────────────
    it('returns empty string for empty input', () => {
        expect(normalizeSocialUrl('')).toBe('')
    })

    it('returns empty string for whitespace-only input', () => {
        expect(normalizeSocialUrl('   ')).toBe('')
    })

    // ── Already has protocol ────────────────────────────────────────────
    it('preserves https:// URLs unchanged', () => {
        expect(normalizeSocialUrl('https://facebook.com/page')).toBe('https://facebook.com/page')
    })

    it('preserves http:// URLs unchanged', () => {
        expect(normalizeSocialUrl('http://instagram.com/user')).toBe('http://instagram.com/user')
    })

    it('preserves HTTPS:// (case insensitive) unchanged', () => {
        expect(normalizeSocialUrl('HTTPS://X.com/user')).toBe('HTTPS://X.com/user')
    })

    // ── Missing protocol — auto-prepend ─────────────────────────────────
    it('prepends https:// to www.facebook.com/page', () => {
        expect(normalizeSocialUrl('www.facebook.com/page')).toBe('https://www.facebook.com/page')
    })

    it('prepends https:// to facebook.com/page (no www)', () => {
        expect(normalizeSocialUrl('facebook.com/page')).toBe('https://facebook.com/page')
    })

    it('prepends https:// to instagram.com/mi_cuenta', () => {
        expect(normalizeSocialUrl('instagram.com/mi_cuenta')).toBe('https://instagram.com/mi_cuenta')
    })

    it('prepends https:// to wa.me/573001234567 (WhatsApp)', () => {
        expect(normalizeSocialUrl('wa.me/573001234567')).toBe('https://wa.me/573001234567')
    })

    it('prepends https:// to tiktok.com/@user', () => {
        expect(normalizeSocialUrl('tiktok.com/@user')).toBe('https://tiktok.com/@user')
    })

    it('prepends https:// to linkedin.com/in/mi-perfil', () => {
        expect(normalizeSocialUrl('linkedin.com/in/mi-perfil')).toBe('https://linkedin.com/in/mi-perfil')
    })

    it('prepends https:// to x.com/mi_cuenta', () => {
        expect(normalizeSocialUrl('x.com/mi_cuenta')).toBe('https://x.com/mi_cuenta')
    })

    // ── Protocol-relative URLs ──────────────────────────────────────────
    it('handles protocol-relative //domain.com/path', () => {
        expect(normalizeSocialUrl('//facebook.com/page')).toBe('https://facebook.com/page')
    })

    // ── Trimming on paste ───────────────────────────────────────────────
    it('trims leading/trailing whitespace (paste scenario)', () => {
        expect(normalizeSocialUrl('  www.tiktok.com/@user  ')).toBe('https://www.tiktok.com/@user')
    })

    it('trims and prepends for domain-only paste', () => {
        expect(normalizeSocialUrl('  mi-sitio.com  ')).toBe('https://mi-sitio.com')
    })

    // ── Edge cases ──────────────────────────────────────────────────────
    it('strips accidental leading slashes from bare paths', () => {
        expect(normalizeSocialUrl('/facebook.com/page')).toBe('https://facebook.com/page')
    })

    it('handles single character input', () => {
        expect(normalizeSocialUrl('h')).toBe('https://h')
    })
})

