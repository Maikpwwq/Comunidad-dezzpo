/**
 * Inspiration Board Service (R7-T4 & I4)
 *
 * CRUD operations for client moodboards and inspiration books.
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    type DocumentReference,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { ServiceResponse } from '@/types/services.d'
import type {
    InspirationBoard,
    InspirationItem,
    CreateInspirationBoardParams,
} from './inspirationBoardTypes'

const BOARDS_COLLECTION = 'inspirationBoards'

/**
 * Creates a new inspiration board / moodboard.
 */
export async function createInspirationBoard(
    params: CreateInspirationBoardParams
): Promise<ServiceResponse<InspirationBoard>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Servicio de base de datos no disponible.' },
        }
    }

    if (!params.title.trim()) {
        return {
            success: false,
            data: null,
            error: { code: 'VALIDATION_ERROR', message: 'El título del tablero es obligatorio.' },
        }
    }

    const nowIso = new Date().toISOString()
    const docData: Omit<InspirationBoard, 'boardId'> = {
        ownerId: params.ownerId,
        title: params.title.trim(),
        description: params.description?.trim() || '',
        isPublic: params.isPublic ?? false,
        items: [],
        createdAt: nowIso,
        updatedAt: nowIso,
    }

    try {
        const colRef = collection(firestore, BOARDS_COLLECTION)
        const docRef = await addDoc(colRef, docData)
        const created: InspirationBoard = {
            ...docData,
            boardId: docRef.id,
        }

        return { success: true, data: created, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al crear tablero de inspiración'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Get all boards owned by a user.
 */
export async function getBoardsByOwner(
    ownerId: string
): Promise<ServiceResponse<InspirationBoard[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const colRef = collection(firestore, BOARDS_COLLECTION)
        const q = query(
            colRef,
            where('ownerId', '==', ownerId),
            orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        const list = snap.docs.map(
            (d) => ({ ...d.data(), boardId: d.id } as InspirationBoard)
        )

        return { success: true, data: list, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar tableros'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Get a single inspiration board by ID.
 */
export async function getBoardById(
    boardId: string
): Promise<ServiceResponse<InspirationBoard | null>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: null, error: null }
    }

    try {
        const docRef = doc(firestore, BOARDS_COLLECTION, boardId) as DocumentReference<InspirationBoard>
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            return { success: true, data: null, error: null }
        }
        return { success: true, data: { ...snap.data(), boardId: snap.id }, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al consultar tablero'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Add an item (project photo, material, or color) to a board.
 */
export async function addItemToBoard(
    boardId: string,
    itemInput: Omit<InspirationItem, 'id' | 'addedAt'>
): Promise<ServiceResponse<InspirationBoard>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Servicio de base de datos no disponible.' },
        }
    }

    try {
        const docRef = doc(firestore, BOARDS_COLLECTION, boardId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            return {
                success: false,
                data: null,
                error: { code: 'FIRESTORE_NOT_FOUND', message: 'Tablero no encontrado' },
            }
        }

        const currentBoard = snap.data() as InspirationBoard
        const nowIso = new Date().toISOString()
        const newItem: InspirationItem = {
            ...itemInput,
            id: `item-${Date.now()}`,
            addedAt: nowIso,
        }

        const updatedItems = [...(currentBoard.items || []), newItem]
        await updateDoc(docRef, {
            items: updatedItems,
            updatedAt: nowIso,
        })

        const updatedBoard: InspirationBoard = {
            ...currentBoard,
            boardId,
            items: updatedItems,
            updatedAt: nowIso,
        }

        return { success: true, data: updatedBoard, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al agregar elemento al tablero'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Remove an item from a board.
 */
export async function removeItemFromBoard(
    boardId: string,
    itemId: string
): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Servicio de base de datos no disponible.' },
        }
    }

    try {
        const docRef = doc(firestore, BOARDS_COLLECTION, boardId)
        const snap = await getDoc(docRef)
        if (!snap.exists()) {
            return {
                success: false,
                data: null,
                error: { code: 'FIRESTORE_NOT_FOUND', message: 'Tablero no encontrado' },
            }
        }

        const currentBoard = snap.data() as InspirationBoard
        const filteredItems = (currentBoard.items || []).filter((item) => item.id !== itemId)
        const nowIso = new Date().toISOString()

        await updateDoc(docRef, {
            items: filteredItems,
            updatedAt: nowIso,
        })

        return { success: true, data: undefined as unknown as void, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al eliminar elemento del tablero'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}

/**
 * Link a moodboard to a requirement draft so quoting merchants see the exact customer references.
 */
export async function linkBoardToDraft(
    boardId: string,
    draftId: string
): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Servicio de base de datos no disponible.' },
        }
    }

    try {
        const docRef = doc(firestore, BOARDS_COLLECTION, boardId)
        await updateDoc(docRef, {
            linkedDraftId: draftId,
            updatedAt: new Date().toISOString(),
        })

        return { success: true, data: undefined as unknown as void, error: null }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al vincular tablero al requerimiento'
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message },
        }
    }
}
