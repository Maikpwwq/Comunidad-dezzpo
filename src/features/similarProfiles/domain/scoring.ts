/**
 * Scoring and Ranking Domain Logic (Pure Functions)
 *
 * Implements Invariants I1, I2, I3, I4, R2, R12, and R13:
 * - Trade score (40%) with primary category boost and monotonic increase
 * - Proximity score (30%) across municipio, departamento, and nacional tiers
 * - Quality score (20%) using real verification, badges, completeness, and recency
 * - Context score (10%) reusing fuzzyEngine compatibility
 * - Deterministic daily tie-breaking rotation (R12)
 */

import { SIMILAR_PROFILES_CONFIG } from '@config/similarProfiles.config'
import { merchantCoversZone } from '@features/zones/domain/catalog'
import {
    evaluateFuzzyMatch,
    type ZoneSignalType,
} from '@services/matching'
import {
    normalizePropertyType,
    type PropertyTypeId,
} from '@config/matching.config'
import type {
    CandidateProfile,
    ProximityTier,
    RecommendationReason,
    SimilarProfileItem,
} from './types'

export interface ScoringInputContext {
    /** Target profile being compared against */
    readonly targetCategories: readonly string[]
    /** Reference zone coordinates/slugs */
    readonly targetZone?: string | null | undefined
    readonly targetMpioCode?: string | null | undefined
    readonly targetDepartamento?: string | null | undefined
    /** Visitor context if any */
    readonly visitorPropertyType?: PropertyTypeId | string | null | undefined
    /** Optional date seed for daily tie-breaker (defaults to current UTC date YYYY-MM-DD) */
    readonly dateSeed?: string | undefined
}

export interface CandidateEvaluationResult {
    readonly item: SimilarProfileItem
    readonly rawScores: {
        readonly trade: number
        readonly proximity: number
        readonly quality: number
        readonly context: number
    }
}

/**
 * Normalizes text for accent- and case-insensitive comparison.
 */
