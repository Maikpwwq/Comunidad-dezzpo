/**
 * User Service
 *
 * Read and update user documents in Firestore.
 * Supports both Propietarios (role 1) and Comerciantes (role 2).
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
import { firestore } from '@services/firebase'
import type { ReadUserParams, UpdateUserParams, UserFirestoreDocument, UserRole } from '../types'

// Collection names
const PROPIETARIOS_COLLECTION = 'usersPropietariosResidentes'
const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'

/**
 * Get the collection reference based on user role
 */
function getUserCollection(role: UserRole) {
    const collectionName = role === 1 ? PROPIETARIOS_COLLECTION : COMERCIANTES_COLLECTION
    return collection(firestore, collectionName)
}

/**
 * Get a user document by ID and role
 */
export async function getUser({ userId, role }: ReadUserParams): Promise<UserFirestoreDocument | null> {
    try {
        const userCol = getUserCollection(role)
        const docRef = doc(userCol, userId) as DocumentReference<UserFirestoreDocument>
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            return { ...snapshot.data(), userId: snapshot.id }
        }
        return null
    } catch (error) {
        console.error('Error reading user:', error)
        throw error
    }
}

/**
 * Update a user document
 */
export async function updateUser({ userId, role, data }: UpdateUserParams): Promise<void> {
    try {
        const userCol = getUserCollection(role)
        const docRef = doc(userCol, userId)
        await updateDoc(docRef, data)
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}

/**
 * Create or overwrite a user document
 */
export async function setUser({ userId, role, data }: UpdateUserParams): Promise<void> {
    try {
        const userCol = getUserCollection(role)
        const docRef = doc(userCol, userId)
        await setDoc(docRef, data, { merge: true })
    } catch (error) {
        console.error('Error setting user:', error)
        throw error
    }
}

/**
 * Get users by categories (for search)
 */
export async function getUsersByCategories(categories: string[]): Promise<UserFirestoreDocument[]> {
    try {
        const userCol = collection(firestore, COMERCIANTES_COLLECTION)
        const q = query(userCol, where('userCategories', 'array-contains-any', categories))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            userId: doc.id,
        })) as UserFirestoreDocument[]
    } catch (error) {
        console.error('Error searching users:', error)
        throw error
    }
}

/**
 * Get all users from a collection
 */
export async function getUsers(role: UserRole): Promise<UserFirestoreDocument[]> {
    try {
        const userCol = getUserCollection(role)
        const snapshot = await getDocs(userCol)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            userId: doc.id,
        })) as UserFirestoreDocument[]
    } catch (error) {
        console.error('Error getting users:', error)
        throw error
    }
}
