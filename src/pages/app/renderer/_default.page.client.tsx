export { render }

//  To enable Client-side Routing:
export const clientRouting = true
export const prefetchStaticAssets = 'viewport'
export const hydrationCanBeAborted = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */

import { hydrateRoot, createRoot, Root } from 'react-dom/client'
import { navigate } from 'vite-plugin-ssr/client/router'
import { PageShell } from './PageShell'
import type { PageContextClient } from './types'
import React from 'react'

let root: Root
// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
async function render(pageContext: PageContextClient) {
    const { Page, pageProps, redirectTo } = pageContext
    // if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined')
    if (redirectTo) {
        navigate(redirectTo)
        return
    }
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
