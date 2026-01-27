/**
 * Draft Service
 *
 * Read and update draft documents in Firestore.
 * Handles project draft/request lifecycle.
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    type DocumentReference,
} from 'firebase/firestore'
import { firestore } from '@services/firebase'
import type { ReadDraftParams, UpdateDraftParams, DraftFirestoreDocument } from '../types'

const DRAFTS_COLLECTION = 'drafts'

/**
 * Get a draft document by ID
 */
export async function getDraft({ draftId }: ReadDraftParams): Promise<DraftFirestoreDocument | null> {
    try {
        const draftsRef = collection(firestore, DRAFTS_COLLECTION)
        const docRef = doc(draftsRef, draftId) as DocumentReference<DraftFirestoreDocument>
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return { ...snapshot.data(), draftId: snapshot.id }
        }
        return null
    } catch (error) {
        console.error('Error reading draft:', error)
        throw error
    }
}

/**
 * Update a draft document
 */
export async function updateDraft({ draftId, data }: UpdateDraftParams): Promise<void> {
    try {
        const draftsRef = collection(firestore, DRAFTS_COLLECTION)
        const docRef = doc(draftsRef, draftId)
        await updateDoc(docRef, data)
    } catch (error) {
        console.error('Error updating draft:', error)
        throw error
    }
}

/**
 * Create or overwrite a draft document
 */
export async function setDraft({ draftId, data }: UpdateDraftParams): Promise<void> {
    try {
        const draftsRef = collection(firestore, DRAFTS_COLLECTION)
        const docRef = doc(draftsRef, draftId)
        await setDoc(docRef, data, { merge: true })
    } catch (error) {
        console.error('Error setting draft:', error)
        throw error
    }
}

/**
 * Get drafts by user ID
 */
export async function getDraftsByUser(userId: string): Promise<DraftFirestoreDocument[]> {
    try {
        const draftsRef = collection(firestore, DRAFTS_COLLECTION)
        const q = query(
            draftsRef,
            where('draftPropietarioResidente', '==', userId),
            orderBy('draftCreatedAt', 'desc')
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            draftId: doc.id,
        })) as DraftFirestoreDocument[]
    } catch (error) {
        console.error('Error getting user drafts:', error)
        throw error
    }
}

/**
 * Get all drafts
 */
export async function getAllDrafts(): Promise<DraftFirestoreDocument[]> {
    try {
        const draftsRef = collection(firestore, DRAFTS_COLLECTION)
        const snapshot = await getDocs(draftsRef)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            draftId: doc.id,
        })) as DraftFirestoreDocument[]
    } catch (error) {
        console.error('Error getting all drafts:', error)
        throw error
    }
}
