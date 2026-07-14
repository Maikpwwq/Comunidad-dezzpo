/**
 * Service Types
 *
 * Shared TypeScript types for all service modules.
 */

import type { DocumentData } from 'firebase/firestore'

// =============================================================================
// Contact Types
// =============================================================================

/**
 * Structured email contact entry.
 * Replaces the legacy flat `userMail` string.
 */
export interface ContactEmail {
    address: string
    isPrimary: boolean
    verified: boolean
}

/**
 * Structured phone contact entry.
 * Replaces the legacy flat `userPhone` string.
 */
export interface ContactPhone {
    number: string
    isPrimary: boolean
    type: 'personal' | 'trabajo'
}

// =============================================================================
// Social Link Types
// =============================================================================

/**
 * Supported social & communication platforms.
 */
export type SocialPlatform =
    | 'WhatsApp'
    | 'Instagram'
    | 'LinkedIn'
    | 'Facebook'
    | 'TikTok'
    | 'Web'
    | 'X'

/**
 * Social link entry stored as a Firestore map array.
 */
export interface SocialLink {
    id: string
    platform: SocialPlatform
    url: string
    label?: string
    isVisible: boolean
    priority: number
}

// =============================================================================
// Property Types
// =============================================================================

export interface Property {
    id: string
    name: string
    address: string
    city: string
    postalCode: string
    isMain: boolean
}

// =============================================================================
// User Types
// =============================================================================

export interface PrivacySettings {
    showPhone: boolean
    showEmail: boolean
    allowMarketing: boolean
}

export interface UserFirestoreDocument extends DocumentData {
    userId: string
    userName: string | null
    userMail: string | null
    userPhone?: string
    userJoined: string
    userChannelUrl: string
    userCreatedDrafts: string[]
    userCategories?: string[]
    userDirection?: string
    userCiudad?: string
    userCodigoPostal?: string
    userTel?: string
    userImage?: string
    userRazonSocial?: string
    userPhotoUrl?: string
    userProfession?: string
    userExperience?: string
    userDescription?: string
    userIdentification?: string
    userWebSite?: string
    userGalleryUrl?: string[]
    userLikes?: {
        likedsProfiles: string[]
        likedsDrafts: string[]
    }
    savedDrafts?: string[]
    privacySettings?: PrivacySettings
    /** Zonas donde el comerciante presta servicio (array of zone slugs). */
    userZonasCobertura?: string[]
    /** Indica si el comerciante cubre toda el area metropolitana/ciudad. */
    coberturaTodaLaCiudad?: boolean
    /** Structured email contacts array. */
    emails?: ContactEmail[]
    /** Structured phone contacts array. */
    phones?: ContactPhone[]
    /** Social / communication links array. */
    socialLinks?: SocialLink[]
    /** Propietario properties array. */
    properties?: Property[]
    /** Premium listing tier for merchants. */
    profileTier?: 'free' | 'destacado'
    /** Phase 2: Active Lead Generation - Toggle for 'Available Now' status */
    isAvailableNow?: boolean
    /** Phase 2: Last active timestamp for tracking emergency capture */
    lastActive?: string
    /** FCM Tokens for push notifications */
    fcmTokens?: string[]
    /** Phase 3: Algorithmic trust score (0-100) computed from behavioral metrics */
    trustScore?: number
}

export type UserRole = 1 | 2 // 1 = Propietario, 2 = Comerciante

export interface ReadUserParams {
    userId: string
    role: UserRole
}

export interface UpdateUserParams {
    userId: string
    role: UserRole
    data: Partial<UserFirestoreDocument>
}

// =============================================================================
// Draft Types
// =============================================================================

export interface DraftFirestoreDocument extends DocumentData {
    draftId: string
    draftName?: string
    draftTotal?: number
    draftCategory?: string
    draftSubCategory?: string
    draftDescription?: string
    draftDirection?: string
    draftCity?: string
    draftPostalCode?: string
    draftPropietarioResidente?: string
    draftCreatedAt?: string
    draftImages?: string[]
    draftApply?: string[]
    status?: 'open' | 'closed'
    channel_url?: string
}

export interface ReadDraftParams {
    draftId: string
}

export interface UpdateDraftParams {
    draftId: string
    data: Partial<DraftFirestoreDocument>
}

// =============================================================================
// Quotation Types
// =============================================================================

export interface QuotationFirestoreDocument extends DocumentData {
    quotationId: string
    quotationDraftId: string
    quotationComercianteId?: string
    quotationPrice?: number
    quotationDescription?: string
    quotationCreatedAt?: string
    quotationStatus?: 'pending' | 'accepted' | 'rejected'
    viewedAt?: string
    requireDeposit?: boolean
    depositAmount?: number
}

export interface ReadQuotationParams {
    quotationId: string
}

export interface UpdateQuotationParams {
    quotationId: string
    data: Partial<QuotationFirestoreDocument>
}

// =============================================================================
// Search Types
// =============================================================================

export interface SearchParams {
    query: string
    categories?: string[]
    limit?: number
}

export interface SearchResult {
    users: UserFirestoreDocument[]
    total: number
}

// =============================================================================
// Asesoria Types
// =============================================================================

export interface AsesoriaResponse {
    providerId: string
    answerText: string
    date: string
}

export interface AsesoriaFirestoreDocument extends DocumentData {
    asesoriaId?: string
    asesoriaTitulo?: string
    asesoriaDescription?: string
    asesoriaSelect?: string
    asesoriaCategoria?: string
    asesoriaRespuestas?: AsesoriaResponse[]
}

export interface AsesoriaData {
    newData: {
        asesoriaName: string
        asesoriaSelect: string
    }
    docId: string
}

// =============================================================================
// Contract Types
// =============================================================================

export interface ContractFirestoreDocument extends DocumentData {
    contractId?: string
    draftId: string
    clientId: string
    providerId: string
    quotationId: string
    status: 'pending_payment' | 'active' | 'completed' | 'disputed'
    createdAt: string
    agreedAmount: number
    objectDescription?: string
    rated?: boolean
    channel_url?: string
    platformFeePercent?: number
    platformFeeAmount?: number
    comerciantePayoutAmount?: number
    paymentMethod?: 'epayco' | 'external'
    paymentStage?: 'full_payment' | 'deposit' | 'balance'
    depositAmount?: number
}

export interface CreateContractParams {
    data: Omit<ContractFirestoreDocument, 'contractId'>
}

export interface UpdateContractParams {
    contractId: string
    data: Partial<ContractFirestoreDocument>
}
