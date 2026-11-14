/**
 * Similar Profiles Domain Contracts (Pure Types)
 *
 * All types are immutable (readonly) and strictly typed without `any`.
 */

export type ProximityTier = 'municipio' | 'departamento' | 'nacional'

export type ZoneSource = 'busqueda' | 'visitante' | 'perfil_visitado'

export type RecommendationReason =
    | 'mismo_oficio'
    | 'tu_zona'
    | 'verificado'
    | 'certificado'
    | 'perfil_completo'
    | 'activo_reciente'
    | 'afin_a_tu_inmueble'

export interface CandidateLocation {
    readonly ciudad?: string | null | undefined
    readonly direction?: string | null | undefined
    readonly departamento?: string | null | undefined
    readonly codigoPostal?: string | null | undefined
    readonly zonasCobertura?: readonly string[] | undefined
    readonly coberturaTodaLaCiudad?: boolean | undefined
}

export interface CandidateProfile {
    readonly userId: string
    readonly userName?: string | null | undefined
    readonly userRazonSocial?: string | null | undefined
    readonly userContactName?: string | null | undefined
    readonly userProfession?: string | null | undefined
    readonly userDescription?: string | null | undefined
    readonly userExperience?: string | null | undefined
    readonly userPhotoUrl?: string | null | undefined
    readonly userJoined?: string | null | undefined
    readonly userCategories?: readonly string[] | undefined
    readonly userClasification?: string | null | undefined
    readonly userCiudad?: string | null | undefined
    readonly userDirection?: string | null | undefined
    readonly userDepartamento?: string | null | undefined
    readonly userCodigoPostal?: string | null | undefined
    readonly userZonasCobertura?: readonly string[] | undefined
    readonly coberturaTodaLaCiudad?: boolean | undefined
    readonly userGrade?: string | null | undefined
    readonly profileTier?: 'free' | 'destacado' | null | undefined
    readonly isAvailableNow?: boolean | undefined
    readonly lastActive?: string | null | undefined
    readonly trustScore?: number | null | undefined
    readonly earnedBadges?: ReadonlyArray<{ category: string; issuedAt: string; expiresAt?: string | undefined }> | undefined
    readonly favoritesCount?: number | null | undefined
    readonly status?: string | null | undefined
    readonly isDeleted?: boolean | undefined
    readonly userSelectedRol?: number | undefined
    readonly privacySettings?: {
        readonly showPhone?: boolean | undefined
        readonly showEmail?: boolean | undefined
        readonly isPrivateProfile?: boolean | undefined
    } | undefined
}

export interface SimilarProfileItem {
    readonly profileId: string
    readonly displayName: string
    readonly userRazonSocial?: string | undefined
    readonly userProfession?: string | undefined
    readonly userDescription?: string | undefined
    readonly userExperience?: string | undefined
    readonly userPhotoUrl?: string | undefined
    readonly userJoined?: string | undefined
    readonly userCategories: readonly string[]
    readonly userClasification?: string | undefined
    readonly userDirection?: string | undefined
    readonly favoritesCount?: number | undefined
    readonly tier: ProximityTier
    readonly score: number
    readonly reasons: readonly RecommendationReason[]
    readonly reasonLabels: readonly string[]
    readonly featured: boolean
    readonly compatibilityBadge?: string | null | undefined
    readonly compatibilityExplanation?: string | null | undefined
}

export interface SimilarProfilesBasis {
    readonly categoryName: string
    readonly zoneName: string | null
    readonly zoneSource: ZoneSource | null
    readonly farthestTier: ProximityTier | null
}

export interface SimilarProfilesData {
    readonly items: readonly SimilarProfileItem[]
    readonly basis: SimilarProfilesBasis
    readonly generatedAt: string
}

export type SimilarProfilesOutcome =
    | { readonly status: 'ok'; readonly data: SimilarProfilesData }
    | { readonly status: 'vacio' }
    | { readonly status: 'error'; readonly code: 'no_disponible' | 'limite' | 'no_autorizado' }

export interface SimilarProfilesRequest {
    readonly profileId: string
    readonly zone?: string | null | undefined
    readonly municipioCode?: string | null | undefined
    readonly propertyType?: string | null | undefined
    readonly visitorId?: string | null | undefined
    readonly visitorZone?: string | null | undefined
}

