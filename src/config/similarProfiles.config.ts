/**
 * Similar Profiles Configuration (Pure Domain & Service Settings)
 *
 * Centralizes all weights, thresholds, limits, and copy tokens for the
 * «Profesionales similares, destacados y cercanos» section (Tarea 07).
 */

export interface SimilarProfilesWeights {
    /** Coincidence in specialty/category (up to 4 categories, extra weight to primary) */
    readonly trade: number
    /** Geographic proximity (municipio > departamento > nacional) */
    readonly proximity: number
    /** Objective quality & completeness signals (verified, badges, completeness, activity) */
    readonly quality: number
    /** Operational structure and property context compatibility (reusing fuzzyEngine) */
    readonly context: number
}

export interface ProximityTierScores {
    readonly municipio: number
    readonly departamento: number
    readonly nacional: number
}

export interface SimilarProfilesConfig {
    /** Feature toggle: remote/local master kill switch */
    readonly enabled: boolean
    /** Minimum results to render section; below this returns 'vacio' */
    readonly minResults: number
    /** Maximum results to display */
    readonly maxResults: number
    /** Hard cap on documents fetched from Firestore per request (Invariant I5) */
    readonly maxCandidatesFetched: number
    /** Maximum separate database queries permitted per request (Invariant I5) */
    readonly maxQueries: number
    /** Server cache TTL in seconds (15 minutes = 900s) */
    readonly cacheTtlSeconds: number
    /** IntersectionObserver rootMargin before reaching viewport */
    readonly viewportMargin: string
    /** Quality score threshold (0.0 - 1.0) required to display the 'Destacado' badge */
    readonly featuredQualityThreshold: number
    /** Enables R12: deterministic daily tie-breaking rotation */
    readonly dailyTieRotationEnabled: number
    /** Scoring weights (must sum to 1.0) */
    readonly weights: SimilarProfilesWeights
    /** Base scores per proximity tier */
    readonly proximityTierScores: ProximityTierScores
    /** Fallback default category name if profile has no categories */
    readonly fallbackCategoryName: string
    /** Labels in Colombian Spanish for recommendation reason tags (R13) */
    readonly reasonLabels: {
        readonly mismo_oficio: string
        readonly tu_zona: string
        readonly verificado: string
        readonly certificado: string
        readonly perfil_completo: string
        readonly activo_reciente: string
        readonly afin_a_tu_inmueble: string
    }
}

export const SIMILAR_PROFILES_CONFIG: SimilarProfilesConfig = {
    enabled: true,
    minResults: 2,
    maxResults: 6,
    maxCandidatesFetched: 40,
    maxQueries: 3,
    cacheTtlSeconds: 900, // 15 minutes
    viewportMargin: '250px',
    featuredQualityThreshold: 0.70,
    dailyTieRotationEnabled: 1,
    weights: {
        trade: 0.40,
        proximity: 0.30,
        quality: 0.20,
        context: 0.10,
    },
    proximityTierScores: {
        municipio: 1.00,
        departamento: 0.60,
        nacional: 0.25,
    },
    fallbackCategoryName: 'Servicios de Mantenimiento',
    reasonLabels: {
        mismo_oficio: 'Mismo oficio',
        tu_zona: 'En tu zona',
        verificado: 'Verificado',
        certificado: 'Certificado',
        perfil_completo: 'Perfil completo',
        activo_reciente: 'Activo reciente',
        afin_a_tu_inmueble: 'Ideal para tu inmueble',
    },
} as const

