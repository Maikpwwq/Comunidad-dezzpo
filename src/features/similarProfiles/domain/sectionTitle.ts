/**
 * Section Title & Subtitle Generator (Pure Domain Function)
 *
 * Implements Invariant I7 & §6:
 * - Honest title generation reflecting the real zone source and tier used
 * - Never claims «cerca de ti» unless visitor/search location resolved to 'municipio'
 * - Never claims «destacados» unless real quality signals were verified
 * - Category names treated as services («Plomería», «Pintura»), never pluralized as professions
 * - Subtitle communicates transparently in Colombian Spanish without jargon
 */

import { SIMILAR_PROFILES_CONFIG } from '@config/similarProfiles.config'
import type { SimilarProfilesData } from './types'

export interface SectionTitleResult {
    readonly title: string
    readonly subtitle: string
}

/**
 * Derives the honest section title and subtitle based purely on the data payload.
 */
export function sectionTitle(data: SimilarProfilesData): SectionTitleResult {
    const defaultSubtitle = 'Según el oficio y la zona de este perfil.'

    if (!data || !data.basis) {
        return {
            title: 'Profesionales similares',
            subtitle: defaultSubtitle,
        }
    }

    const { categoryName, zoneName, zoneSource, farthestTier } = data.basis
    const cleanCategory = (categoryName && categoryName.trim()) || SIMILAR_PROFILES_CONFIG.fallbackCategoryName
    const hasQualitySignals = data.items.some((item) => item.featured)

    // 1. Invariant I7: «cerca de ti» ONLY if zoneSource is 'busqueda' or 'visitante' AND farthestTier is 'municipio'
    if (
        (zoneSource === 'busqueda' || zoneSource === 'visitante') &&
        farthestTier === 'municipio'
    ) {
        return {
            title: `Más profesionales de ${cleanCategory} cerca de ti`,
            subtitle: defaultSubtitle,
        }
    }

    // 2. Zone of visited profile: «en {municipio}»
    if (zoneSource === 'perfil_visitado' && zoneName && zoneName.trim()) {
        const cleanZone = zoneName.trim()
        return {
            title: `Más profesionales de ${cleanCategory} en ${cleanZone}`,
            subtitle: defaultSubtitle,
        }
    }

    // 3. Fallback when tier is departamento, nacional, or no zone
    if (hasQualitySignals) {
        return {
            title: `Profesionales destacados de ${cleanCategory}`,
            subtitle: defaultSubtitle,
        }
    }

    return {
        title: `Profesionales similares de ${cleanCategory}`,
        subtitle: defaultSubtitle,
    }
}

