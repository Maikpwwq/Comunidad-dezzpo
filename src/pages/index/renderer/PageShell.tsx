import React from 'react'
import type { PageContext } from './types'
// import logo from './logo.svg'
// import './PageShell.css'
import { PageContextProvider } from './usePageContext'
// import { Link } from './Link'
import { LayoutPaperbase } from '#P/index/components/LayoutPaperbase'
// import createEmotionCache from './createEmotionCache';

import './App.scss'
import './index.scss'

export { PageShell }


function PageShell({
    children,
    pageContext,
}: {
    children: React.ReactNode
    pageContext: PageContext
}) {
    // const Layout = LayoutPaperbase || pageContext.exports.Layout
    //const cache = createEmotionCache();

    return (
        <React.StrictMode>
            {/* <CacheProvider value={cache}> */}
            <PageContextProvider pageContext={pageContext}>
                <LayoutPaperbase>{children}</LayoutPaperbase>
            </PageContextProvider>
            {/* </CacheProvider> */}
        </React.StrictMode>
    )
}