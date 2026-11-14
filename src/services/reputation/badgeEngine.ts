/**
 * Reputation & Badge Engine
 *
 * Evaluates and awards verifiable operational badges based on real platform events:
 * - Timely delivery (Puntualidad Certificada)
 * - Zero disputes (Cero Disputas)
 * - Verified identity (Identidad Verificada)
 * - Trade specialist (Especialista en Oficio)
 * - Active Annual Membership (Miembro Destacado Dezzpo - Monetization Hook)
 *
 * @module badgeEngine
 */

export type BadgeId =
    | 'puntualidad'
    | 'cero_disputas'
    | 'identidad_verificada'
    | 'especialista'
    | 'miembro_destacado'

export interface BadgeDefinition {
    readonly id: BadgeId
    readonly title: string
    readonly subtitle: string
    readonly description: string
    readonly iconName: string
    readonly color: string
    readonly bgLight: string
    readonly borderColor: string
    readonly priority: number
}

export interface EarnedBadge {
    readonly id: BadgeId
    readonly title: string
    readonly subtitle: string
    readonly description: string
    readonly awardedAt: string
    readonly color: string
    readonly bgLight: string
    readonly borderColor: string
    readonly metadata?: Record<string, unknown>
}

export const BADGE_CATALOG: Record<BadgeId, BadgeDefinition> = {
    identidad_verificada: {
        id: 'identidad_verificada',
        title: 'Identidad Verificada',
        subtitle: 'Documentos Auditados',
        description: 'Identidad, RUT y antecedentes contrastados satisfactoriamente por el equipo de moderación de Dezzpo.',
        iconName: 'VerifiedUser',
        color: '#0d9488',
        bgLight: '#f0fdfa',
        borderColor: '#ccfbf1',
        priority: 1,
    },
    cero_disputas: {
        id: 'cero_disputas',
        title: 'Cero Disputas',
        subtitle: 'Trato Confiable',
        description: 'Historial impecable de acuerdos finalizados con cero reclamaciones o arbitrajes.',
        iconName: 'Gavel',
        color: '#0284c7',
        bgLight: '#f0f9ff',
        borderColor: '#bae6fd',
        priority: 2,
    },
    puntualidad: {
        id: 'puntualidad',
        title: 'Puntualidad Certificada',
        subtitle: 'Entregas a Tiempo',
        description: 'Más del 90% de los proyectos culminados en o antes de la fecha estimada pactada en el contrato.',
        iconName: 'Schedule',
        color: '#059669',
        bgLight: '#ecfdf5',
        borderColor: '#a7f3d0',
        priority: 3,
    },
    especialista: {
        id: 'especialista',
        title: 'Especialista Calificado',
        subtitle: 'Maestría Técnica',
        description: 'Certificación técnica por competencias aprobada o múltiples proyectos valorados con 5 estrellas.',
        iconName: 'WorkspacePremium',
        color: '#7c3aed',
        bgLight: '#f5f3ff',
        borderColor: '#ddd6fe',
        priority: 4,
    },
    miembro_destacado: {
        id: 'miembro_destacado',
        title: 'Miembro Destacado',
        subtitle: 'Suscripción Activa',
        description: 'Profesional con membresía anual vigente, garantía de visibilidad preferencial y portafolio ampliado.',
        iconName: 'Star',
        color: '#d97706',
        bgLight: '#fffbeb',
        borderColor: '#fde68a',
        priority: 5,
    },
}

export interface ContractPerformanceMetrics {
    readonly totalCompletedContracts: number
    readonly onTimeCompletedContracts: number
    readonly disputedContractsCount: number
    readonly averageReviewRating?: number
    readonly hasVerifiedIdentity: boolean
    readonly hasTechnicalCertification: boolean
    readonly isAnnualMember: boolean
}

/**
 * Pure evaluator that deterministically calculates which badges a merchant qualifies for.
 */
export function evaluateComercianteBadges(
    metrics: ContractPerformanceMetrics,
    nowIso: string = new Date().toISOString()
): EarnedBadge[] {
    const badges: EarnedBadge[] = []

    // 1. Identidad Verificada
    if (metrics.hasVerifiedIdentity) {
        badges.push(buildEarnedBadge('identidad_verificada', nowIso))
    }

    // 2. Miembro Destacado (Monetization Hook)
    if (metrics.isAnnualMember) {
        badges.push(buildEarnedBadge('miembro_destacado', nowIso))
    }

    // 3. Cero Disputas (minimum 3 completed contracts without any disputes)
    if (metrics.totalCompletedContracts >= 3 && metrics.disputedContractsCount === 0) {
        badges.push(
            buildEarnedBadge('cero_disputas', nowIso, {
                completedContracts: metrics.totalCompletedContracts,
            })
        )
    }

    // 4. Puntualidad Certificada (at least 3 completed, >= 90% on time)
    if (metrics.totalCompletedContracts >= 3) {
        const onTimeRatio = metrics.onTimeCompletedContracts / metrics.totalCompletedContracts
        if (onTimeRatio >= 0.9) {
            badges.push(
                buildEarnedBadge('puntualidad', nowIso, {
                    onTimeRatio: Number(onTimeRatio.toFixed(2)),
                })
            )
        }
    }

    // 5. Especialista Calificado (certification approved OR average rating >= 4.7 with at least 3 reviews)
    if (
        metrics.hasTechnicalCertification ||
        ((metrics.averageReviewRating ?? 0) >= 4.7 && metrics.totalCompletedContracts >= 3)
    ) {
        badges.push(
            buildEarnedBadge('especialista', nowIso, {
                certified: metrics.hasTechnicalCertification,
                rating: metrics.averageReviewRating,
            })
        )
    }

    // Sort by display priority
    return badges.sort((a, b) => {
        const pA = BADGE_CATALOG[a.id]?.priority ?? 99
        const pB = BADGE_CATALOG[b.id]?.priority ?? 99
        return pA - pB
    })
}

function buildEarnedBadge(
    id: BadgeId,
    awardedAt: string,
    metadata?: Record<string, unknown>
): EarnedBadge {
    const def = BADGE_CATALOG[id]
    return {
        id,
        title: def.title,
        subtitle: def.subtitle,
        description: def.description,
        awardedAt,
        color: def.color,
        bgLight: def.bgLight,
        borderColor: def.borderColor,
        ...(metadata ? { metadata } : {}),
    }
}

