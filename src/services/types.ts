/**
 * Service Types
 *
 * Shared TypeScript types for all service modules.
 */

import type { DocumentData } from 'firebase/firestore'

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
    status: 'active' | 'completed' | 'disputed'
    createdAt: string
    agreedAmount: number
    rated?: boolean
}

export interface CreateContractParams {
    data: Omit<ContractFirestoreDocument, 'contractId'>
}

export interface UpdateContractParams {
    contractId: string
    data: Partial<ContractFirestoreDocument>
}
