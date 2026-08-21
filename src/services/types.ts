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
    label?: string | undefined
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

export interface UserLocationItem {
    id: string
    nombre?: string | undefined
    direccion: string
    ciudad: string
    codigoPostal?: string | undefined
    zona?: string | undefined
    lat?: number | undefined
    lng?: number | undefined
    isPrimary?: boolean | undefined
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
    userPhone?: string | undefined
    userJoined: string
    userChannelUrl: string
    userCreatedDrafts: string[]
    userCategories?: string[] | undefined
    userDirection?: string | undefined
    userDirectionDetails?: string | undefined
    userCiudad?: string | undefined
    userCodigoPostal?: string | undefined
    userTel?: string | undefined
    userImage?: string | undefined
    userRazonSocial?: string | undefined
    userContactName?: string | undefined
    userPhotoUrl?: string | undefined
    userProfession?: string | undefined
    userExperience?: string | undefined
    userDescription?: string | undefined
    userIdentificationType?: string | undefined
    userIdentification?: string | undefined
    userWebSite?: string | undefined
    userGalleryUrl?: string[] | undefined
    userLocations?: UserLocationItem[] | undefined
    userLikes?: {
        likedsProfiles: string[]
        likedsDrafts: string[]
    } | undefined
    savedDrafts?: string[] | undefined
    privacySettings?: PrivacySettings | undefined
    /** Zonas donde el comerciante presta servicio (array of zone slugs). */
    userZonasCobertura?: string[] | undefined
    /** Indica si el comerciante cubre toda el area metropolitana/ciudad. */
    coberturaTodaLaCiudad?: boolean | undefined
    /** Structured email contacts array. */
    emails?: ContactEmail[] | undefined
    /** Structured phone contacts array. */
    phones?: ContactPhone[] | undefined
    /** Social / communication links array. */
    socialLinks?: SocialLink[] | undefined
    /** Propietario properties array. */
    properties?: Property[] | undefined
    /** Premium listing tier for merchants. */
    profileTier?: 'free' | 'destacado' | undefined
    /** Phase 2: Active Lead Generation - Toggle for 'Available Now' status */
    isAvailableNow?: boolean | undefined
    /** Phase 2: Last active timestamp for tracking emergency capture */
    lastActive?: string | undefined
    /** FCM Tokens for push notifications */
    fcmTokens?: string[] | undefined
    /** Phase 3: Algorithmic trust score (0-100) computed from behavioral metrics */
    trustScore?: number | undefined
    /** Subscription and Certification fields */
    membershipStatus?: 'active' | 'inactive' | 'expired' | undefined
    membershipExpiresAt?: string | undefined
    earnedBadges?: Array<{ category: string; issuedAt: string; expiresAt?: string | undefined }> | undefined
    /** Referral Program fields */
    referralCode?: string | undefined
    referredBy?: string | null | undefined
    /** Ranking, Classification and Honor Grade fields */
    userCategorie?: string | undefined
    userClasification?: string | undefined
    userGrade?: string | undefined
    referralStats?: {
        totalInvited: number
        activeReferrals: number
        pointsBalance: number
        totalPointsEarned: number
    } | undefined
}


// =============================================================================
// Subscription & Certification Request Types
// =============================================================================

export interface InspectionRequest {
    requestId: string
    propietarioId: string
    propertyDetails: {
        name: string
        address: string
        city: string
        postalCode: string
    }
    serviceScope: string
    contactPhone: string
    contactEmail: string
    status: 'pending_schedule' | 'scheduled' | 'inspected' | 'cancelled'
    scheduledDate?: string
    scheduledTime?: string
    createdAt: string
    notes?: string
}

