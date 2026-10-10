/**
 * Fuzzy Compatibility Engine
 *
 * Deterministic, pure domain matching engine implementing:
 * 1. Base membership evaluation from 20-pair matrix mu_base(structure, propertyType)
 * 2. Formality refinement (category formality vs property formality expectations)
 * 3. Geographic proximity signal refinement (zone matching / metro coverage)
 * 4. Threshold-based defuzzification: 'mostrar' | 'degradar' | 'ocultar'
 * 5. Full explanation payload and compliance with invariants I1-I7.
 */

import {
    type PropertyTypeId,
    type MerchantStructureId,
    type FormalityLevel,
    type MatchDecision,
    type AffinityBand,
    FUZZY_BASE_MATRIX,
    MATCH_CONFIG,
    isCorePair,
    normalizePropertyType,
    normalizeMerchantStructure,
    PROPERTY_TYPE_METADATA,
    MERCHANT_STRUCTURE_METADATA,
} from '@config/matching.config'

export type ZoneSignalType = 'same_zone' | 'citywide_coverage' | 'other_zone' | 'no_zone_specified'

export interface FuzzyMatchInput {
    /** Target property type (Hogar, Negocio, PH, etc.) or unknown */
    propertyType: PropertyTypeId | string | null | undefined
    /** Merchant operational structure (Persona Natural, Microempresa, PyME, Empresa) or unassigned */
    merchantStructure: MerchantStructureId | string | null | undefined
    /** Category formality level or category key */
    categoryFormality?: FormalityLevel | number | undefined
    /** Geographic proximity signal */
    zoneSignal?: ZoneSignalType | undefined
}

export interface FuzzyMatchResult {
    /** Normalized property type used in calculation (or null if unknown) */
    resolvedPropertyType: PropertyTypeId | null
    /** Normalized merchant structure used in calculation (or null if unassigned) */
    resolvedMerchantStructure: MerchantStructureId | null
    /** Raw base score from the 20-pair matrix in [0.00, 1.00] */
    baseScore: number
    /** Final adjusted score after refinements in [0.00, 1.00] */
    score: number
    /** Categorical decision based on default thresholds */
    decision: MatchDecision
    /** Affinity band */
    band: AffinityBand
    /** Whether this pair belongs to the 9-pair hard core (núcleo duro) */
    isCore: boolean
    /** Technical identifiers of rules triggered */
    rulesApplied: string[]
    /** User-facing explanation in Colombian Spanish */
    explanation: string
    /** Short badge title (e.g. 'Ideal para tu inmueble') */
    badgeText: string | null
}

/**
 * Rounds a floating point score to 2 decimal places to prevent IEEE 754 precision drift.
 */
function roundScore(val: number): number {
    return Math.round(val * 100) / 100
}

/**
 * Clamps score into [min, max] range.
 */
function clamp(val: number, min = 0.0, max = 1.0): number {
    if (Number.isNaN(val)) return MATCH_CONFIG.neutralScore
    return Math.max(min, Math.min(max, val))
}

/**
 * Computes affinity band from score.
 */
export function getAffinityBand(score: number): AffinityBand {
    if (score >= MATCH_CONFIG.bands.alta) return 'alta'
    if (score >= MATCH_CONFIG.bands.media) return 'media'
    if (score >= MATCH_CONFIG.bands.baja) return 'baja'
    return 'nula'
}

/**
 * Computes match decision from score according to default thresholds.
 */
export function getMatchDecision(score: number): MatchDecision {
    if (score >= MATCH_CONFIG.thresholds.mostrar) return 'mostrar'
    if (score >= MATCH_CONFIG.thresholds.degradar) return 'degradar'
    return 'ocultar'
}

/**
 * Core fuzzy compatibility evaluation function.
 * Pure, deterministic, no I/O, satisfies Invariants I1 through I7.
 */
