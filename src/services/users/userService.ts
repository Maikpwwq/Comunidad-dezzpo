/**
 * User Service
 *
 * Read and update user documents in Firestore.
 * Supports both Propietarios (role 1) and Comerciantes (role 2).
 * 
 * SSR-safe: All functions return null/empty results when Firebase is unavailable.
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
    type CollectionReference,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { ReadUserParams, UpdateUserParams, UserFirestoreDocument, UserRole } from '../types'
import { migrateContactFields } from '@utilities/contactUtils'
import { migrateLegacySocialFields } from '@utilities/socialUtils'

// Collection names
const PROPIETARIOS_COLLECTION = 'usersPropietariosResidentes'
const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'

/**
 * Get the collection reference based on user role
 * Returns null if Firebase is not available (SSR)
 */
function getUserCollection(role: UserRole): CollectionReference | null {
    if (!isFirebaseAvailable() || !firestore) {
        return null
    }
    const collectionName = role === 1 ? PROPIETARIOS_COLLECTION : COMERCIANTES_COLLECTION
    return collection(firestore, collectionName)
}

/**
 * Get a user document by ID and role.
 * Normalizes legacy flat contact and social fields into structured arrays.
 */
export async function getUser({ userId, role }: ReadUserParams): Promise<UserFirestoreDocument | null> {
    const userCol = getUserCollection(role)
    if (!userCol) {
        // SSR: Firebase not available, return null
        console.log('[SSR] getUser skipped - Firebase not available')
        return null
    }
    
    try {
        const docRef = doc(userCol, userId) as DocumentReference<UserFirestoreDocument>
        const snapshot = await getDoc(docRef)

        if (snapshot.exists()) {
            const raw = { ...snapshot.data(), userId: snapshot.id }
            // Normalize legacy fields → structured arrays
            const { emails, phones } = migrateContactFields(raw)
            const socialLinks = migrateLegacySocialFields(raw)
            return { ...raw, emails, phones, socialLinks }
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
    const userCol = getUserCollection(role)
    if (!userCol) {
        console.warn('[SSR] updateUser skipped - Firebase not available')
        return
    }
    
    try {
        const docRef = doc(userCol, userId)
        await updateDoc(docRef, data)
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}

import { getStoredReferralCode, clearStoredReferralCode } from '@hooks/useReferralTracker'
import { trackReferralRegistration } from '../referralService'

/**
 * Create or overwrite a user document
 */
export async function setUser({ userId, role, data }: UpdateUserParams): Promise<void> {
    const userCol = getUserCollection(role)
    if (!userCol) {
        console.warn('[SSR] setUser skipped - Firebase not available')
        return
    }
    
    try {
        const docRef = doc(userCol, userId)
        await setDoc(docRef, data, { merge: true })

        // Check for pending referral attribution
        const storedRefCode = getStoredReferralCode()
        if (storedRefCode) {
            trackReferralRegistration(
                userId,
                data.userName || data.userRazonSocial || 'Nuevo Usuario',
                role,
                storedRefCode
            ).then((success) => {
                if (success) clearStoredReferralCode()
            }).catch(console.error)
        }
    } catch (error) {
        console.error('Error setting user:', error)
        throw error
    }
}


/**
 * Get users by categories (for search)
 */
export async function getUsersByCategories(categories: string[]): Promise<UserFirestoreDocument[]> {
    if (!isFirebaseAvailable() || !firestore) {
        console.log('[SSR] getUsersByCategories skipped - Firebase not available')
        return []
    }
    
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
 * Get a user by their userName field (for vanity URLs).
 * Searches comerciantes (role 2) first, then propietarios (role 1).
 * Returns the user document and the role it was found in, or null if not found.
 */
export async function getUserByUsername(
    username: string
): Promise<{ user: UserFirestoreDocument; role: UserRole } | null> {
    if (!isFirebaseAvailable() || !firestore) {
        console.log('[SSR] getUserByUsername skipped - Firebase not available')
        return null
    }

    const rolesToTry: UserRole[] = [2, 1] // Comerciante first, then propietario

    for (const role of rolesToTry) {
        const userCol = getUserCollection(role)
        if (!userCol) continue

        try {
            const q = query(userCol, where('userName', '==', username))
            const snapshot = await getDocs(q)

            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0]!
                return {
                    user: { ...docSnap.data(), userId: docSnap.id } as UserFirestoreDocument,
                    role,
                }
            }
        } catch (error) {
            console.error(`Error querying userName in role ${role}:`, error)
        }
    }

    return null
}

/**
 * Get all users from a collection
 */
export async function getUsers(role: UserRole): Promise<UserFirestoreDocument[]> {
    const userCol = getUserCollection(role)
    if (!userCol) {
        console.log('[SSR] getUsers skipped - Firebase not available')
        return []
    }
    
    try {
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
