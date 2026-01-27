/**
 * useShareAction Hook
 *
 * Reusable hook for Web Share API with fallback to clipboard.
 * Extracted from UserCard and DraftCard share logic.
 */

import { useCallback, useState } from 'react'

export interface ShareData {
    title: string
    text?: string
    url: string
}

export interface UseShareActionReturn {
    /** Share function */
    share: (data: ShareData) => Promise<void>
    /** Whether the data was shared successfully */
    shared: boolean
    /** Whether it fell back to clipboard */
    usedFallback: boolean
    /** Error if share failed */
    error: Error | null
    /** Reset shared state */
    reset: () => void
}

/**
 * Hook for sharing content via Web Share API with clipboard fallback
 *
 * @example
 * ```tsx
 * const { share, shared, usedFallback } = useShareAction()
 *
 * const handleShare = () => {
 *   share({
 *     title: 'Check this out!',
 *     text: 'Amazing content',
 *     url: window.location.href
 *   })
 * }
 * ```
 */
export function useShareAction(): UseShareActionReturn {
    const [shared, setShared] = useState(false)
    const [usedFallback, setUsedFallback] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const share = useCallback(async (data: ShareData): Promise<void> => {
        setError(null)
        setShared(false)
        setUsedFallback(false)

        try {
            // Try Web Share API first
            if (navigator.share) {
                await navigator.share({
                    title: data.title,
                    ...(data.text && { text: data.text }),
                    url: data.url,
                })
                setShared(true)
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(data.url)
                setShared(true)
                setUsedFallback(true)
            }
        } catch (err) {
            // User cancelled share - not an error
            if ((err as Error).name === 'AbortError') {
                return
            }

            // Try clipboard as last resort
            try {
                await navigator.clipboard.writeText(data.url)
                setShared(true)
                setUsedFallback(true)
            } catch (clipboardErr) {
                setError(clipboardErr as Error)
            }
        }
    }, [])

    const reset = useCallback(() => {
        setShared(false)
        setUsedFallback(false)
        setError(null)
    }, [])

    return {
        share,
        shared,
        usedFallback,
        error,
        reset,
    }
}

export default useShareAction
