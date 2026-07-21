/**
 * Inmuebles Service
 *
 * Firestore subcollection CRUD operations for user property addresses:
 * `usersPropietariosResidentes/{propietarioId}/inmuebles/{inmuebleId}`
 *
 * Adheres strictly to the ServiceResponse<T> pattern and rules.
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    query,
    orderBy,
    type CollectionReference
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { ServiceResponse, ServiceErrorCode } from '@/types/services.d'
import type { Inmueble, CreateInmuebleInput, UpdateInmuebleInput } from './types'

const PROPIETARIOS_COLLECTION = 'usersPropietariosResidentes'
const INMUEBLES_SUBCOLLECTION = 'inmuebles'

function ssrErrorResponse<T>(): ServiceResponse<T> {
    return {
        success: false,
        data: null,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Firebase not available (SSR)'
        }
    }
}

function getInmueblesRef(propietarioId: string): CollectionReference | null {
    if (!firestore) return null
    return collection(firestore, PROPIETARIOS_COLLECTION, propietarioId, INMUEBLES_SUBCOLLECTION)
}

/**
 * Fetch all properties for a propietario, ordered by creation date
 */
export async function getInmuebles(propietarioId: string): Promise<ServiceResponse<Inmueble[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return ssrErrorResponse()
    }

    try {
        const ref = getInmueblesRef(propietarioId)
        if (!ref) return ssrErrorResponse()

        const q = query(ref, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)

        const inmuebles: Inmueble[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                propietarioId,
                alias: data.alias || 'Inmueble sin nombre',
                direccion: data.direccion || '',
                ciudad: data.ciudad || 'Bogotá',
                codigoPostal: data.codigoPostal || '',
                zona: data.zona || '',
                lat: data.lat ?? undefined,
                lng: data.lng ?? undefined,
                isPreferida: Boolean(data.isPreferida),
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString(),
            }
        })

        return { success: true, data: inmuebles, error: null }
    } catch (err: any) {
        console.error('[inmuebleService] Error fetching inmuebles:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al obtener inmuebles'
            }
        }
    }
}

/**
 * Get the currently preferred property for a propietario
 */
export async function getPreferidaInmueble(propietarioId: string): Promise<ServiceResponse<Inmueble | null>> {
    const listRes = await getInmuebles(propietarioId)
    if (!listRes.success || !listRes.data) {
        return listRes as ServiceResponse<null>
    }

    const preferida = listRes.data.find((item) => item.isPreferida) || listRes.data[0] || null
    return { success: true, data: preferida, error: null }
}

/**
 * Create a new property for a propietario
 */
export async function createInmueble(
    propietarioId: string,
    data: CreateInmuebleInput
): Promise<ServiceResponse<Inmueble>> {
    if (!isFirebaseAvailable() || !firestore) {
        return ssrErrorResponse()
    }

    try {
        const ref = getInmueblesRef(propietarioId)
        if (!ref) return ssrErrorResponse()

        // Check existing properties to handle 'isPreferida' logic
        const existingRes = await getInmuebles(propietarioId)
        const existingList = existingRes.success && existingRes.data ? existingRes.data : []

        const shouldBePreferida = data.isPreferida || existingList.length === 0

        const newDocRef = doc(ref)
        const now = new Date().toISOString()

        const newInmueble: Inmueble = {
            id: newDocRef.id,
            propietarioId,
            alias: data.alias.trim(),
            direccion: data.direccion.trim(),
            ciudad: data.ciudad.trim(),
            codigoPostal: data.codigoPostal?.trim() || '',
            zona: data.zona?.trim() || '',
            lat: data.lat,
            lng: data.lng,
            isPreferida: shouldBePreferida,
            createdAt: now,
            updatedAt: now,
        }

        const batch = writeBatch(firestore)

        // If new property is marked as preferida, unset preferida on existing ones
        if (shouldBePreferida && existingList.length > 0) {
            existingList.forEach((item) => {
                if (item.isPreferida) {
                    const itemRef = doc(ref, item.id)
                    batch.update(itemRef, { isPreferida: false, updatedAt: now })
                }
            })
        }

        batch.set(newDocRef, newInmueble)
        await batch.commit()

        return { success: true, data: newInmueble, error: null }
    } catch (err: any) {
        console.error('[inmuebleService] Error creating inmueble:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al crear el inmueble'
            }
        }
    }
}

/**
 * Update an existing property document
 */
export async function updateInmueble(
    propietarioId: string,
    inmuebleId: string,
    updates: UpdateInmuebleInput
): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return ssrErrorResponse()
    }

    try {
        const ref = getInmueblesRef(propietarioId)
        if (!ref) return ssrErrorResponse()

        const targetRef = doc(ref, inmuebleId)
        const now = new Date().toISOString()

        const payload: Record<string, any> = {
            ...updates,
            updatedAt: now,
        }

        if (updates.isPreferida) {
            // Unset preferida on all other properties
            const existingRes = await getInmuebles(propietarioId)
            if (existingRes.success && existingRes.data) {
                const batch = writeBatch(firestore)
                existingRes.data.forEach((item) => {
                    if (item.id !== inmuebleId && item.isPreferida) {
                        batch.update(doc(ref, item.id), { isPreferida: false, updatedAt: now })
                    }
                })
                batch.update(targetRef, payload)
                await batch.commit()
                return { success: true, data: undefined, error: null }
            }
        }

        await updateDoc(targetRef, payload)
        return { success: true, data: undefined, error: null }
    } catch (err: any) {
        console.error('[inmuebleService] Error updating inmueble:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al actualizar el inmueble'
            }
        }
    }
}

/**
 * Set a property as the preferred property atomically
 */
export async function setPreferidaInmueble(
    propietarioId: string,
    inmuebleId: string
): Promise<ServiceResponse<void>> {
    return updateInmueble(propietarioId, inmuebleId, { isPreferida: true })
}

/**
 * Delete a property with deletion guards
 */
export async function deleteInmueble(
    propietarioId: string,
    inmuebleId: string
): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return ssrErrorResponse()
    }

    try {
        const listRes = await getInmuebles(propietarioId)
        if (!listRes.success || !listRes.data) {
            return {
                success: false,
                data: null,
                error: { code: 'INTERNAL_ERROR', message: 'No se pudo verificar el listado de inmuebles' }
            }
        }

        const list = listRes.data
        const target = list.find((item) => item.id === inmuebleId)

        if (!target) {
            return {
                success: false,
                data: null,
                error: { code: 'FIRESTORE_NOT_FOUND', message: 'El inmueble especificado no existe' }
            }
        }

        // Guard: If deleting the preferred property when other properties exist
        if (target.isPreferida && list.length > 1) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'No puedes eliminar la propiedad preferida mientras existan otras propiedades. Por favor designa otra propiedad como preferida primero.'
                }
            }
        }

        const ref = getInmueblesRef(propietarioId)
        if (!ref) return ssrErrorResponse()

        await deleteDoc(doc(ref, inmuebleId))
        return { success: true, data: undefined, error: null }
    } catch (err: any) {
        console.error('[inmuebleService] Error deleting inmueble:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al eliminar el inmueble'
            }
        }
    }
}
