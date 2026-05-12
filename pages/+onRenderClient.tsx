export default onRenderClient

import React from 'react'
import { CacheProvider } from '@emotion/react'
import { hydrateRoot, createRoot, type Root } from 'react-dom/client'
import { navigate } from 'vike/client/router'
import type { PageContextClient } from 'vike/types'
import PageShell from './PageShell'
import { getClientEmotionCache } from '@/emotion/createEmotionCache'

/**
 * Client-side Rendering Hook (Vike v0.4.x API)
 *
 * Handles initial hydration and client-side navigation.
 * MUI + Emotion: same cache key as server (`getClientEmotionCache`).
 * @see https://vike.dev/onRenderClient
 */
let root: Root

async function onRenderClient(pageContext: PageContextClient) {
  const { Page, pageProps, redirectTo } = pageContext

  if (redirectTo) {
    navigate(redirectTo as string)
    return
  }

  const PageComponent = Page as React.ComponentType<Record<string, unknown>>
  const Layout =
    pageContext.config.Layout ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>) as React.ComponentType<{
      children: React.ReactNode
    }>

  const emotionCache = getClientEmotionCache()

  const page = (
    <CacheProvider value={emotionCache}>
      <PageShell pageContext={pageContext}>
        <Layout>
          <PageComponent {...pageProps} />
        </Layout>
      </PageShell>
    </CacheProvider>
  )

  const container = document.getElementById('root')
  if (!container) {
    throw new Error('DOM element #root not found')
  }

  if (container.innerHTML === '' || !pageContext.isHydration) {
    if (!root) {
      root = createRoot(container)
    }
    root.render(page)
  } else {
    root = hydrateRoot(container, page)
  }
}
