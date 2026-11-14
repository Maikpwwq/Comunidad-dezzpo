/**
 * Integration Tests — Similar Profiles Hono Route Handler (R8, Rate Limiting & Validation)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Hono } from 'hono'

vi.mock('@/../server/api/similarProfiles/similarProfilesService', () => ({
    getSimilarProfiles: vi.fn().mockResolvedValue({
        outcome: { status: 'vacio' },
        metrics: { queryCount: 1, documentsRead: 1, cacheHit: false },
    }),
}))

import { getSimilarProfilesHandler } from '@/../server/api/similarProfiles/handlers'
import { similarProfilesMemoryCache } from '@/../server/api/similarProfiles/cache'

describe('Fase 2: Similar Profiles Route Handler Integration', () => {
    let app: Hono

    beforeEach(() => {
        similarProfilesMemoryCache.clear()
        app = new Hono()
        app.get('/api/v1/similar-profiles', getSimilarProfilesHandler)
    })

    it('rejects request with 400 when profileId query param is missing', async () => {
        const req = new Request('http://localhost/api/v1/similar-profiles')
        const res = await app.fetch(req)

        expect(res.status).toBe(400)
        const body = (await res.json()) as { code: string; message: string }
        expect(body.code).toBe('no_autorizado')
        expect(body.message).toContain('profileId requerido')
    })

    it('rejects request with 400 when profileId is empty or whitespace', async () => {
        const req = new Request('http://localhost/api/v1/similar-profiles?profileId=%20%20')
        const res = await app.fetch(req)

        expect(res.status).toBe(400)
    })

    it('enforces rate limiting (429) when exceeding 60 requests in the window from the same IP', async () => {
        const testIp = '192.168.10.42'
        let lastResponse: Response | null = null

        // Fire 62 requests
        for (let i = 0; i < 62; i++) {
            const req = new Request('http://localhost/api/v1/similar-profiles?profileId=pro_100', {
                headers: {
                    'x-forwarded-for': testIp,
                },
            })
            lastResponse = await app.fetch(req)
        }

        expect(lastResponse).not.toBeNull()
        expect(lastResponse!.status).toBe(429)
        const body = (await lastResponse!.json()) as { code: string }
        expect(body.code).toBe('limite')
    })
})
