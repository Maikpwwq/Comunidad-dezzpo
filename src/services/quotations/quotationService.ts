/**
 * Quotation Service
 *
 * Read and update quotation documents in Firestore.
 * Handles professional quotes/proposals lifecycle with ServiceResponse<T> pattern.
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
    type DocumentReference,
} from 'firebase/firestore'
import { firestore } from '@firebase/firebaseClient'
import type { 
    ReadQuotationParams, 
    UpdateQuotationParams, 
    QuotationFirestoreDocument,
    ServiceResponse,
    ServiceErrorCode
} from '@/types/services.d'

const QUOTATIONS_COLLECTION = 'quotations'

/**
 * Map Firestore error codes to ServiceErrorCode
 */
function mapFirestoreErrorCode(code?: string): ServiceErrorCode {
    if (code === 'permission-denied') return 'FIRESTORE_PERMISSION_DENIED'
    if (code === 'not-found') return 'FIRESTORE_NOT_FOUND'
    return 'INTERNAL_ERROR'
}

/**
 * Get a quotation document by ID
 */
export async function getQuotation({ quotationId }: ReadQuotationParams): Promise<ServiceResponse<QuotationFirestoreDocument>> {
    try {
        const quotationsRef = collection(firestore, QUOTATIONS_COLLECTION)
        const docRef = doc(quotationsRef, quotationId) as DocumentReference<QuotationFirestoreDocument>
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return {
                success: true,
                data: { ...snapshot.data(), quotationId: snapshot.id },
                error: null
            }
        }
        
        return {
            success: false,
            data: null,
            error: {
                code: 'FIRESTORE_NOT_FOUND',
                message: 'Quotation not found'
            }
        }
    } catch (error) {
        const firestoreError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapFirestoreErrorCode(firestoreError.code),
                message: firestoreError.message ?? 'Error reading quotation'
            }
        }
    }
}

/**
 * Update a quotation document
 */
export async function updateQuotation({ quotationId, data }: UpdateQuotationParams): Promise<ServiceResponse<void>> {
    try {
        const quotationsRef = collection(firestore, QUOTATIONS_COLLECTION)
        const docRef = doc(quotationsRef, quotationId)
        await updateDoc(docRef, data)
        return {
            success: true,
            data: undefined as unknown as void,
            error: null
        }
    } catch (error) {
        const firestoreError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapFirestoreErrorCode(firestoreError.code),
                message: firestoreError.message ?? 'Error updating quotation'
            }
        }
    }
}

/**
 * Create or overwrite a quotation document
 */
export async function setQuotation({ quotationId, data }: UpdateQuotationParams): Promise<ServiceResponse<void>> {
    try {
        const quotationsRef = collection(firestore, QUOTATIONS_COLLECTION)
        const docRef = doc(quotationsRef, quotationId)
        await setDoc(docRef, data, { merge: true })
        return {
            success: true,
            data: undefined as unknown as void,
            error: null
        }
    } catch (error) {
        const firestoreError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapFirestoreErrorCode(firestoreError.code),
                message: firestoreError.message ?? 'Error setting quotation'
            }
        }
    }
}

/**
 * Get quotations by draft ID
 */
export async function getQuotationsByDraft(draftId: string): Promise<ServiceResponse<QuotationFirestoreDocument[]>> {
    try {
        const quotationsRef = collection(firestore, QUOTATIONS_COLLECTION)
        const q = query(quotationsRef, where('quotationDraftId', '==', draftId))
        const snapshot = await getDocs(q)

        const quotations = snapshot.docs.map((doc) => ({
            ...doc.data(),
            quotationId: doc.id,
        })) as QuotationFirestoreDocument[]

        return {
            success: true,
            data: quotations,
            error: null
        }
    } catch (error) {
        const firestoreError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapFirestoreErrorCode(firestoreError.code),
                message: firestoreError.message ?? 'Error getting draft quotations'
            }
        }
    }
}

/**
 * Get quotations by comerciante ID
 */
export async function getQuotationsByComerciante(comercianteId: string): Promise<ServiceResponse<QuotationFirestoreDocument[]>> {
    try {
        const quotationsRef = collection(firestore, QUOTATIONS_COLLECTION)
        const q = query(quotationsRef, where('quotationComercianteId', '==', comercianteId))
        const snapshot = await getDocs(q)

        const quotations = snapshot.docs.map((doc) => ({
            ...doc.data(),
            quotationId: doc.id,
        })) as QuotationFirestoreDocument[]

        return {
            success: true,
            data: quotations,
            error: null
        }
    } catch (error) {
        const firestoreError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapFirestoreErrorCode(firestoreError.code),
                message: firestoreError.message ?? 'Error getting comerciante quotations'
            }
        }
    }
}
