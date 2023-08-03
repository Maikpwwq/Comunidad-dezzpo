export { LayoutPaperbase }
import React from 'react'
import PropTypes from 'prop-types'
// import ScrollToTopOnMount from './ScrollToTop'
import { SliderAction } from '#@/pages/index/components/SliderAction'
import { FooterComunidad } from '#@/pages/index/components/footer/Footer'
import { MenuComunidad } from '#@/pages/index/components/menu/Menu'

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
