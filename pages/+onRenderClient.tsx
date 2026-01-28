export default onRenderClient

import { hydrateRoot, createRoot, type Root } from 'react-dom/client'
import { navigate } from 'vike/client/router'
import type { PageContextClient } from 'vike/types'
import PageShell from './PageShell'

/**
 * Client-side Rendering Hook (Vike v0.4.x API)
 *
 * Handles initial hydration and client-side navigation.
 * @see https://vike.dev/onRenderClient
 */

let root: Root

async function onRenderClient(pageContext: PageContextClient) {
    const { Page, pageProps, redirectTo } = pageContext

    // Handle server-side redirects
    if (redirectTo) {
        navigate(redirectTo as string)
        return
    }

    // Cast Page to React component type for JSX usage
    const PageComponent = Page as React.ComponentType<Record<string, unknown>>
    const Layout = pageContext.config.Layout || ((({ children }: { children: React.ReactNode }) => <>{children}</>) as any)

    // Construct the page tree
    const page = (
        <PageShell pageContext={pageContext}>
            <Layout>
                <PageComponent {...pageProps} />
            </Layout>
        </PageShell>
    )

    // Get the root container
    const container = document.getElementById('root')
    if (!container) {
        throw new Error('DOM element #root not found')
    }

    // SPA mode or client-side navigation
    if (container.innerHTML === '' || !pageContext.isHydration) {
        if (!root) {
            root = createRoot(container)
        }
        root.render(page)
    } else {
        // SSR hydration
        root = hydrateRoot(container, page)
    }
}
