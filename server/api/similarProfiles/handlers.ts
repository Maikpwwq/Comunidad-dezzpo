/**
 * Similar Profiles API Route Handlers (Hono)
 *
 * Implements:
 * - Rate limiting by client IP
 * - Parameter validation and sanitization
 * - HTTP Cache-Control headers
 * - Indistinguishable response for non-existent and hidden profiles (R8)
 */

import type { Context } from 'hono'
import { getSimilarProfiles } from './similarProfilesService'
import type { SimilarProfilesRequest } from '@/features/similarProfiles/domain'

// Simple IP-based rate limiting: max 60 requests per minute per IP
interface RateLimitBucket {
    count: number
    resetAt: number
}

const rateLimitMap = new Map<string, RateLimitBucket>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const bucket = rateLimitMap.get(ip)

    if (!bucket || now > bucket.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
        return false
    }

    bucket.count++
    return bucket.count > MAX_REQUESTS_PER_WINDOW
}

/**
 * Periodically purge stale rate limit buckets to prevent memory leak
 */
setInterval(() => {
    const now = Date.now()
    for (const [ip, bucket] of rateLimitMap.entries()) {
        if (now > bucket.resetAt) {
            rateLimitMap.delete(ip)
        }
    }
}, 5 * 60 * 1000)

function sanitizeString(val: string | undefined | null, maxLen = 120): string | null {
    if (!val || typeof val !== 'string') return null
    const trimmed = val.trim()
    if (!trimmed || trimmed.length > maxLen) return null
    return trimmed.replace(/[<>'"]/g, '')
}

/**
 * GET /api/v1/similar-profiles
 *
 * Query params:
 * - profileId (required): string
 * - zone (optional): string
 * - mpio (optional): string (5-digit DIVIPOLA)
 * - propertyType (optional): string
 * - visitorZone (optional): string
 * - visitorId (optional): string
 */
export async function getSimilarProfilesHandler(c: Context): Promise<Response> {
    const clientIp =
        c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
        c.req.header('cf-connecting-ip') ||
        '127.0.0.1'

    if (isRateLimited(clientIp)) {
        return c.json(
            { status: 'error', code: 'limite', message: 'Límite de solicitudes superado.' },
            429
        )
    }

    const rawProfileId = c.req.query('profileId')
    if (!rawProfileId || typeof rawProfileId !== 'string') {
        return c.json(
            { status: 'error', code: 'no_autorizado', message: 'Parámetro profileId requerido.' },
            400
        )
    }

    const profileId = sanitizeString(rawProfileId, 128)
    if (!profileId) {
        return c.json(
            { status: 'error', code: 'no_autorizado', message: 'profileId no válido.' },
            400
        )
    }

    const request: SimilarProfilesRequest = {
        profileId,
        zone: sanitizeString(c.req.query('zone')),
        municipioCode: sanitizeString(c.req.query('mpio')),
        propertyType: sanitizeString(c.req.query('propertyType')),
        visitorZone: sanitizeString(c.req.query('visitorZone')),
        visitorId: sanitizeString(c.req.query('visitorId')),
    }

    try {
        const { outcome, metrics } = await getSimilarProfiles(request)

        // Set caching and debugging headers
        c.header(
            'Cache-Control',
            'public, max-age=300, s-maxage=900, stale-while-revalidate=60'
        )
        c.header('X-Similar-Profiles-Cache', metrics.cacheHit ? 'HIT' : 'MISS')
        c.header('X-Similar-Profiles-Reads', String(metrics.documentsRead))

        return c.json(outcome, 200)
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[SimilarProfilesHandler] Internal error:', message)
        return c.json({ status: 'error', code: 'no_disponible' }, 500)
    }
}