function normalizeText(text: string | null | undefined): string {
    if (!text) return ''
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

/**
 * 1. Trade Specialty Score (0.0 to 1.0)
 * 
 * Invariant I3: Monotonically non-decreasing as more categories match.
 * Primary category match receives 0.70 base; additional secondary matches receive 0.30 distributed.
 */
export function calculateTradeScore(
    targetCategories: readonly string[],
    candidateCategories: readonly string[] | undefined
): { score: number; hasTradeMatch: boolean } {
    if (!candidateCategories || candidateCategories.length === 0 || targetCategories.length === 0) {
        return { score: 0.0, hasTradeMatch: false }
    }

    const normCandidate = new Set(candidateCategories.map(normalizeText))
    const normTarget = targetCategories.map(normalizeText).filter(Boolean)

    if (normTarget.length === 0) {
        return { score: 0.0, hasTradeMatch: false }
    }

    const primaryTarget = normTarget[0]!
    const matchesPrimary = normCandidate.has(primaryTarget)

    // Count how many target categories match
    let totalMatches = 0
    let secondaryMatches = 0

    normTarget.forEach((cat, idx) => {
        if (normCandidate.has(cat)) {
            totalMatches++
            if (idx > 0) secondaryMatches++
        }
    })

    if (totalMatches === 0) {
        return { score: 0.0, hasTradeMatch: false }
    }

    // Calculation:
    // If primary matches: 0.70 base + (secondaryMatches / Math.max(1, normTarget.length - 1)) * 0.30
    // If primary does not match: (secondaryMatches / Math.max(1, normTarget.length - 1)) * 0.50
    let score = 0.0
    if (matchesPrimary) {
        const secondaryWeight = normTarget.length > 1 ? (secondaryMatches / (normTarget.length - 1)) * 0.30 : 0.30
        score = 0.70 + secondaryWeight
    } else {
        const totalPossible = Math.max(1, normTarget.length - 1)
        score = (secondaryMatches / totalPossible) * 0.50
    }

    const clamped = Math.min(1.0, Math.max(0.0, Math.round(score * 100) / 100))
    return { score: clamped, hasTradeMatch: totalMatches > 0 }
}

/**
 * 2. Proximity Score (0.0 to 1.0) and Tier Resolution
 * 
 * Maps candidate location and coverage to 'municipio' (1.0), 'departamento' (0.6), or 'nacional' (0.25).
 */
export function calculateProximityScore(
    targetZone: string | null | undefined,
    targetMpioCode: string | null | undefined,
    targetDept: string | null | undefined,
    candidate: CandidateProfile
): { tier: ProximityTier; score: number; isSameZone: boolean } {
    const normTargetZone = normalizeText(targetZone)
    const normTargetMpio = normalizeText(targetMpioCode)
    const normTargetDept = normalizeText(targetDept || 'cundinamarca')

    const userCiudad = normalizeText(candidate.userCiudad)
    const userDirection = normalizeText(candidate.userDirection)
    const userDept = normalizeText(candidate.userDepartamento)
    const userPostal = normalizeText(candidate.userCodigoPostal)
    const userZonas = (candidate.userZonasCobertura || []).map(normalizeText)

    // Check tier 1: Same municipio / locality
    let isMunicipio = false
    if (normTargetMpio && ((userPostal && userPostal.includes(normTargetMpio)) || userZonas.includes(normTargetMpio) || merchantCoversZone(candidate.userZonasCobertura, normTargetMpio))) {
        isMunicipio = true
    } else if (normTargetZone) {
        if (
            userDirection.includes(normTargetZone) ||
            userCiudad.includes(normTargetZone) ||
            userZonas.includes(normTargetZone) ||
            merchantCoversZone(candidate.userZonasCobertura, normTargetZone)
        ) {
            isMunicipio = true
        }
    }

    if (isMunicipio) {
        return {
            tier: 'municipio',
            score: SIMILAR_PROFILES_CONFIG.proximityTierScores.municipio,
            isSameZone: true,
        }
    }

    // Check tier 2: Same departamento / metro region
    let isDept = false
    if (userDept && normTargetDept && (userDept.includes(normTargetDept) || normTargetDept.includes(userDept))) {
        isDept = true
    } else if (
        (userCiudad.includes('bogota') || userDirection.includes('bogota') || userDept.includes('cundinamarca')) &&
        (normTargetZone?.includes('bogota') || normTargetDept?.includes('cundinamarca'))
    ) {
        isDept = true
    } else if (candidate.coberturaTodaLaCiudad === true) {
        isDept = true
    }

    if (isDept) {
        return {
            tier: 'departamento',
            score: SIMILAR_PROFILES_CONFIG.proximityTierScores.departamento,
            isSameZone: false,
        }
    }

    // Fallback: Nacional
    return {
        tier: 'nacional',
        score: SIMILAR_PROFILES_CONFIG.proximityTierScores.nacional,
        isSameZone: false,
    }
}

/**
 * 3. Quality & Completeness Score (0.0 to 1.0)
 * 
 * Signals:
 * - Verification / high trustScore: up to 0.35
 * - Badges / Certifications: up to 0.25
 * - Profile completeness (photo, description, experience): up to 0.25
 * - Recent activity / available now: up to 0.15
 */
export function calculateQualityScore(candidate: CandidateProfile): {
    score: number
    reasons: RecommendationReason[]
    isFeatured: boolean
} {
    const reasons: RecommendationReason[] = []
    let total = 0.0

    // A. Verification & Trust
    const isGradeVerified = candidate.userGrade && normalizeText(candidate.userGrade).includes('verific')
    const hasHighTrust = typeof candidate.trustScore === 'number' && candidate.trustScore >= 70
    if (isGradeVerified || hasHighTrust) {
        total += 0.35
        reasons.push('verificado')
    }

    // B. Certifications & Badges
    const badgeCount = candidate.earnedBadges?.length || 0
    if (badgeCount > 0) {
        total += 0.25
        reasons.push('certificado')
    }

    // C. Profile Completeness
    const hasPhoto = Boolean(candidate.userPhotoUrl && !candidate.userPhotoUrl.includes('default'))
    const hasDesc = Boolean(candidate.userDescription && candidate.userDescription.trim().length >= 30)
    const hasExp = Boolean(candidate.userExperience && candidate.userExperience.trim().length > 0)
    if (hasPhoto && hasDesc && hasExp) {
        total += 0.25
        reasons.push('perfil_completo')
    } else if (hasPhoto && (hasDesc || hasExp)) {
        total += 0.15
    }

    // D. Recency / Availability
    let isRecent = false
    if (candidate.isAvailableNow === true) {
        isRecent = true
    } else if (candidate.lastActive) {
        const lastActiveTime = new Date(candidate.lastActive).getTime()
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
        if (!Number.isNaN(lastActiveTime) && lastActiveTime >= thirtyDaysAgo) {
            isRecent = true
        }
    }

    if (isRecent) {
        total += 0.15
        reasons.push('activo_reciente')
    }

    // E. Premium tier boost: if profileTier === 'destacado', guaranteed featured flag
    const isExplicitlyDestacado = candidate.profileTier === 'destacado'

    const clampedScore = Math.min(1.0, Math.max(0.0, Math.round(total * 100) / 100))
    const isFeatured = isExplicitlyDestacado || clampedScore >= SIMILAR_PROFILES_CONFIG.featuredQualityThreshold

    return {
        score: clampedScore,
        reasons,
        isFeatured,
    }
}

/**
 * 4. Contextual Structure Compatibility Score (0.0 to 1.0)
 * 
 * Reuses the canonical fuzzyEngine matrix between merchant structure and target property type.
 */
export function calculateContextScore(
    candidateStructure: string | null | undefined,
    visitorPropertyType: PropertyTypeId | string | null | undefined,
    zoneSignal: ZoneSignalType = 'same_zone'
): { score: number; isAfin: boolean; badgeText: string | null; explanation: string | null } {
    const normalizedProp = visitorPropertyType ? normalizePropertyType(visitorPropertyType) : null

    const match = evaluateFuzzyMatch({
        propertyType: normalizedProp,
        merchantStructure: candidateStructure,
        zoneSignal,
    })

    return {
        score: match.score,
        isAfin: match.score >= 0.85,
        badgeText: match.badgeText,
        explanation: match.explanation,
    }
}

/**
 * Deterministic daily hash for equitable rotation of tied candidates (R12).
 * Returns a floating pseudo-random value in [0.0, 1.0) based on userId + date.
 */
export function computeDailyTieBreakerHash(userId: string, dateSeedIso?: string): number {
    const seed = dateSeedIso || new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const str = `${userId}:${seed}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0 // Convert to 32bit integer
    }
    const positive = Math.abs(hash)
    return (positive % 10000) / 10000
}

/**
 * Evaluates and scores a single candidate profile against the context.
 */
export function evaluateCandidateProfile(
    candidate: CandidateProfile,
    context: ScoringInputContext
): CandidateEvaluationResult {
    // 1. Trade
    const tradeRes = calculateTradeScore(context.targetCategories, candidate.userCategories)

    // 2. Proximity
    const proxRes = calculateProximityScore(
        context.targetZone,
        context.targetMpioCode,
        context.targetDepartamento,
        candidate
    )

    // 3. Quality
    const qualRes = calculateQualityScore(candidate)

    // 4. Context
    const zoneSignalForContext: ZoneSignalType = proxRes.isSameZone
        ? 'same_zone'
        : proxRes.tier === 'departamento'
          ? 'citywide_coverage'
          : 'other_zone'
    const contextRes = calculateContextScore(
        candidate.userClasification,
        context.visitorPropertyType,
        zoneSignalForContext
    )

    // Composite weighted score
    const w = SIMILAR_PROFILES_CONFIG.weights

    // R5 Relevance Gate: Must either match the trade OR be a featured/quality merchant from the same zone ("destacados de la misma zona")
    const isRelevant = tradeRes.hasTradeMatch || (proxRes.isSameZone && qualRes.isFeatured)
    if (!isRelevant) {
        const item: SimilarProfileItem = {
            profileId: candidate.userId,
            displayName:
                (candidate.userName && candidate.userName.trim()) ||
                (candidate.userRazonSocial && candidate.userRazonSocial.trim()) ||
                'Comerciante',
            userRazonSocial: candidate.userRazonSocial || undefined,
            userProfession: candidate.userProfession || undefined,
            userDescription: candidate.userDescription || undefined,
            userExperience: candidate.userExperience || undefined,
            userPhotoUrl: candidate.userPhotoUrl || undefined,
            userJoined: candidate.userJoined || undefined,
            userCategories: candidate.userCategories || [],
            userClasification: candidate.userClasification || undefined,
            userDirection: candidate.userDirection || undefined,
            favoritesCount: candidate.favoritesCount ?? undefined,
            tier: proxRes.tier,
            score: 0.0,
            reasons: [],
            reasonLabels: [],
            featured: qualRes.isFeatured,
            compatibilityBadge: null,
            compatibilityExplanation: null,
        }
        return {
            item,
            rawScores: {
                trade: 0,
                proximity: 0,
                quality: 0,
                context: 0,
            },
        }
    }

    const compositeScore =
        tradeRes.score * w.trade +
        proxRes.score * w.proximity +
        qualRes.score * w.quality +
        contextRes.score * w.context

    const roundedComposite = Math.min(1.0, Math.max(0.0, Math.round(compositeScore * 100) / 100))

    // Collect recommendation reasons
    const reasons: RecommendationReason[] = []
    if (tradeRes.hasTradeMatch) {
        reasons.push('mismo_oficio')
    }
    if (proxRes.isSameZone) {
        reasons.push('tu_zona')
    }
    qualRes.reasons.forEach((r) => {
        if (!reasons.includes(r)) reasons.push(r)
    })
    if (contextRes.isAfin) {
        reasons.push('afin_a_tu_inmueble')
    }

    const reasonLabels = reasons.map((r) => SIMILAR_PROFILES_CONFIG.reasonLabels[r])

    // Primary display name
    const displayName =
        (candidate.userName && candidate.userName.trim()) ||
        (candidate.userRazonSocial && candidate.userRazonSocial.trim()) ||
        'Comerciante'

    const item: SimilarProfileItem = {
        profileId: candidate.userId,
        displayName,
        userRazonSocial: candidate.userRazonSocial || undefined,
        userProfession: candidate.userProfession || undefined,
        userDescription: candidate.userDescription || undefined,
        userExperience: candidate.userExperience || undefined,
        userPhotoUrl: candidate.userPhotoUrl || undefined,
        userJoined: candidate.userJoined || undefined,
        userCategories: candidate.userCategories || [],
        userClasification: candidate.userClasification || undefined,
        userDirection: candidate.userDirection || undefined,
        favoritesCount: candidate.favoritesCount ?? undefined,
        tier: proxRes.tier,
        score: roundedComposite,
        reasons,
        reasonLabels,
        featured: qualRes.isFeatured,
        compatibilityBadge: contextRes.badgeText,
        compatibilityExplanation: contextRes.explanation,
    }

    return {
        item,
        rawScores: {
            trade: tradeRes.score,
            proximity: proxRes.score,
            quality: qualRes.score,
            context: contextRes.score,
        },
    }
}

/**
 * Pure ranking and selection pipeline.
 *
 * Implements:
 * - Deterministic sorting by score descending
 * - R12 Daily tie-breaker rotation for candidates with near-identical scores (within +/- 0.015)
 * - Deterministic stable fallback by userId (Invariant I2)
 * - Result bounding [minResults, maxResults] (Invariant I4)
 */
export function rankAndSelectSimilarProfiles(
    evaluated: readonly CandidateEvaluationResult[],
    dateSeed?: string
): readonly SimilarProfileItem[] {
    const relevant = evaluated.filter((res) => res.item.score > 0)
    const sorted = [...relevant].sort((a, b) => {
        const diff = b.item.score - a.item.score
        // If difference is greater than 0.015, primary score decides strictly
        if (Math.abs(diff) > 0.015) {
            return diff
        }

        // Within 0.015 near-tie: apply R12 daily rotation if enabled
        if (SIMILAR_PROFILES_CONFIG.dailyTieRotationEnabled) {
            const hashA = computeDailyTieBreakerHash(a.item.profileId, dateSeed)
            const hashB = computeDailyTieBreakerHash(b.item.profileId, dateSeed)
            if (hashB !== hashA) {
                return hashB - hashA
            }
        }

        // Final stable tie-breaker by profileId (Invariant I2)
        return a.item.profileId.localeCompare(b.item.profileId)
    })

    const selected = sorted.map((res) => res.item).slice(0, SIMILAR_PROFILES_CONFIG.maxResults)

    // Invariant I4: If below minResults, returns empty array
    if (selected.length < SIMILAR_PROFILES_CONFIG.minResults) {
        return []
    }

    return selected
}

