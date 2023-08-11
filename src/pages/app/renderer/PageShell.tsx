export { PageShell }

import React from 'react'
// import PropTypes from 'prop-types'
// import { childrenPropType } from './PropTypeValues'
import type { PageContext } from './types'
import { LayoutPaperbase } from '#@/pages/app/components/LayoutPaperbase'
import { PageContextProvider } from './usePageContext'

import '#@/pages/app/renderer/Private-App.scss'
import '#R/index.scss'

// PageShell.propTypes = {
//     pageContext: PropTypes.any,
//     children: childrenPropType,
// }

function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
    // const Layout = LayoutPaperbase || pageContext.exports.Layout

    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <LayoutPaperbase>{children}</LayoutPaperbase>
            </PageContextProvider>
        </React.StrictMode>
    )
}