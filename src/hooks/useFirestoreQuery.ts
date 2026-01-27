/**
 * useFirestoreQuery Hook
 *
 * Generic hook for querying Firestore collections with real-time updates.
 * Supports filtering, ordering, and pagination.
 *
 * @example
 * ```tsx
 * // Simple collection query
 * const { data, loading, error } = useFirestoreQuery<User>({
 *   collection: 'users',
 *   where: [['role', '==', 1]],
 *   orderBy: ['createdAt', 'desc'],
 *   limit: 10
 * })
 *
 * // Real-time subscription
 * const { data } = useFirestoreQuery<Draft>({
 *   collection: 'drafts',
 *   where: [['userId', '==', currentUser.userId]],
 *   realtime: true
 * })
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    onSnapshot,
    type QueryConstraint,
    type DocumentData,
    type WhereFilterOp,
    type OrderByDirection,
} from 'firebase/firestore'
import { firestore } from '@firebase/firebaseClient'

export type WhereClause = [string, WhereFilterOp, unknown]
export type OrderByClause = [string, OrderByDirection?]

export interface FirestoreQueryOptions {
    /** Collection name */
    collection: string
    /** Where clauses for filtering */
    where?: WhereClause[]
    /** Order by field and direction */
    orderBy?: OrderByClause
    /** Limit number of results */
    limit?: number
    /** Enable real-time updates */
    realtime?: boolean
    /** Skip the query (useful for conditional fetching) */
    skip?: boolean
}

export interface UseFirestoreQueryReturn<T> {
    /** Query results */
    data: T[]
    /** Loading state */
    loading: boolean
    /** Error if query failed */
    error: Error | null
    /** Refetch the data */
    refetch: () => Promise<void>
}

/**
 * Hook for querying Firestore collections
 */
export function useFirestoreQuery<T extends DocumentData = DocumentData>({
    collection: collectionName,
    where: whereClauses,
    orderBy: orderByClause,
    limit: limitCount,
    realtime = false,
    skip = false,
}: FirestoreQueryOptions): UseFirestoreQueryReturn<T> {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(!skip)
    const [error, setError] = useState<Error | null>(null)

    // Build query constraints
    const buildQuery = useCallback(() => {
        const constraints: QueryConstraint[] = []

        if (whereClauses) {
            whereClauses.forEach(([field, op, value]) => {
                constraints.push(where(field, op, value))
            })
        }

        if (orderByClause) {
            const [field, direction = 'asc'] = orderByClause
            constraints.push(orderBy(field, direction))
        }

        if (limitCount) {
            constraints.push(limit(limitCount))
        }

        return query(collection(firestore, collectionName), ...constraints)
    }, [collectionName, whereClauses, orderByClause, limitCount])

    // Fetch data (one-time)
    const fetchData = useCallback(async () => {
        if (skip) return

        setLoading(true)
        setError(null)

        try {
            const q = buildQuery()
            const snapshot = await getDocs(q)
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as T[]
            setData(results)
        } catch (err) {
            setError(err as Error)
            console.error('Firestore query error:', err)
        } finally {
            setLoading(false)
        }
    }, [buildQuery, skip])

    // Effect for initial load and real-time subscription
    useEffect(() => {
        if (skip) {
            setData([])
            setLoading(false)
            return
        }

        if (realtime) {
            setLoading(true)
            const q = buildQuery()
            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const results = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as unknown as T[]
                    setData(results)
                    setLoading(false)
                },
                (err) => {
                    setError(err)
                    setLoading(false)
                }
            )

            return () => unsubscribe()
        } else {
            fetchData()
        }
    }, [buildQuery, skip, realtime, fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    }
}

export default useFirestoreQuery
