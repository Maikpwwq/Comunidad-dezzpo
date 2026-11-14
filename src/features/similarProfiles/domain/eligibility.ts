/**
 * Eligibility Domain Logic (Pure Predicate)
 *
 * Implements Invariant I1 & R3: A single shared visibility definition
 * determining if a merchant can appear in recommendations.
 */

import type { CandidateProfile } from './types'

export interface EligibilityContext {
    /** Target profile ID being visited */
    readonly targetProfileId: string
    /** Visitor ID if authenticated (to prevent showing visitor's own profile) */
    readonly visitorProfileId?: string | null | undefined
}

/**
 * Pure predicate to evaluate merchant eligibility.
 * 
 * Excludes:
 * - Visited profile itself (targetProfileId)
 * - Visitor's own profile (visitorProfileId)
 * - Suspended, hidden, inactive or deleted accounts
 * - Non-merchant roles (must be role 2 if specified)
 * - Incomplete profiles without minimal directory data (no name/razonSocial or no categories)
 * - Private profiles according to privacy settings
 */
export function isMerchantEligibleForRecommendations(
    candidate: CandidateProfile,
    context: EligibilityContext
): boolean {
    if (!candidate || !candidate.userId) {
        return false
    }

    const cleanCandidateId = candidate.userId.trim()
    const cleanTargetId = (context.targetProfileId || '').trim()

    // 1. Exclude visited profile
    if (cleanCandidateId === cleanTargetId) {
        return false
    }

    // 2. Exclude visitor's own profile if authenticated
    if (context.visitorProfileId) {
        const cleanVisitorId = context.visitorProfileId.trim()
        if (cleanCandidateId === cleanVisitorId) {
            return false
        }
    }

    // 3. Exclude deleted accounts
    if (candidate.isDeleted === true) {
        return false
    }

    // 4. Exclude suspended, hidden, pending or inactive statuses
    if (candidate.status) {
        const cleanStatus = candidate.status.toLowerCase().trim()
        if (['suspended', 'suspendido', 'hidden', 'oculto', 'inactive', 'inactivo', 'pending', 'pendiente', 'deleted', 'eliminado'].includes(cleanStatus)) {
            return false
        }
    }

    // 5. Enforce Comerciante role (role 2 in legacy/schema)
    if (candidate.userSelectedRol !== undefined && candidate.userSelectedRol !== null) {
        if (candidate.userSelectedRol !== 2) {
            return false
        }
    }

    // 6. Respect privacy settings
    if (candidate.privacySettings?.isPrivateProfile === true) {
        return false
    }

    // 7. Enforce minimal public directory completeness
    const hasName = Boolean(
        (candidate.userName && candidate.userName.trim().length > 0) ||
        (candidate.userRazonSocial && candidate.userRazonSocial.trim().length > 0)
    )
    if (!hasName) {
        return false
    }

    const categories = candidate.userCategories || []
    if (!Array.isArray(categories) || categories.length === 0 || !categories.some((c) => Boolean(c && String(c).trim()))) {
        return false
    }

    return true
}

