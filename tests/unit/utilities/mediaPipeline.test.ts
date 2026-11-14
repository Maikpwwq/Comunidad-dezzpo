import { describe, it, expect } from 'vitest'
import {
    validateMediaFile,
    calculateTargetDimensions,
    MEDIA_LIMITS,
} from '../../../src/utils/mediaPipeline'

describe('Media Pipeline — Validation & Calculations', () => {
    describe('validateMediaFile', () => {
        it('rejects null or undefined files', () => {
            // @ts-expect-error Testing invalid runtime input
            const res = validateMediaFile(null)
            expect(res.valid).toBe(false)
            expect(res.error).toContain('No se seleccionó')
        })

        it('rejects files larger than 10MB', () => {
            const bigBlob = new Blob([new Uint8Array(11 * 1024 * 1024)], { type: 'image/jpeg' })
            const res = validateMediaFile(bigBlob)
            expect(res.valid).toBe(false)
            expect(res.error).toContain('supera el límite')
        })

        it('rejects non-image MIME types', () => {
            const pdfBlob = new Blob(['%PDF-1.4'], { type: 'application/pdf' })
            const res = validateMediaFile(pdfBlob)
            expect(res.valid).toBe(false)
            expect(res.error).toContain('Formato no compatible')
        })

        it('accepts valid JPEG, PNG and WebP files under 10MB', () => {
            const jpegBlob = new Blob(['fake-jpg'], { type: 'image/jpeg' })
            const pngBlob = new Blob(['fake-png'], { type: 'image/png' })
            const webpBlob = new Blob(['fake-webp'], { type: 'image/webp' })

            expect(validateMediaFile(jpegBlob).valid).toBe(true)
            expect(validateMediaFile(pngBlob).valid).toBe(true)
            expect(validateMediaFile(webpBlob).valid).toBe(true)
        })
    })

    describe('calculateTargetDimensions', () => {
        it('preserves dimensions smaller than maxDimension', () => {
            const dims = calculateTargetDimensions(800, 600, 1600)
            expect(dims).toEqual({ width: 800, height: 600 })
        })

        it('scales down landscape images so width equals maxDimension', () => {
            // 3200 x 1600 -> should scale to 1600 x 800
            const dims = calculateTargetDimensions(3200, 1600, 1600)
            expect(dims).toEqual({ width: 1600, height: 800 })
        })

        it('scales down portrait images so height equals maxDimension', () => {
            // 1500 x 3000 -> should scale to 800 x 1600
            const dims = calculateTargetDimensions(1500, 3000, 1600)
            expect(dims).toEqual({ width: 800, height: 1600 })
        })

        it('handles square images scaling down symmetrically', () => {
            const dims = calculateTargetDimensions(4000, 4000, 1600)
            expect(dims).toEqual({ width: 1600, height: 1600 })
        })

        it('handles zero or negative dimensions safely with default max', () => {
            const dims = calculateTargetDimensions(0, -10, 1600)
            expect(dims).toEqual({ width: 1600, height: 1600 })
        })

        it('uses default maxDimension (1600px) when not specified', () => {
            const dims = calculateTargetDimensions(3200, 1600)
            expect(dims.width).toBe(MEDIA_LIMITS.MAX_DIMENSION_PX)
            expect(dims.height).toBe(800)
        })
    })
})

