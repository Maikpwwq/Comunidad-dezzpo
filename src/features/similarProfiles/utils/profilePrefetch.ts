/**
 * Profile Prefetch Utility (Innovación #3: Precarga condicional al hover/focus)
 *
 * Speculatively pre-fetches profile route chunks and assets when a user hovers
 * or focuses a profile card with keyboard, ensuring near-instant navigation.
 *
 * Strict Invariants:
 * - Respects Data Saver mode (navigator.connection.saveData === true -> NO prefetch).
 * - Bounded network safety: skips prefetch on slow 2G connections ('slow-2g', '2g').
 * - Deduplication: each URL is requested at most once per browsing session.
 * - SSR safe: checks typeof window / document before any DOM or router calls.
 */

import { prefetch as vikePrefetch } from 'vike/client/router'

interface NetworkInformationLike {
    readonly effectiveType?: string | undefined
    readonly saveData?: boolean | undefined
}

interface NavigatorWithConnection {
    readonly connection?: NetworkInformationLike | undefined
    readonly mozConnection?: NetworkInformationLike | undefined
    readonly webkitConnection?: NetworkInformationLike | undefined
}

const prefetchedUrls = new Set<string>()

/**
 * Checks whether the user's network connection is fast enough for speculative prefetching.
 * Safe fallback: returns true if Network Information API is not supported.
 */
export function isFastConnection(customNavigator?: unknown): boolean {
    const nav = (customNavigator !== undefined
        ? customNavigator
        : typeof navigator !== 'undefined'
          ? navigator
          : undefined) as (Navigator & NavigatorWithConnection) | undefined

    if (!nav) return false

    const conn = nav.connection || nav.mozConnection || nav.webkitConnection
    if (conn) {
        if (conn.saveData === true) {
            return false
        }
        const effective = (conn.effectiveType || '').toLowerCase()
        if (effective === '2g' || effective === 'slow-2g') {
            return false
        }
    }

    return true
}

export interface PrefetchProfileOptions {
    readonly customPrefetch?: ((url: string) => void) | undefined
    readonly customNavigator?: unknown | undefined
    readonly customDocument?: Document | undefined
}

/**
 * Conditionally pre-fetches a profile route on hover or focus.
 * Returns true if the prefetch was executed, false if skipped.
 */
export function prefetchProfileRoute(
    url: string,
    options?: PrefetchProfileOptions | undefined
): boolean {
    if (!url || typeof url !== 'string') return false
    const cleanUrl = url.trim()
    if (!cleanUrl) return false

    // Deduplication check
    if (prefetchedUrls.has(cleanUrl)) {
        return false
    }

    // Network condition check
    if (!isFastConnection(options?.customNavigator)) {
        return false
    }

    prefetchedUrls.add(cleanUrl)

    // 1. Prefetch via Vike client router (downloads page JS/CSS chunks)
    try {
        if (options?.customPrefetch) {
            options.customPrefetch(cleanUrl)
        } else if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
            vikePrefetch(cleanUrl)
        }
    } catch {
        // Safe ignore if Vike router prefetch fails in test or unsupported context
    }

    // 2. Speculative browser link prefetch
    try {
        const doc = options?.customDocument || (typeof document !== 'undefined' ? document : undefined)
        if (doc && doc.head && typeof doc.createElement === 'function') {
            const link = doc.createElement('link')
            link.rel = 'prefetch'
            link.href = cleanUrl
            link.as = 'fetch'
            link.crossOrigin = 'anonymous'
            doc.head.appendChild(link)
        }
    } catch {
        // Safe ignore in headless or restricted CSP environments
    }

    return true
}

/**
 * Pre-fetches profile route and pre-loads avatar image if available.
 */
export function prefetchProfileAssets(
    profileUrl: string,
    photoUrl?: string | null | undefined,
    options?: PrefetchProfileOptions | undefined
): boolean {
    const routeResult = prefetchProfileRoute(profileUrl, options)

    if (photoUrl && isFastConnection(options?.customNavigator)) {
        try {
            if (typeof window !== 'undefined' && typeof Image !== 'undefined') {
                const img = new Image()
                img.src = photoUrl
            }
        } catch {
            // Safe ignore
        }
    }

    return routeResult
}

/**
 * Testing helper: resets the deduplication cache.
 */
export function resetPrefetchCacheForTesting(): void {
    prefetchedUrls.clear()
}
