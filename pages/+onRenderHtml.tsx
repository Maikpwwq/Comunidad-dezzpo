export default onRenderHtml

import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { PageContextServer } from 'vike/types'
import PageShell from './PageShell'

/**
 * Server-side HTML Rendering Hook (Vike v0.4.x API)
 *
 * This hook is called on the server to generate the initial HTML.
 * @see https://vike.dev/onRenderHtml
 */
async function onRenderHtml(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext

  // Support SPA mode (no SSR)
  let pageHtml = ''

  // Debug SSR Config
  console.log(`[SSR] Rendering ${pageContext.urlPathname}`)
  console.log(`[SSR] Config.ssr:`, (pageContext.config as any).ssr)

  // Force disable SSR for problematic pages (Rescue Hatch)
  const NO_SSR_PATHS = ['/app/suscripciones', '/app/directorio-requerimientos']
  const forceNoSSR = NO_SSR_PATHS.some(path => pageContext.urlPathname.startsWith(path))

  // Enable SSR by default, disable if config.ssr === false OR forced off
  const ssrEnabled = (pageContext.config as any).ssr !== false && !forceNoSSR

  if (Page && ssrEnabled) {
    // Cast Page to React component type for JSX usage
    const PageComponent = Page as React.ComponentType<Record<string, unknown>>
    const Layout = pageContext.config.Layout || ((({ children }) => <>{children}</>) as any)
    const page = (
      <PageShell pageContext={pageContext}>
        <Layout>
          <PageComponent {...pageProps} />
        </Layout>
      </PageShell>
    )
    pageHtml = renderToString(page)
  }

  // Extract document metadata from page exports
  const { documentProps } = pageContext.exports as {
    documentProps?: { title?: string; description?: string }
  }
  const title = (documentProps && documentProps.title) || 'Comunidad Dezzpo'
  const description =
    (documentProps && documentProps.description) ||
    'Explora en Comunidad Dezzpo una red profesional confiable para todo tipo de trabajos, desde soluciones de mantenimiento e instalaciones pequeñas hasta acabados inmobiliarios y remodelaciones completas.'

  // Construct the full HTML document
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
    <meta
      name="google-site-verification"
      content="REnHKEnAbLteNvAbM-6EA7glPZ716CIqVB0kr3WGqqk"
    />
    <meta
      name="google-site-verification"
      content="hETiKkAOYvSL4UH3cG1jqhdDDa6y0FxvWbvp737mgN4"
    />
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
