/**
 * Structured Project Entity Types (ADR Option C)
 *
 * Replaces unstructured `userGalleryUrl: string[]` with typed, search-indexable projects
 * supporting Before/After image pairs, Habeas Data client consent, and zone/category tagging.
 */

export interface BeforeAfterPair {
    readonly id: string
    readonly beforeUrl: string
    readonly afterUrl: string
    readonly caption?: string
}

export interface ProjectClientConsent {
    readonly granted: boolean
    readonly acceptedAt: string
    readonly clientUid?: string
    readonly noticeVersion: 'V1.1'
}

export interface ProjectFirestoreDocument {
    readonly projectId: string
    readonly comercianteId: string
    readonly title: string
    readonly description: string
    readonly category: string
    readonly zone: string
    readonly beforeAfterPairs: BeforeAfterPair[]
    readonly galleryUrls: string[]
    readonly approxBudgetCop?: number
    readonly approxAreaM2?: number
    readonly contractId?: string
    readonly clientConsent: ProjectClientConsent
    readonly editorialStatus: 'draft' | 'pending' | 'approved'
    readonly isFeatured: boolean
    readonly tags: string[]
    readonly createdAt: string
    readonly updatedAt: string
}

export interface CreateProjectParams {
    readonly comercianteId: string
    readonly isAnnualMember: boolean
    readonly existingProjectsCount: number
    readonly data: Omit<ProjectFirestoreDocument, 'projectId' | 'createdAt' | 'updatedAt' | 'editorialStatus' | 'isFeatured'>
}

export const PROJECT_LIMITS = {
    FREE_TIER_MAX_PROJECTS: 2,
    MAX_BEFORE_AFTER_PAIRS_FREE: 0,
    MAX_BEFORE_AFTER_PAIRS_ANNUAL: 5,
    MAX_GALLERY_IMAGES: 10,
} as const

