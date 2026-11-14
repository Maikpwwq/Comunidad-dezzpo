/**
 * Inspiration Editorial Service (T-I1.1)
 *
 * Curates approved contractor projects into thematic collections
 * and prepares structured inspiration articles for SEO and discovery.
 */

import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { ProjectFirestoreDocument } from '@services/projects'
import type { ServiceResponse } from '@/types/services.d'

const PROJECTS_COLLECTION = 'projects'

export interface CuratedInspirationCollection {
    readonly themeSlug: string
    readonly title: string
    readonly subtitle: string
    readonly category: string
    readonly zone: string
    readonly projectCount: number
    readonly projects: ProjectFirestoreDocument[]
    readonly seoKeywords: string[]
    readonly summaryText: string
}

export interface EditorialFilterParams {
    readonly category?: string
    readonly zone?: string
    readonly limitCount?: number
}

/**
 * Generates an SEO-optimized title for an inspiration collection.
 */
export function buildInspirationThemeTitle(category: string, zone?: string): string {
    const zoneLabel = zone && zone !== 'bogota' && zone !== 'otra-zona'
        ? `en ${zone.charAt(0).toUpperCase() + zone.slice(1)}`
        : 'en Bogotá'
    return `Inspiración y Proyectos Reales de ${category} ${zoneLabel}`
}

/**
 * Fetches approved or active projects filtered by category and zone for inspiration books.
 */
export async function getCuratedInspirationProjects(
    params: EditorialFilterParams = {}
): Promise<ServiceResponse<ProjectFirestoreDocument[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const colRef = collection(firestore, PROJECTS_COLLECTION)
        const constraints = []

        if (params.category) {
            constraints.push(where('category', '==', params.category))
        }

        if (params.zone && params.zone !== 'bogota') {
            constraints.push(where('zone', '==', params.zone))
        }

        constraints.push(orderBy('createdAt', 'desc'))

        if (params.limitCount && params.limitCount > 0) {
            constraints.push(firestoreLimit(params.limitCount))
        }

        const q = query(colRef, ...constraints)
        const snap = await getDocs(q)
        const projects = snap.docs.map(
            (d) => ({ ...d.data(), projectId: d.id } as ProjectFirestoreDocument)
        )

        return { success: true, data: projects, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar proyectos de inspiración'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Prepares a structured editorial collection from a set of projects for SEO display.
 */
export function assembleInspirationCollection(
    category: string,
    zone: string,
    projects: ProjectFirestoreDocument[]
): CuratedInspirationCollection {
    const themeSlug = `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${zone}`
    const title = buildInspirationThemeTitle(category, zone)
    const subtitle = `Explora ${projects.length} obras reales ejecutadas por contratistas calificados con fotografías antes y después.`

    const seoKeywords = [
        category,
        `remodelación ${category}`,
        `${category} Bogotá`,
        zone,
        'fotos antes y después',
        'contratistas verificados',
    ]

    const summaryText = `Descubre proyectos de ${category} realizados en ${zone}. Todos los proyectos cuentan con autorización previa del propietario y fotos optimizadas.`

    return {
        themeSlug,
        title,
        subtitle,
        category,
        zone,
        projectCount: projects.length,
        projects,
        seoKeywords,
        summaryText,
    }
}