export interface CertificationRequest {
    requestId: string
    comercianteId: string
    category: string
    dateTime: string
    status: 'pending_payment' | 'pending' | 'scheduled' | 'evaluated' | 'approved' | 'rejected'
    paymentStatus: 'pending' | 'paid'
    paymentReference?: string
    notes?: string
    createdAt: string
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
    responseId?: string
    providerId: string
    authorName?: string
    authorRole?: 1 | 2
    authorPhotoUrl?: string
    answerText: string
    date: string
    isVerifiedProvider?: boolean
    upvotes?: number
}

export interface AsesoriaFirestoreDocument extends DocumentData {
    asesoriaId?: string
    id?: string
    asesoriaTitulo?: string
    asesoriaDescription?: string
    asesoriaSelect?: string
    asesoriaCategoria?: string
    asesoriaAuthorId?: string
    asesoriaAuthorName?: string
    asesoriaAuthorRole?: 1 | 2
    asesoriaAuthorPhotoUrl?: string
    asesoriaCreatedAt?: string
    asesoriaRespuestas?: AsesoriaResponse[]
    likesCount?: number
    viewsCount?: number
}

export interface AsesoriaData {
    newData: {
        asesoriaName: string
        asesoriaSelect: string
    }
    docId: string
}

// =============================================================================
// Blog Types
// =============================================================================

export interface BlogPost {
    id?: string
    slug: string
    title: string
    excerpt: string
    content: string
    coverImage: string
    category: 'Propietarios' | 'Comerciantes' | 'Casos de Éxito' | 'Noticias'
    targetAudience: 'propietario' | 'comerciante' | 'general'
    authorName: string
    authorRole: string
    authorAvatar?: string
    readTimeMinutes: number
    publishedAt: string
    status: 'published' | 'draft'
    featured?: boolean
    viewsCount?: number
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

// =============================================================================
// Payment Method Types
// =============================================================================

export interface PaymentMethodFirestoreDocument extends DocumentData {
    id: string
    userId: string
    type: 'card' | 'pse'
    isDefault: boolean
    createdAt: string
    
    // Card specific fields (Client-side tokenized via ePayco)
    token?: string
    brand?: 'Visa' | 'Mastercard' | 'American Express' | 'Diners' | 'Otro'
    last4?: string
    expMonth?: string
    expYear?: string
    cardholderName?: string
    
    // PSE specific fields (Preferred Bank & Billing info)
    bankCode?: string
    bankName?: string
    personType?: 'N' | 'J'
    
    // Tax/Identity details
    docType?: string
    docNumberMasked?: string
}

export type SavePaymentMethodParams = Omit<PaymentMethodFirestoreDocument, 'id' | 'createdAt'>

// =============================================================================
// Referral Program Types
// =============================================================================

export interface ReferralRecord extends DocumentData {
    referralId?: string
    referrerId: string
    referrerName: string
    referredUserId: string
    referredUserName: string
    referredUserRole: number
    refCodeUsed: string
    status: 'pending' | 'completed' | 'rewarded'
    pointsEarned: number
    createdAt: string
    completedAt?: string
}

export interface ReferralRedemption extends DocumentData {
    redemptionId?: string
    userId: string
    rewardId: 'discount_membership' | 'discount_certification' | 'featured_month'
    rewardName: string
    pointsSpent: number
    couponCode: string
    status: 'active' | 'used' | 'expired'
    createdAt: string
    usedAt?: string
}

// =============================================================================
// Notification Types
// =============================================================================

export type NotificationType =
    | 'system_announcement'
    | 'pending_action'
    | 'profile_favorite'
    | 'profile_comment'
    | 'quote_received'
    | 'contract_update'
    | 'referral_earned'

export interface NotificationDocument extends DocumentData {
    notificationId?: string
    recipientId: string // UID or 'ALL' for broadcasts
    recipientRole?: 1 | 2 // 1: Propietario, 2: Comerciante, undefined: Both
    type: NotificationType
    title: string
    body: string
    actionUrl?: string
    isRead: boolean
    createdAt: string
    metadata?: {
        actorId?: string
        actorName?: string
        actorPhotoUrl?: string
    }
}

export type { ServiceResponse } from '@/types/services.d'
