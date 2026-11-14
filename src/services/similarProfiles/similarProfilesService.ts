/**
 * Similar Profiles Client Service Adapter (R1, R7)
 *
 * Calls the bounded server endpoint GET /api/v1/similar-profiles
 * Supports AbortController signal to cleanly cancel in-flight requests
 * when the user navigates between profiles.
 */

import type {
    SimilarProfilesOutcome,
    SimilarProfilesRequest,
} from '@/features/similarProfiles/domain'

export interface FetchSimilarProfilesOptions extends SimilarProfilesRequest {
    readonly signal?: AbortSignal | undefined
}

/**
 * Fetches similar, featured, and nearby professionals for a visited profile.
 * 
 * Returns `{ status: 'vacio' }` or `{ status: 'ok', data }`.
 * Never throws — failures return a safe outcome object so the host page is isolated.
 */
export async function fetchSimilarProfiles(
    options: FetchSimilarProfilesOptions
): Promise<SimilarProfilesOutcome> {
    const { profileId, zone, municipioCode, propertyType, visitorZone, visitorId, signal } = options

    if (!profileId || !profileId.trim()) {
        return { status: 'vacio' }
    }

    const params = new URLSearchParams()
    params.set('profileId', profileId.trim())

    if (zone && zone.trim()) params.set('zone', zone.trim())
    if (municipioCode && municipioCode.trim()) params.set('mpio', municipioCode.trim())
    if (propertyType && propertyType.trim()) params.set('propertyType', propertyType.trim())
    if (visitorZone && visitorZone.trim()) params.set('visitorZone', visitorZone.trim())
    if (visitorId && visitorId.trim()) params.set('visitorId', visitorId.trim())

    try {
        const init: RequestInit = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }
        if (signal) {
            init.signal = signal
        }

        const response = await fetch(`/api/v1/similar-profiles?${params.toString()}`, init)

        if (!response.ok) {
            if (response.status === 429) {
                return { status: 'error', code: 'limite' }
            }
            if (response.status === 400 || response.status === 401) {
                return { status: 'error', code: 'no_autorizado' }
            }
            return { status: 'error', code: 'no_disponible' }
        }

        const data = (await response.json()) as SimilarProfilesOutcome
        return data
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
            // Cancelled in flight by navigation
            return { status: 'vacio' }
        }
        console.warn('[similarProfilesService] Failed to load similar profiles:', err)
        return { status: 'error', code: 'no_disponible' }
    }
}
