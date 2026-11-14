/**
 * Project Service (ADR Option C Implementation)
 *
 * Provides CRUD, entitlement gating, and search-indexing helpers for structured contractor projects.
 *
 * Monetization Rules:
 * - Free tier merchants can publish up to 2 projects.
 * - Annual members (Destacado) have unlimited projects, Before/After image comparisons,
 *   and automatic curation eligibility for Google-indexed Inspiration Books (I1).
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    type DocumentReference,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { ServiceResponse } from '@/types/services.d'
import {
    type ProjectFirestoreDocument,
    type CreateProjectParams,
    PROJECT_LIMITS,
} from './projectTypes'

export { PROJECT_LIMITS }

const PROJECTS_COLLECTION = 'projects'

/**
 * Validates whether a merchant has the rights to create a new project based on their tier.
 */
export function checkProjectCreationEligibility(
    isAnnualMember: boolean,
    existingProjectsCount: number,
    hasBeforeAfterPairs: boolean
): { allowed: boolean; reason?: string } {
    if (!isAnnualMember && existingProjectsCount >= PROJECT_LIMITS.FREE_TIER_MAX_PROJECTS) {
        return {
            allowed: false,
            reason: `Has alcanzado el límite de ${PROJECT_LIMITS.FREE_TIER_MAX_PROJECTS} proyectos para tu cuenta gratuita. Pasa a la Membresía Anual para publicar proyectos ilimitados.`,
        }
    }

    if (!isAnnualMember && hasBeforeAfterPairs) {
        return {
            allowed: false,
            reason: 'El comparador interactivo Antes / Después es un beneficio exclusivo de la Membresía Anual.',
        }
    }

    return { allowed: true }
}

/**
 * Create a new structured project with tier entitlement enforcement and client consent validation.
 */
export async function createProject(
    params: CreateProjectParams
): Promise<ServiceResponse<ProjectFirestoreDocument>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Servicio de base de datos no disponible.' },
        }
    }

    const hasPairs = params.data.beforeAfterPairs && params.data.beforeAfterPairs.length > 0
    const eligibility = checkProjectCreationEligibility(
        params.isAnnualMember,
        params.existingProjectsCount,
        hasPairs
    )

    if (!eligibility.allowed) {
        return {
            success: false,
            data: null,
            error: { code: 'FIRESTORE_PERMISSION_DENIED', message: eligibility.reason || 'Acción no permitida' },
        }
    }

    if (!params.data.clientConsent?.granted) {
        return {
            success: false,
            data: null,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Debes certificar que cuentas con autorización del cliente para publicar fotos del inmueble.',
            },
        }
    }

    const nowIso = new Date().toISOString()
    const docData: Omit<ProjectFirestoreDocument, 'projectId'> = {
        ...params.data,
        editorialStatus: params.isAnnualMember ? 'pending' : 'draft',
        isFeatured: false,
        createdAt: nowIso,
        updatedAt: nowIso,
    }

    try {
        const colRef = collection(firestore, PROJECTS_COLLECTION)
        const docRef = await addDoc(colRef, docData)
        const createdProject: ProjectFirestoreDocument = {
            ...docData,
            projectId: docRef.id,
        }

        return { success: true, data: createdProject, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al guardar el proyecto'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Get all published projects for a specific merchant.
 */
export async function getProjectsByComerciante(
    comercianteId: string
): Promise<ServiceResponse<ProjectFirestoreDocument[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const colRef = collection(firestore, PROJECTS_COLLECTION)
        const q = query(
            colRef,
            where('comercianteId', '==', comercianteId),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map(
            (d) => ({ ...d.data(), projectId: d.id } as ProjectFirestoreDocument)
        )

        return { success: true, data: list, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar proyectos'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Get a single project by ID.
 */
export async function getProjectById(
    projectId: string
): Promise<ServiceResponse<ProjectFirestoreDocument | null>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: null, error: null }
    }

    try {
        const docRef = doc(firestore, PROJECTS_COLLECTION, projectId) as DocumentReference<ProjectFirestoreDocument>
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            return { success: true, data: null, error: null }
        }
        return { success: true, data: { ...snap.data(), projectId: snap.id }, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar el proyecto'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Delete a project by ID.
 */
export async function deleteProject(
    projectId: string,
    callerUserId: string
): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Base de datos no disponible' },
        }
    }

    try {
        const docRef = doc(firestore, PROJECTS_COLLECTION, projectId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            return {
                success: false,
                data: null,
                error: { code: 'FIRESTORE_NOT_FOUND', message: 'Proyecto no encontrado' },
            }
        }

        const project = snap.data() as ProjectFirestoreDocument
        if (project.comercianteId !== callerUserId) {
            return {
                success: false,
                data: null,
                error: { code: 'FIRESTORE_PERMISSION_DENIED', message: 'No estás autorizado para eliminar este proyecto' },
            }
        }

        await deleteDoc(docRef)
        return { success: true, data: undefined as unknown as void, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al eliminar el proyecto'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}
