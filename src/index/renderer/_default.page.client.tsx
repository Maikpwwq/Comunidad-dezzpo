export { render }

//  To enable Client-side Routing:
export const clientRouting = true
export const prefetchStaticAssets = 'viewport'
export const hydrationCanBeAborted = true
// !! WARNING !! Before doing so, read https://vike.dev/clientRouting */

import { hydrateRoot, createRoot, Root } from 'react-dom/client'
import { navigate } from 'vike/client/router'
import { PageShell } from './PageShell'
import type { PageContextClient } from './types'
import React from 'react'

let root: Root
// This render() hook only supports SSR, see https://vike.dev/render-modes for how to modify render() to support SPA
async function render(pageContext: PageContextClient) {
    const { Page, pageProps, redirectTo } = pageContext
    // console.log('pageContextClient', Page, pageProps)
    if (redirectTo) {
        navigate(redirectTo)
        return
    }
    // if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined')
    const page = (
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    )
    const container = document.getElementById('react-root')
    if (!container) throw new Error('DOM element #react-root not found')
    // SPA
    if (container.innerHTML === '' || !pageContext.isHydration) {
        if (!root) {
            root = createRoot(container)
        }
        root.render(page)
        // SSR
    } else {
        root = hydrateRoot(container, page)
    }
}
