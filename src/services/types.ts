/**
 * Service Types
 *
 * Shared TypeScript types for all service modules.
 */

import type { DocumentData } from 'firebase/firestore'

// =============================================================================
// User Types
// =============================================================================

export interface UserFirestoreDocument extends DocumentData {
    userId: string
    userName: string | null
    userMail: string | null
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
    userLikes?: {
        likedsProfiles: string[]
        likedsDrafts: string[]
    }
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
    draftCategory?: string
    draftSubCategory?: string
    draftDescription?: string
    draftDirection?: string
    draftCity?: string
    draftPostalCode?: string
    draftPropietarioResidente?: string
    draftCreatedAt?: string
    draftImages?: string[]
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

export interface AsesoriaData {
    newData: {
        asesoriaName: string
        asesoriaSelect: string
    }
    docId: string
}
