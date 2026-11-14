/**
 * Similar Profiles Server Retrieval & Ranking Service (ADR-01, ADR-02, Invariants I5 & I6)
 *
 * Implements bounded Firestore reads (<= 3 queries, <= 40 documents),
 * in-memory LRU caching (15-min TTL), public field projection (white-list),
 * and pure domain scoring & selection.
 */

import { SIMILAR_PROFILES_CONFIG } from '@config/similarProfiles.config'
import { adminFirestore } from '@/services/firebase/admin'
import {
    isMerchantEligibleForRecommendations,
    evaluateCandidateProfile,
    rankAndSelectSimilarProfiles,
    type CandidateProfile,
    type SimilarProfilesData,
    type SimilarProfilesOutcome,
    type SimilarProfilesRequest,
    type ZoneSource,
    type ProximityTier,
} from '@/features/similarProfiles/domain'
import { similarProfilesMemoryCache } from './cache'

export interface RetrievalMetrics {
    queryCount: number
    documentsRead: number
    cacheHit: boolean
}

/**
 * Strips private data and projects a raw Firestore document into a safe CandidateProfile.
 * Enforces Invariant I6 (strict public allowlist).
 */
export function projectToCandidateProfile(id: string, raw: Record<string, unknown>): CandidateProfile {
    return {
        userId: id,
        userName: typeof raw.userName === 'string' ? raw.userName : null,
        userRazonSocial: typeof raw.userRazonSocial === 'string' ? raw.userRazonSocial : null,
        userContactName: typeof raw.userContactName === 'string' ? raw.userContactName : null,
        userProfession: typeof raw.userProfession === 'string' ? raw.userProfession : null,
        userDescription: typeof raw.userDescription === 'string' ? raw.userDescription : null,
        userExperience: typeof raw.userExperience === 'string' ? raw.userExperience : null,
        userPhotoUrl: typeof raw.userPhotoUrl === 'string' ? raw.userPhotoUrl : null,
        userJoined: typeof raw.userJoined === 'string' ? raw.userJoined : null,
        userCategories: Array.isArray(raw.userCategories)
            ? raw.userCategories.filter((c): c is string => typeof c === 'string')
            : [],
        userClasification: typeof raw.userClasification === 'string' ? raw.userClasification : null,
        userCiudad: typeof raw.userCiudad === 'string' ? raw.userCiudad : null,
        userDirection: typeof raw.userDirection === 'string' ? raw.userDirection : null,
        userDepartamento: typeof raw.userDepartamento === 'string' ? raw.userDepartamento : null,
        userCodigoPostal: typeof raw.userCodigoPostal === 'string' ? raw.userCodigoPostal : null,
        userZonasCobertura: Array.isArray(raw.userZonasCobertura)
            ? raw.userZonasCobertura.filter((z): z is string => typeof z === 'string')
            : [],
        coberturaTodaLaCiudad: raw.coberturaTodaLaCiudad === true,
        userGrade: typeof raw.userGrade === 'string' ? raw.userGrade : null,
        profileTier: raw.profileTier === 'destacado' ? 'destacado' : 'free',
        isAvailableNow: raw.isAvailableNow === true,
        lastActive: typeof raw.lastActive === 'string' ? raw.lastActive : null,
        trustScore: typeof raw.trustScore === 'number' ? raw.trustScore : null,
        earnedBadges: Array.isArray(raw.earnedBadges)
            ? raw.earnedBadges.filter(
                  (b): b is { category: string; issuedAt: string; expiresAt?: string } =>
                      typeof b === 'object' && b !== null && typeof b.category === 'string'
              )
            : undefined,
        favoritesCount: typeof raw.favoritesCount === 'number' ? raw.favoritesCount : undefined,
        status: typeof raw.status === 'string' ? raw.status : 'active',
        isDeleted: raw.isDeleted === true,
        userSelectedRol: typeof raw.userSelectedRol === 'number' ? raw.userSelectedRol : 2,
        privacySettings:
            typeof raw.privacySettings === 'object' && raw.privacySettings !== null
                ? (raw.privacySettings as { showPhone?: boolean; showEmail?: boolean; isPrivateProfile?: boolean })
                : undefined,
    }
}

