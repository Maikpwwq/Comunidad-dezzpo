export { PageShell }

import React from 'react'
import PropTypes from 'prop-types'
import { childrenPropType } from './PropTypeValues'
import { LayoutPaperbase } from '#@/pages/index/components/LayoutPaperbase'
import { PageContextProvider } from './usePageContext'
import '#@/renderer/App.scss'
import '#@/index.scss'

function PageShell({ children, pageContext }) {
    const Layout = LayoutPaperbase || pageContext.exports.Layout

    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <Layout>{children}</Layout>
            </PageContextProvider>
        </React.StrictMode>
    )
}

PageShell.propTypes = {
    children: childrenPropType,
    pageContext: PropTypes.any,
}
