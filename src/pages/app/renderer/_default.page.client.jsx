export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { PageShell } from './PageShell'

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */

let reactRoot
async function render(pageContext) {
    const { Page, pageProps } = pageContext
    console.log('pageContextClient', pageContext)
    if (!Page)
        throw new Error(
            'Client-side render() hook expects pageContext.Page to be defined'
        )
    const page = (
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    )

    const reactRootElem = document.getElementById('react-root')
    if (!reactRootElem) throw new Error('DOM element #react-root not found')
    if (pageContext.isHydration) {
        reactRoot = hydrateRoot(reactRootElem, page)
    } else {
        if (!reactRoot) {
            reactRoot = createRoot(reactRootElem)
        }
        reactRoot.render(page)
    }
}
