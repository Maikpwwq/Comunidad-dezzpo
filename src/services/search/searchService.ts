/**
 * Search Service
 *
 * Search operations across Firestore collections.
 */

import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@services/firebase'
import type { SearchParams, SearchResult, UserFirestoreDocument } from '../types'

const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'

/**
 * Search users by categories
 */
export async function searchByCategories({ query: searchQuery, categories, limit: resultLimit }: SearchParams): Promise<SearchResult> {
    try {
        const searchTerms = categories || [searchQuery]
        const userCol = collection(firestore, COMERCIANTES_COLLECTION)
        const q = query(userCol, where('userCategories', 'array-contains-any', searchTerms))
        const snapshot = await getDocs(q)

        let users = snapshot.docs.map((doc) => ({
            ...doc.data(),
            userId: doc.id,
        })) as UserFirestoreDocument[]

        if (resultLimit) {
            users = users.slice(0, resultLimit)
        }

        return {
            users,
            total: snapshot.size,
        }
    } catch (error) {
        console.error('Error searching users:', error)
        throw error
    }
}

/**
 * Search users by name (fuzzy match)
 * Note: Firestore doesn't support true full-text search,
 * this is a prefix match implementation.
 */
export async function searchByName(name: string): Promise<UserFirestoreDocument[]> {
    try {
        const userCol = collection(firestore, COMERCIANTES_COLLECTION)
        const q = query(
            userCol,
            where('userName', '>=', name),
            where('userName', '<=', name + '\uf8ff')
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            ...doc.data(),
            userId: doc.id,
        })) as UserFirestoreDocument[]
    } catch (error) {
        console.error('Error searching by name:', error)
        throw error
    }
}
