/**
 * Analytics and Telemetry for Similar Profiles (Fase 3: R9)
 *
 * Privacy Invariants:
 * - Zero visitor PII (no visitorId, email, phone, IP)
 * - Coarse event parameters only
 * - Transparent and reproducible audit trail in funnel_events
 */

import { trackEvent } from '@utils/analytics'
import type { ProximityTier, ZoneSource, RecommendationReason } from '../domain/types'

export interface SimilarProfilesImpressionParams {
    readonly visitedProfileId: string
    readonly categoryName: string
    readonly zoneSource: ZoneSource | null
    readonly resultsCount: number
    readonly farthestTier: ProximityTier | null
}

export interface SimilarProfilesCardClickParams {
    readonly visitedProfileId: string
    readonly targetProfileId: string
    readonly position: number
    readonly tier: ProximityTier
    readonly primaryReason?: RecommendationReason | undefined
    readonly isFeatured: boolean
}

export interface SimilarProfilesQuoteClickParams {
    readonly visitedProfileId: string
    readonly targetProfileId: string
    readonly position: number
}

export interface SimilarProfilesViewAllClickParams {
    readonly visitedProfileId: string
    readonly categoryName: string
    readonly zoneName: string | null
}

export function trackSimilarProfilesImpression(params: SimilarProfilesImpressionParams): void {
    trackEvent('similar_profiles_impression', {
        visited_profile_id: params.visitedProfileId,
        category_name: params.categoryName,
        zone_source: params.zoneSource,
        results_count: params.resultsCount,
        farthest_tier: params.farthestTier,
    })
}

export function trackSimilarProfilesCardClick(params: SimilarProfilesCardClickParams): void {
    trackEvent('similar_profiles_card_click', {
        visited_profile_id: params.visitedProfileId,
        target_profile_id: params.targetProfileId,
        position: params.position,
        tier: params.tier,
        primary_reason: params.primaryReason,
        is_featured: params.isFeatured,
    })
}

export function trackSimilarProfilesQuoteClick(params: SimilarProfilesQuoteClickParams): void {
    trackEvent('similar_profiles_quote_click', {
        visited_profile_id: params.visitedProfileId,
        target_profile_id: params.targetProfileId,
        position: params.position,
    })
}

export function trackSimilarProfilesViewAllClick(params: SimilarProfilesViewAllClickParams): void {
    trackEvent('similar_profiles_view_all_click', {
        visited_profile_id: params.visitedProfileId,
        category_name: params.categoryName,
        zone_name: params.zoneName,
    })
}

