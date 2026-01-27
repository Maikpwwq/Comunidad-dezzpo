import React from 'react'
import type { PageContext } from './types'
// import logo from './logo.svg'
// import './PageShell.css'
import PageContextProvider from './usePageContext'
// import Link from './Link'
// export { Layout } from '@index/components/LayoutPaperbase'
// import { Layout } from '#@/index/layouts/IndexLayout'

// import createEmotionCache from './createEmotionCache';
import { UserAuthProvider } from '@providers/UserAuthProvider'

import './App.scss'
import './index.scss'

export default PageShell

function PageShell({
    children,
    pageContext,
}: {
    children: React.ReactNode
    pageContext: PageContext
}) {
    // const PageLayout = pageContext.exports.Layout || Layout
    //const cache = createEmotionCache();

    return (
        <React.StrictMode>
            {/* <CacheProvider value={cache}> */}
            <UserAuthProvider>
                <PageContextProvider pageContext={pageContext}>
                    {/* <PageLayout></PageLayout> */}
                    {children}
                </PageContextProvider>
            </UserAuthProvider>
            {/* </CacheProvider> */}
        </React.StrictMode>
    )
}
