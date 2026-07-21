/**
 * Asesoria Service
 *
 * Manages Cloud Firestore operations for community technical advisory threads (/asesorias).
 */
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    increment,
    query,
    orderBy,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { AsesoriaFirestoreDocument, AsesoriaResponse } from '@services/types'

const COLLECTION_NAME = 'asesorias'

/**
 * Fetch all advisory threads ordered by creation date descending
 */
export async function getAllAsesorias(): Promise<AsesoriaFirestoreDocument[]> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] getAllAsesorias skipped — Firebase not initialized')
        return []
    }

    try {
        const colRef = collection(firestore, COLLECTION_NAME)
        const q = query(colRef, orderBy('asesoriaCreatedAt', 'desc'))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((docSnap) => {
            const data = docSnap.data()
            return {
                ...data,
                id: docSnap.id,
                asesoriaId: docSnap.id,
            } as AsesoriaFirestoreDocument
        })
    } catch (error) {
        // Fallback: If index is missing or ordering fails, fetch without order and sort in memory
        try {
            const colRef = collection(firestore, COLLECTION_NAME)
            const snapshot = await getDocs(colRef)
            const list = snapshot.docs.map((docSnap) => ({
                ...docSnap.data(),
                id: docSnap.id,
                asesoriaId: docSnap.id,
            })) as AsesoriaFirestoreDocument[]

            return list.sort((a, b) => {
                const dateA = a.asesoriaCreatedAt ? new Date(a.asesoriaCreatedAt).getTime() : 0
                const dateB = b.asesoriaCreatedAt ? new Date(b.asesoriaCreatedAt).getTime() : 0
                return dateB - dateA
            })
        } catch (innerError) {
            console.error('Error fetching asesorias:', innerError)
            return []
        }
    }
}

/**
 * Create a new advisory question / thread
 */
export async function createAsesoria(data: {
    asesoriaTitulo: string
    asesoriaDescription: string
    asesoriaCategoria?: string
    asesoriaAuthorId: string
    asesoriaAuthorName: string
    asesoriaAuthorRole?: 1 | 2
    asesoriaAuthorPhotoUrl?: string
}): Promise<string | null> {
    if (!isFirebaseAvailable() || !firestore) {
        console.warn('[SSR] createAsesoria skipped — Firebase not initialized')
        return null
    }

    try {
        const colRef = collection(firestore, COLLECTION_NAME)
        const newDocPayload: Omit<AsesoriaFirestoreDocument, 'id' | 'asesoriaId'> = {
            asesoriaTitulo: data.asesoriaTitulo.trim(),
            asesoriaDescription: data.asesoriaDescription.trim(),
            asesoriaCategoria: data.asesoriaCategoria?.trim() || 'General',
            asesoriaSelect: 'open',
            asesoriaAuthorId: data.asesoriaAuthorId,
            asesoriaAuthorName: data.asesoriaAuthorName || 'Usuario Dezzpo',
            asesoriaAuthorRole: data.asesoriaAuthorRole || 1,
            asesoriaAuthorPhotoUrl: data.asesoriaAuthorPhotoUrl || '',
            asesoriaCreatedAt: new Date().toISOString(),
            asesoriaRespuestas: [],
            likesCount: 0,
            viewsCount: 0,
        }

        const docRef = await addDoc(colRef, newDocPayload)
        await updateDoc(docRef, { asesoriaId: docRef.id, id: docRef.id })
        return docRef.id
    } catch (error) {
        console.error('Error creating asesoria:', error)
        return null
    }
}

/**
 * Add a response to an existing advisory thread
 */
export async function addAsesoriaResponse(
    asesoriaId: string,
    response: AsesoriaResponse
): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !asesoriaId) {
        return false
    }

    try {
        const docRef = doc(firestore, COLLECTION_NAME, asesoriaId)
        const payload: AsesoriaResponse = {
            responseId: response.responseId || `resp-${Date.now()}`,
            providerId: response.providerId,
            authorName: response.authorName || 'Profesional Dezzpo',
            authorRole: response.authorRole || 2,
            authorPhotoUrl: response.authorPhotoUrl || '',
            answerText: response.answerText.trim(),
            date: response.date || new Date().toISOString(),
            isVerifiedProvider: response.authorRole === 2,
            upvotes: 0,
        }

        await updateDoc(docRef, {
            asesoriaRespuestas: arrayUnion(payload),
        })
        return true
    } catch (error) {
        console.error('Error adding response to asesoria:', error)
        return false
    }
}

/**
 * Increment likes/helpfulness counter on an advisory thread
 */
export async function incrementAsesoriaLikes(asesoriaId: string): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !asesoriaId) return false
    try {
        const docRef = doc(firestore, COLLECTION_NAME, asesoriaId)
        await updateDoc(docRef, {
            likesCount: increment(1),
        })
        return true
    } catch (error) {
        console.error('Error incrementing likes:', error)
        return false
    }
}

/**
 * Legacy support for updateAsesoriaToFirestore
 */
export const updateAsesoriaToFirestore = async ({
    updateInfo,
    docId,
}: {
    updateInfo: {
        asesoriaTitulo: string
        asesoriaDescription: string
        asesoriaSelect: string
    }
    docId: string
}) => {
    if (!isFirebaseAvailable() || !firestore) return false
    try {
        const asesoriaRef = doc(firestore, COLLECTION_NAME, docId)
        await setDoc(
            asesoriaRef,
            {
                ...updateInfo,
                asesoriaCreatedAt: new Date().toISOString(),
            },
            { merge: true }
        )
        return true
    } catch (error) {
        console.error('Error updating asesoria:', error)
        return false
    }
}

export default updateAsesoriaToFirestore