export function evaluateFuzzyMatch(input: FuzzyMatchInput): FuzzyMatchResult {
    const rulesApplied: string[] = []

    const propId = normalizePropertyType(input.propertyType)
    const structId = normalizeMerchantStructure(input.merchantStructure)

    // Invariant I5: Unknown data handling (either property or structure missing)
    if (!propId || !structId) {
        rulesApplied.push('RULE_UNKNOWN_DATA_NEUTRAL')
        const score = MATCH_CONFIG.neutralScore
        const decision: MatchDecision = 'mostrar'
        const band: AffinityBand = 'media'

        const explanation = !structId && !propId
            ? 'Mostrando perfil en términos estándar (clasificación de comerciante e inmueble sin especificar).'
            : !structId
              ? 'Mostrando perfil (el comerciante aún no tiene clasificación operativa asignada por el Administrador).'
              : 'Mostrando requerimiento (tipo de inmueble sin especificar por el solicitante).'

        return {
            resolvedPropertyType: propId,
            resolvedMerchantStructure: structId,
            baseScore: score,
            score,
            decision,
            band,
            isCore: false,
            rulesApplied,
            explanation,
            badgeText: null,
        }
    }

    // 1. Base Score from Matrix
    rulesApplied.push(`RULE_BASE_MATRIX_${structId.toUpperCase()}_x_${propId.toUpperCase()}`)
    const baseScore = FUZZY_BASE_MATRIX[structId][propId]
    const isCore = isCorePair(structId, propId)

    if (isCore) {
        rulesApplied.push('RULE_CORE_HARD_PAIR')
    }

    let adjustedScore = baseScore

    // 2. Formality Refinement
    // When property expects high formality (PH, Inmobiliaria, Aliado), category is high formality,
    // and merchant is persona natural, apply a downward penalty to fine-tune intra-band ordering.
    const formality: FormalityLevel =
        typeof input.categoryFormality === 'string'
            ? input.categoryFormality
            : 'media'

    const propMeta = PROPERTY_TYPE_METADATA[propId]
    if (propMeta.highFormalityExpected && formality === 'alta' && structId === 'persona_natural') {
        rulesApplied.push('RULE_FORMALITY_PENALTY_PERSONA_NATURAL_HIGH_FORMALITY')
        // Invariant I3 Guard: Refinement must NEVER push a core pair out of 'mostrar'
        // or elevate a non-core pair into 'mostrar'.
        const penalty = MATCH_CONFIG.refinementWeights.maxFormalityPenalty
        adjustedScore = Math.max(0.0, adjustedScore - penalty)
    }

    // 3. Geographic Zone Signal Refinement
    // Zone signal provides a small intra-band prioritization boost if same zone or citywide.
    // Invariant I4 Guard: Zone signal MUST NEVER change the visibility decision!
    const zoneSignal = input.zoneSignal ?? 'no_zone_specified'
    if (zoneSignal === 'same_zone') {
        rulesApplied.push('RULE_ZONE_BOOST_SAME_ZONE')
        adjustedScore += MATCH_CONFIG.refinementWeights.maxZonePriorityBoost
    } else if (zoneSignal === 'citywide_coverage') {
        rulesApplied.push('RULE_ZONE_BOOST_CITYWIDE')
        adjustedScore += MATCH_CONFIG.refinementWeights.maxZonePriorityBoost * 0.6
    }

    // Invariant I1: Clamping to [0.0, 1.0] and rounding
    adjustedScore = roundScore(clamp(adjustedScore, 0.0, 1.0))

    // Invariant I3 Strict Guard Enforcement:
    // If it is a core pair, it MUST remain >= 0.50 ('mostrar')
    if (isCore && adjustedScore < MATCH_CONFIG.thresholds.mostrar) {
        adjustedScore = MATCH_CONFIG.thresholds.mostrar
    }
    // If it is NOT a core pair, it MUST NOT exceed 0.49 if baseScore was < 0.50
    if (!isCore && baseScore < MATCH_CONFIG.thresholds.mostrar && adjustedScore >= MATCH_CONFIG.thresholds.mostrar) {
        adjustedScore = MATCH_CONFIG.thresholds.mostrar - 0.01
    }

    // Invariant I4 Strict Guard Enforcement:
    // Base decision determines the visibility group ('mostrar' vs 'degradar' vs 'ocultar').
    const baseDecision = getMatchDecision(baseScore)
    let decision = getMatchDecision(adjustedScore)

    // If zone adjustment attempted to cross a threshold boundary, pin to base decision boundary
    if (decision !== baseDecision) {
        rulesApplied.push('RULE_INVARIANT_I4_ZONE_VISIBILITY_PRESERVED')
        if (baseDecision === 'mostrar' && adjustedScore < MATCH_CONFIG.thresholds.mostrar) {
            adjustedScore = MATCH_CONFIG.thresholds.mostrar
        } else if (baseDecision === 'degradar') {
            adjustedScore = clamp(adjustedScore, MATCH_CONFIG.thresholds.degradar, MATCH_CONFIG.thresholds.mostrar - 0.01)
        } else if (baseDecision === 'ocultar' && adjustedScore >= MATCH_CONFIG.thresholds.degradar) {
            adjustedScore = MATCH_CONFIG.thresholds.degradar - 0.01
        }
        decision = baseDecision
    }

    const band = getAffinityBand(adjustedScore)

    // Build explanatory text (es-CO)
    const structMeta = MERCHANT_STRUCTURE_METADATA[structId]
    let explanation: string
    let badgeText: string | null = null

    if (decision === 'mostrar') {
        if (band === 'alta') {
            badgeText = 'Ideal para tu inmueble'
            explanation = `Mostrando prioritariamente a profesionales con estructura de ${structMeta.label}, altamente afin con proyectos en ${propMeta.label}.`
        } else {
            explanation = `Mostrando perfiles con capacidad adecuada para atender trabajos en ${propMeta.label}.`
        }
    } else if (decision === 'degradar') {
        explanation = `Los perfiles de ${structMeta.label} suelen atender proyectos de otra escala, pero pueden prestar servicio si se ajustan a los requerimientos de tu proyecto.`
    } else {
        explanation = `Por estructura operativa y requerimientos usuales de ${propMeta.label}, estos perfiles quedan en segundo plano para evitar sobrecostos o incompatibilidad.`
    }

    return {
        resolvedPropertyType: propId,
        resolvedMerchantStructure: structId,
        baseScore,
        score: adjustedScore,
        decision,
        band,
        isCore,
        rulesApplied,
        explanation,
        badgeText,
    }
}

