/**
 * Service Type Definitions
 *
 * Core type system for all services following the ServiceResponse<T> pattern.
 * This file centralizes request/response types for type-safe service calls.
 */

import type { User } from 'firebase/auth'

// =============================================================================
// Service Response Wrapper - Discriminated Union Pattern
// =============================================================================

/**
 * Standardized Error codes for the Dezzpo ecosystem.
 */
export type ServiceErrorCode = 
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_NETWORK_ERROR'
  | 'FIRESTORE_PERMISSION_DENIED'
  | 'FIRESTORE_NOT_FOUND'
  | 'SENDBIRD_CHANNEL_ERROR'
  | 'INTERNAL_ERROR';

export interface ServiceErrorInfo {
  code: ServiceErrorCode;
  message: string;
  details?: unknown;
}

/**
 * Discriminated Union for Service Responses.
 * Pattern: Check 'success' property before accessing 'data'.
 */
export type ServiceResponse<T> = 
  | {
      success: true;
      data: T;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: ServiceErrorInfo;
    };

/**
 * Example of a strictly typed Service Method
 */
// export type GetProfileResponse = Promise<ServiceResponse<UserProfile>>;


// =============================================================================
// Firebase Auth Types
// =============================================================================

export interface EmailCredentials {
    email: string
    password: string
}

export interface RegisterCredentials extends EmailCredentials {
    displayName?: string
}

export interface AuthUser {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    emailVerified: boolean
}

export type AuthCallback = (user: AuthUser | null) => void
export type Unsubscribe = () => void

// =============================================================================
// Sendbird Types
// =============================================================================

export interface CreateChannelParams {
    channelName: string
    userIds: string[]
    operatorIds?: string[]
    customType?: string
    data?: string
}

export interface ChannelResponse {
    channelUrl: string
    name: string
    createdAt: number
    memberCount: number
}

export interface SendbirdConfig {
    appId: string
    userId: string
    nickname?: string
    accessToken?: string
}

// =============================================================================
// Firestore Document Types (extended from services/types.ts)
// =============================================================================

export interface UserFirestoreDocument {
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
}

export interface DraftFirestoreDocument {
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

export interface QuotationFirestoreDocument {
    quotationId: string
    quotationDraftId: string
    quotationComercianteId?: string
    quotationPrice?: number
    quotationDescription?: string
    quotationCreatedAt?: string
    quotationStatus?: 'pending' | 'accepted' | 'rejected'
}

// =============================================================================
// Service Parameter Types
// =============================================================================

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

export interface ReadDraftParams {
    draftId: string
}

export interface UpdateDraftParams {
    draftId: string
    data: Partial<DraftFirestoreDocument>
}

export interface ReadQuotationParams {
    quotationId: string
}

export interface UpdateQuotationParams {
    quotationId: string
    data: Partial<QuotationFirestoreDocument>
}

export interface SearchParams {
    query: string
    categories?: string[]
    limit?: number
}

export interface SearchResult {
    users: UserFirestoreDocument[]
    total: number
}
