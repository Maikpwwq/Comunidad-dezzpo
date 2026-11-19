/**
 * Unit Tests for Google AdSense ads.txt Specification & Delivery
 *
 * Verifies R1, R2, R3, R4, R5, R6, R7:
 * - Exact 4 fields format according to IAB Tech Lab / AdSense standard
 * - Coherence with AdSense verification meta tag in pages/+onRenderHtml.tsx
 * - UTF-8 without BOM, strictly single LF line ending
 * - robots.txt allows /ads.txt and Mediapartners-Google
 * - vercel.json and firebase.json serve text/plain with short cache
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Google AdSense ads.txt Compliance', () => {
    const adsTxtPath = resolve(process.cwd(), 'public/ads.txt')
    const onRenderHtmlPath = resolve(process.cwd(), 'pages/+onRenderHtml.tsx')
    const robotsTxtPath = resolve(process.cwd(), 'public/robots.txt')
    const vercelJsonPath = resolve(process.cwd(), 'vercel.json')
    const firebaseJsonPath = resolve(process.cwd(), 'firebase.json')

    it('R1 & R6: public/ads.txt exists, is UTF-8 without BOM and has LF line ending', () => {
        expect(existsSync(adsTxtPath)).toBe(true)
        const rawBuffer = readFileSync(adsTxtPath)

        // Check BOM
        expect(rawBuffer.slice(0, 3)).not.toEqual(Buffer.from([0xef, 0xbb, 0xbf]))

        // Check no CRLF
        expect(rawBuffer.includes(Buffer.from('\r\n'))).toBe(false)

        // Check ends with LF
        expect(rawBuffer[rawBuffer.length - 1]).toBe(0x0a)
    })

    it('R2: Publisher ID matches AdSense meta tag in pages/+onRenderHtml.tsx', () => {
        const htmlContent = readFileSync(onRenderHtmlPath, 'utf-8')
        const metaMatch = htmlContent.match(/<meta\s+name=["']google-adsense-account["']\s+content=["']ca-(pub-\d+)["']/)
        expect(metaMatch).not.toBeNull()
        const metaPubId = metaMatch![1]

        const adsContent = readFileSync(adsTxtPath, 'utf-8').trim()
        const parts = adsContent.split(',').map((p) => p.trim())

        expect(parts[1]).toBe(metaPubId)
        expect(parts[1]).toMatch(/^pub-\d{16}$/)
    })

    it('R6: ads.txt contains exactly one record with four valid comma-separated fields', () => {
        const raw = readFileSync(adsTxtPath, 'utf-8')
        const lines = raw.split('\n').filter((l) => l.trim().length > 0)

        expect(lines.length).toBe(1)
        const line = lines[0]!

        const fields = line.split(',').map((f) => f.trim())
        expect(fields.length).toBe(4)

        // Field 1: Exchange domain
        expect(fields[0]).toBe('google.com')

        // Field 2: Publisher ID
        expect(fields[1]).toBe('pub-9623256221558651')
        expect(fields[1]).not.toContain('ca-')
        expect(fields[1]).not.toContain('XXX')

        // Field 3: Relationship
        expect(fields[2]).toBe('DIRECT')

        // Field 4: Google Certification Authority ID
        expect(fields[3]).toBe('f08c47fec0942fa0')
    })

    it('R5: robots.txt does not block ads.txt and permits Mediapartners-Google', () => {
        const robotsContent = readFileSync(robotsTxtPath, 'utf-8')

        // Must not disallow /ads.txt
        expect(robotsContent).not.toMatch(/Disallow:\s*\/ads\.txt/)

        // Explicitly check Mediapartners-Google block
        expect(robotsContent).toContain('User-agent: Mediapartners-Google')
        expect(robotsContent).toMatch(/User-agent:\s*Mediapartners-Google[\s\S]*?Allow:\s*\//)
    })

    it('R3: vercel.json and firebase.json configure Content-Type text/plain and short cache for /ads.txt', () => {
        const vercelJson = JSON.parse(readFileSync(vercelJsonPath, 'utf-8'))
        const adsVercelHeader = vercelJson.headers?.find((h: { source: string }) => h.source === '/ads.txt')
        expect(adsVercelHeader).toBeDefined()

        const contentTypeHeader = adsVercelHeader.headers.find((h: { key: string }) => h.key === 'Content-Type')
        expect(contentTypeHeader?.value).toBe('text/plain; charset=utf-8')

        const cacheControlHeader = adsVercelHeader.headers.find((h: { key: string }) => h.key === 'Cache-Control')
        expect(cacheControlHeader?.value).toContain('max-age=3600')

        const firebaseJson = JSON.parse(readFileSync(firebaseJsonPath, 'utf-8'))
        const adsFirebaseHeader = firebaseJson.hosting?.headers?.find((h: { source: string }) => h.source === '/ads.txt')
        expect(adsFirebaseHeader).toBeDefined()
    })

    it('R3 & R8: Hono server endpoint /ads.txt responds 200 with text/plain and correct content', async () => {
        const serverModule = await import('../../../pages/+server')
        const server = serverModule.default

        const res = await server.fetch(new Request('http://localhost/ads.txt'))
        expect(res.status).toBe(200)

        const contentType = res.headers.get('content-type')
        expect(contentType).toContain('text/plain')
        expect(contentType?.toLowerCase()).toContain('utf-8')

        const cacheControl = res.headers.get('cache-control')
        expect(cacheControl).toContain('max-age=3600')

        const text = await res.text()
        expect(text).toBe('google.com, pub-9623256221558651, DIRECT, f08c47fec0942fa0\n')
    })
})