/* =============================================================================
   6. SERVER & QUERY ADAPTER COMPATIBILITY HELPERS (R9)
   ============================================================================= */

/**
 * Returns canonical merchant structures that yield a given decision (default: 'mostrar')
 * for a specific property type. Used directly in Firestore `where('userClasification', 'in', ...)` queries.
 */
export function getCompatibleStructuresForProperty(
    propertyType: PropertyTypeId,
    targetDecision: MatchDecision = 'mostrar'
): MerchantStructureId[] {
    const structures: MerchantStructureId[] = ['persona_natural', 'micro_empresa', 'pyme_servicios', 'empresa']
    return structures.filter((s) => {
        const result = evaluateFuzzyMatch({ propertyType, merchantStructure: s })
        return result.decision === targetDecision
    })
}

/**
 * Returns canonical property types that yield a given decision (default: 'mostrar')
 * for a merchant structure. Used in `directorio-requerimientos` queries.
 */
export function getCompatiblePropertiesForStructure(
    structure: MerchantStructureId,
    targetDecision: MatchDecision = 'mostrar'
): PropertyTypeId[] {
    const properties: PropertyTypeId[] = [
        'hogar',
        'negocio',
        'propiedad_horizontal',
        'inmobiliaria',
        'aliado_estrategico',
    ]
    return properties.filter((p) => {
        const result = evaluateFuzzyMatch({ propertyType: p, merchantStructure: structure })
        return result.decision === targetDecision
    })
}
