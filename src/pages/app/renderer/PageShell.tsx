export { PageShell }

import React from 'react'
import type { PageContext } from './types'
import { LayoutAppPaperbase } from '#@/pages/app/components/LayoutAppPaperbase'
import { PageContextProvider } from './usePageContext'

import { Providers } from './Providers'

import '#@/pages/app/renderer/Private-App.scss'
import '#R/index.scss'


function PageShell({
    children,
    pageContext,
}: {
    children: React.ReactNode
    pageContext: PageContext
}) {

    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <Providers>
                    <LayoutAppPaperbase>{children}</LayoutAppPaperbase>
                </Providers>
            </PageContextProvider>
        </React.StrictMode>
    )
}
