export { ScrollToTop }
import { useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

const ScrollToTop = ({ pathname }) => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

ScrollToTop.propTypes = {
    pathname: PropTypes.string,
}
