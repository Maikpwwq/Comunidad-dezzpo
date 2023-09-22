import React from 'react'
import type { PageContext } from './types'
// import logo from './logo.svg'
// import './PageShell.css'
import { PageContextProvider } from './usePageContext'
// import { Link } from './Link'
import { LayoutPaperbase } from '#@/index/components/LayoutPaperbase'
// import createEmotionCache from './createEmotionCache';
import { UserAuthProvider } from '#@/providers/UserAuthProvider'

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
    const Layout = pageContext.exports.Layout || LayoutPaperbase
    //const cache = createEmotionCache();

    return (
        <React.StrictMode>
            {/* <CacheProvider value={cache}> */}
            <UserAuthProvider>
                <PageContextProvider pageContext={pageContext}>
                    <Layout>{children}</Layout>
                </PageContextProvider>
            </UserAuthProvider>
            {/* </CacheProvider> */}
        </React.StrictMode>
    )
}
