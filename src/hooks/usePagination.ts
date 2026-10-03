/**
 * usePagination — Generic client-side pagination hook
 *
 * Receives a filtered array of items and returns the current page slice
 * plus navigation helpers. Framework and data-source agnostic.
 *
 * @example
 * const { pageItems, page, totalPages, nextPage, prevPage } = usePagination({
 *   items: filteredUsers,
 *   pageSize: 12,
 *   resetKey: searchQuery,
 * })
 */
import { useState, useMemo, useEffect, useCallback } from 'react'

export interface UsePaginationOptions<T> {
    /** Full list of items (already filtered) */
    items: T[]
    /** Number of items per page (default: 12) */
    pageSize?: number
    /** When this value changes, page resets to 0 (e.g. a search query string) */
    resetKey?: string
}

export interface UsePaginationResult<T> {
    /** Slice of items for the current page */
    pageItems: T[]
    /** Current page index (0-based) */
    page: number
    /** Total number of pages */
    totalPages: number
    /** Total number of items */
    totalItems: number
    /** Navigate to a specific page */
    goToPage: (page: number) => void
    /** Go to previous page */
    prevPage: () => void
    /** Go to next page */
    nextPage: () => void
    /** Whether current page is the first */
    isFirstPage: boolean
    /** Whether current page is the last */
    isLastPage: boolean
}

export function usePagination<T>(options: UsePaginationOptions<T>): UsePaginationResult<T> {
    const { items, pageSize = 12, resetKey = '' } = options
    const [page, setPage] = useState(0)

    // Reset to page 0 when resetKey or items length changes
    useEffect(() => {
        setPage(0)
    }, [resetKey, items.length])

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(items.length / pageSize)),
        [items.length, pageSize],
    )

    // Clamp page if items shrink
    const safePage = Math.min(page, totalPages - 1)

    const pageItems = useMemo(
        () => items.slice(safePage * pageSize, (safePage + 1) * pageSize),
        [items, safePage, pageSize],
    )

    const goToPage = useCallback(
        (target: number) => {
            setPage(Math.max(0, Math.min(target, totalPages - 1)))
        },
        [totalPages],
    )

    const prevPage = useCallback(() => {
        setPage((p) => Math.max(0, p - 1))
    }, [])

    const nextPage = useCallback(() => {
        setPage((p) => Math.min(totalPages - 1, p + 1))
    }, [totalPages])

    return {
        pageItems,
        page: safePage,
        totalPages,
        totalItems: items.length,
        goToPage,
        prevPage,
        nextPage,
        isFirstPage: safePage === 0,
        isLastPage: safePage >= totalPages - 1,
    }
}
