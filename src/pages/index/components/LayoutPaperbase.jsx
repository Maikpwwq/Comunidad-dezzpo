export { LayoutPaperbase }

// import ScrollToTopOnMount from './ScrollToTop'
import PropTypes from 'prop-types'
import { SliderAction } from './SliderAction'
import { FooterComunidad } from '#P/index/components/footer/Footer'
import { MenuComunidad } from '#P/index/components/menu/Menu'

function LayoutPaperbase({ children }) {
    return (
        <>
            <MenuComunidad />
            {/* <ScrollToTopOnMount /> */}
            <SliderAction />
            {children}
            <FooterComunidad />
        </>
    )
}

LayoutPaperbase.propTypes = {
    children: PropTypes.any,
}