/**
 * Core Similar Profiles retrieval and recommendation engine.
 * 
 * @param request Validated request payload
 * @param customDb Optional injected Firestore DB instance (for integration tests & emulator)
 */
export async function getSimilarProfiles(
    request: SimilarProfilesRequest,
    customDb?: any
): Promise<{ outcome: SimilarProfilesOutcome; metrics: RetrievalMetrics }> {
    const metrics: RetrievalMetrics = {
        queryCount: 0,
        documentsRead: 0,
        cacheHit: false,
    }

    if (!SIMILAR_PROFILES_CONFIG.enabled) {
        return { outcome: { status: 'vacio' }, metrics }
    }

    const { profileId, zone, municipioCode, propertyType, visitorZone, visitorId } = request
    if (!profileId || typeof profileId !== 'string') {
        return { outcome: { status: 'vacio' }, metrics }
    }

    const db = customDb || adminFirestore
    if (!db) {
        return { outcome: { status: 'error', code: 'no_disponible' }, metrics }
    }

    // 1. Resolve Coarse Cache Key (ADR-02 & R8: Zero visitor ID in cache key)
    const coarseZone = (zone || visitorZone || municipioCode || 'national').toLowerCase().trim()
    const cacheKey = `simprof:${profileId.trim()}:${coarseZone}`

    const cachedData = similarProfilesMemoryCache.get(cacheKey) as SimilarProfilesData | null
    if (cachedData) {
        metrics.cacheHit = true
        return {
            outcome: { status: 'ok', data: cachedData },
            metrics,
        }
    }

    // 2. Fetch target profile document (1 document read)
    const targetDocRef = db.collection('usersComerciantesCalificados').doc(profileId.trim())
    const targetDocSnap = await targetDocRef.get()
    metrics.queryCount++
    metrics.documentsRead++

    if (!targetDocSnap.exists) {
        return { outcome: { status: 'vacio' }, metrics }
    }

    const targetRaw = targetDocSnap.data() as Record<string, unknown>
    const targetProfile = projectToCandidateProfile(targetDocSnap.id, targetRaw)

    // Verify target profile is active Comerciante
    if (targetProfile.isDeleted || targetProfile.status === 'suspended' || targetProfile.status === 'hidden') {
        return { outcome: { status: 'vacio' }, metrics }
    }

    const targetCategories = targetProfile.userCategories || []
    if (targetCategories.length === 0) {
        return { outcome: { status: 'vacio' }, metrics }
    }

    // 3. Resolve Reference Zone & Source (ADR-03 & R2)
    let resolvedZoneName: string | null = null
    let resolvedZoneSource: ZoneSource | null = null

    if (zone && zone.trim()) {
        resolvedZoneName = zone.trim()
        resolvedZoneSource = 'busqueda'
    } else if (municipioCode && municipioCode.trim()) {
        resolvedZoneName = municipioCode.trim()
        resolvedZoneSource = 'busqueda'
    } else if (visitorZone && visitorZone.trim()) {
        resolvedZoneName = visitorZone.trim()
        resolvedZoneSource = 'visitante'
    } else if (targetProfile.userCiudad || targetProfile.userDirection) {
        resolvedZoneName = (targetProfile.userCiudad || targetProfile.userDirection || '').trim()
        resolvedZoneSource = 'perfil_visitado'
    }

    // 4. Bounded Queries to Firestore (Invariant I5: <= 3 queries, <= 40 docs total)
    const candidatesMap = new Map<string, CandidateProfile>()
    const maxFetchCap = SIMILAR_PROFILES_CONFIG.maxCandidatesFetched // 40
    const primaryCategory = targetCategories[0]!

    // Query 1: Primary category match
    if (metrics.queryCount < SIMILAR_PROFILES_CONFIG.maxQueries && candidatesMap.size < maxFetchCap) {
        const remainingLimit = maxFetchCap - candidatesMap.size
        const q1Snap = await db
            .collection('usersComerciantesCalificados')
            .where('userCategories', 'array-contains', primaryCategory)
            .limit(remainingLimit)
            .get()

        metrics.queryCount++
        metrics.documentsRead += q1Snap.size

        q1Snap.forEach((doc: any) => {
            if (doc.id !== targetProfile.userId) {
                candidatesMap.set(doc.id, projectToCandidateProfile(doc.id, doc.data()))
            }
        })
    }

    // Query 2: Secondary category match if candidate count is below minResults (2) and secondary category exists
    if (
        metrics.queryCount < SIMILAR_PROFILES_CONFIG.maxQueries &&
        candidatesMap.size < 6 &&
        targetCategories.length > 1
    ) {
        const secondaryCategory = targetCategories[1]!
        const remainingLimit = maxFetchCap - candidatesMap.size
        if (remainingLimit > 0) {
            const q2Snap = await db
                .collection('usersComerciantesCalificados')
                .where('userCategories', 'array-contains', secondaryCategory)
                .limit(remainingLimit)
                .get()

            metrics.queryCount++
            metrics.documentsRead += q2Snap.size

            q2Snap.forEach((doc: any) => {
                if (doc.id !== targetProfile.userId && !candidatesMap.has(doc.id)) {
                    candidatesMap.set(doc.id, projectToCandidateProfile(doc.id, doc.data()))
                }
            })
        }
    }

    // Query 3: Zone fallback if still below minimum and zone exists
    if (
        metrics.queryCount < SIMILAR_PROFILES_CONFIG.maxQueries &&
        candidatesMap.size < SIMILAR_PROFILES_CONFIG.minResults &&
        resolvedZoneName
    ) {
        const remainingLimit = Math.min(10, maxFetchCap - candidatesMap.size)
        if (remainingLimit > 0) {
            const q3Snap = await db
                .collection('usersComerciantesCalificados')
                .where('userCiudad', '==', resolvedZoneName)
                .limit(remainingLimit)
                .get()

            metrics.queryCount++
            metrics.documentsRead += q3Snap.size

            q3Snap.forEach((doc: any) => {
                if (doc.id !== targetProfile.userId && !candidatesMap.has(doc.id)) {
                    candidatesMap.set(doc.id, projectToCandidateProfile(doc.id, doc.data()))
                }
            })
        }
    }

    // 5. Pure Domain Eligibility Filtering (Invariant I1)
    const eligibleCandidates: CandidateProfile[] = []
    for (const candidate of candidatesMap.values()) {
        const isEligible = isMerchantEligibleForRecommendations(candidate, {
            targetProfileId: targetProfile.userId,
            visitorProfileId: visitorId || null,
        })
        if (isEligible) {
            eligibleCandidates.push(candidate)
        }
    }

    // 6. Score & Rank (Invariants I2, I3, I4 & R2, R12)
    const scoringContext = {
        targetCategories,
        targetZone: resolvedZoneName,
        targetMpioCode: municipioCode || null,
        targetDepartamento: targetProfile.userDepartamento || null,
        visitorPropertyType: propertyType || null,
    }

    const evaluated = eligibleCandidates.map((cand) => evaluateCandidateProfile(cand, scoringContext))
    const selectedItems = rankAndSelectSimilarProfiles(evaluated)

    // Invariant I4: If below minResults (2), returns 'vacio'
    if (selectedItems.length < SIMILAR_PROFILES_CONFIG.minResults) {
        return { outcome: { status: 'vacio' }, metrics }
    }

    // 7. Resolve Farthest Proximity Tier
    let farthestTier: ProximityTier = 'municipio'
    if (selectedItems.some((i) => i.tier === 'nacional')) {
        farthestTier = 'nacional'
    } else if (selectedItems.some((i) => i.tier === 'departamento')) {
        farthestTier = 'departamento'
    }

    const payload: SimilarProfilesData = {
        items: selectedItems,
        basis: {
            categoryName: primaryCategory,
            zoneName: resolvedZoneName,
            zoneSource: resolvedZoneSource,
            farthestTier,
        },
        generatedAt: new Date().toISOString(),
    }

    // 8. Store in LRU cache
    similarProfilesMemoryCache.set(cacheKey, payload, SIMILAR_PROFILES_CONFIG.cacheTtlSeconds)

    return {
        outcome: { status: 'ok', data: payload },
        metrics,
    }
}

