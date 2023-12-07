import { useLayoutEffect } from 'react'

const ScrollToTop = ({ pathname }) => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

export default ScrollToTop