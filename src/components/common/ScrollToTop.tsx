/**
 * ScrollToTop Component
 *
 * Scrolls to top of page when rendered.
 * Migrated from src/index/components/ScrollToTop.jsx
 */

import { useEffect } from 'react'

export function ScrollToTop(): null {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return null
}

export default ScrollToTop
