export default onRenderHtml

import React from 'react'
import { renderToString } from 'react-dom/server'
import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { PageContextServer } from 'vike/types'
import PageShell from './PageShell'
import { createEmotionCache } from '@/emotion/createEmotionCache'

/**
 * Server-side HTML Rendering Hook (Vike v0.4.x API)
 *
 * This hook is called on the server to generate the initial HTML.
 * MUI + Emotion: per-request cache, critical CSS extracted to <head> (see MUI server rendering guide).
 * @see https://vike.dev/onRenderHtml
 * @see https://mui.com/material-ui/guides/server-rendering/
 */
async function onRenderHtml(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext

  let pageHtml = ''
  let emotionStyleTags = ''

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[SSR] Rendering ${pageContext.urlPathname}`)
    console.log(`[SSR] Config.ssr:`, (pageContext.config as { ssr?: boolean }).ssr)
  }

  const ssrEnabled = (pageContext.config as { ssr?: boolean }).ssr !== false

  if (Page && ssrEnabled) {
    const PageComponent = Page as React.ComponentType<Record<string, unknown>>
    let LayoutComponent = pageContext.config.Layout
    if (LayoutComponent && typeof LayoutComponent !== 'function') {
      LayoutComponent = (LayoutComponent as any).default || (LayoutComponent as any).Layout
    }
    const Layout = (LayoutComponent || (({ children }: { children: React.ReactNode }) => <>{children}</>)) as React.ComponentType<{
      children: React.ReactNode
    }>

    const emotionCache = createEmotionCache()
    const emotionServer = createEmotionServer(emotionCache)

    try {
      const app = (
        <CacheProvider value={emotionCache}>
          <PageShell pageContext={pageContext}>
            <Layout>
              <PageComponent {...pageProps} />
            </Layout>
          </PageShell>
        </CacheProvider>
      )
      const markup = renderToString(app)
      const emotionChunks = emotionServer.extractCriticalToChunks(markup)
      emotionStyleTags = emotionServer.constructStyleTagsFromChunks(emotionChunks)
      pageHtml = emotionChunks.html
    } catch (error) {
      console.error('[SSR] Error rendering page, falling back to CSR:', error)
    }
  }

  const exports = pageContext.exports || {}
  const { documentProps } = exports as {
    documentProps?: { title?: string; description?: string }
  }
  const title =
    (pageContext.data as any)?.title ||
    (pageContext.config as any).title ||
    (documentProps && documentProps.title) ||
    'Comunidad Dezzpo'
  const description =
    (pageContext.data as any)?.description ||
    (pageContext.config as any).description ||
    (documentProps && documentProps.description) ||
    'Explora en Comunidad Dezzpo una red profesional confiable para todo tipo de trabajos, desde soluciones de mantenimiento e instalaciones pequeñas hasta acabados inmobiliarios y remodelaciones completas.'

  // Emotion critical CSS after Bootstrap so MUI `sx` / component styles win over Bootstrap where both apply.
  const documentHtml = escapeInject`<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="author" content="Michael Arias Fajardo" />
    <meta name="description" content="${description}" />
    <meta
      name="keywords"
      content="Contratistas de mantenimiento residencial confiables, Red profesional confiable, Contratista calificado ideal, Proyecto en tu hogar a un clic"
    />
    <meta name="google-site-verification" content="YR9BPQLIFQ3lXvQgOQNJp6b6llUUWUHwM3toS-US5P8" />
    <link
      rel="icon"
      type="image/png"
      href="/assets/img/logo/Logo-Comunidad-Dezzpo.png"
      sizes="32x32"
    />
    <link rel="apple-touch-icon" sizes="180x180" href="/logos/apple-icon-180x180.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/logos/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/logos/favicon-16x16.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <title>${title}</title>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="/assets/img/logo/Logo-Comunidad-Dezzpo.png" />
    <meta property="og:locale" content="es_CO" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:site_name" content="Comunidad Dezzpo" />
    <meta property="og:image" content="/assets/img/logo/Logo-Comunidad-Dezzpo.png" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    ${dangerouslySkipEscape(emotionStyleTags)}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
  </body>
</html>`

  return {
    documentHtml,
    pageContext: {},
  }
}
