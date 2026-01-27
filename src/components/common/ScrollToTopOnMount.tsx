/**
 * ScrollToTopOnMount Component
 *
 * Scrolls to top when component mounts.
 * Migrated from src/index/components/ScrollToTopOnMount.jsx
 */

import { useEffect } from 'react'

export function ScrollToTopOnMount(): null {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    return null
}

export default ScrollToTopOnMount
