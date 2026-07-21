/**
 * Payment Methods Service
 *
 * CRUD operations for `users/{userId}/paymentMethods` subcollection in Firestore.
 * SSR-safe.
 */

import {
    collection,
    doc,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type {
    PaymentMethodFirestoreDocument,
    SavePaymentMethodParams,
} from './types'

const USERS_COLLECTION = 'users'
const PAYMENT_METHODS_SUBCOLLECTION = 'paymentMethods'

/**
 * Get all payment methods for a given user
 */
export async function getPaymentMethods(
    userId: string
): Promise<PaymentMethodFirestoreDocument[]> {
    if (!isFirebaseAvailable() || !firestore || !userId) {
        return []
    }

    try {
        const methodsRef = collection(firestore, USERS_COLLECTION, userId, PAYMENT_METHODS_SUBCOLLECTION)
        const q = query(methodsRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
        })) as PaymentMethodFirestoreDocument[]
    } catch (error) {
        console.error('Error fetching payment methods:', error)
        return []
    }
}

/**
 * Save a new payment method (Card or PSE preference)
 */
export async function savePaymentMethod(
    data: SavePaymentMethodParams
): Promise<string | null> {
    if (!isFirebaseAvailable() || !firestore || !data.userId) {
        console.warn('[SSR] savePaymentMethod skipped - Firebase not available')
        return null
    }

    try {
        const methodsRef = collection(firestore, USERS_COLLECTION, data.userId, PAYMENT_METHODS_SUBCOLLECTION)

        // If this is set to default, unset all existing defaults first
        if (data.isDefault) {
            const existingMethods = await getPaymentMethods(data.userId)
            for (const method of existingMethods) {
                if (method.isDefault) {
                    const existingDocRef = doc(firestore, USERS_COLLECTION, data.userId, PAYMENT_METHODS_SUBCOLLECTION, method.id)
                    await updateDoc(existingDocRef, { isDefault: false })
                }
            }
        }

        const payload: Omit<PaymentMethodFirestoreDocument, 'id'> = {
            ...data,
            createdAt: new Date().toISOString(),
        }

        const docRef = await addDoc(methodsRef, payload)
        return docRef.id
    } catch (error) {
        console.error('Error saving payment method:', error)
        throw error
    }
}

/**
 * Delete a payment method by ID
 */
export async function deletePaymentMethod(
    userId: string,
    methodId: string
): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !userId || !methodId) {
        return false
    }

    try {
        const docRef = doc(firestore, USERS_COLLECTION, userId, PAYMENT_METHODS_SUBCOLLECTION, methodId)
        await deleteDoc(docRef)
        return true
    } catch (error) {
        console.error('Error deleting payment method:', error)
        throw error
    }
}

/**
 * Set a payment method as default for the user
 */
export async function setDefaultPaymentMethod(
    userId: string,
    methodId: string
): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !userId || !methodId) {
        return false
    }

    try {
        const existingMethods = await getPaymentMethods(userId)
        for (const method of existingMethods) {
            const methodDocRef = doc(firestore, USERS_COLLECTION, userId, PAYMENT_METHODS_SUBCOLLECTION, method.id)
            if (method.id === methodId) {
                await updateDoc(methodDocRef, { isDefault: true })
            } else if (method.isDefault) {
                await updateDoc(methodDocRef, { isDefault: false })
            }
        }
        return true
    } catch (error) {
        console.error('Error setting default payment method:', error)
        throw error
    }
}
