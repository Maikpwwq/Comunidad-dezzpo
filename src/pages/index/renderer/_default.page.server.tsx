export { render }
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'routeParams']

import { renderToString } from 'react-dom/server'
import { PageShell } from './PageShell'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import type { PageContextServer } from './types'
import React from 'react'
// import logoUrl from './logo.svg'
// <link rel="icon" href="${logoUrl}" />

// import createEmotionCache from './createEmotionCache';
// import createEmotionServer from '@emotion/server/create-instance';

async function render(pageContext: PageContextServer) {
    // const cache = createEmotionCache();
    // const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    //     createEmotionServer(cache);
    let pageHtml
    // let emotionCss
    if (!pageContext.Page) {
        // SPA
        pageHtml = ''
    } else {
        // SSR / HTML-only
        const { Page, pageProps } = pageContext
        // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
        // if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined')
        // console.log('pageIndexContextServer', Page, pageProps)
        const page = (
            <PageShell pageContext={pageContext}>
                <Page {...pageProps} />
            </PageShell>
        )

        pageHtml = renderToString(page)

        // Grab the CSS from emotion
        // const emotionChunks = extractCriticalToChunks(pageHtml);
        // emotionCss = constructStyleTagsFromChunks(emotionChunks);
    }

    // See https://vite-plugin-ssr.com/head
    const { documentProps } = pageContext.exports
    const title = (documentProps && documentProps.title) || 'Comunidad Dezzpo'
    const desc =
        (documentProps && documentProps.description) ||
        'Explora en Comunidad Dezzpo una red profesional confiable para todo tipo de trabajos, desde soluciones de mantenimiento e instalaciones pequeñas hasta acabados inmobiliarios y remodelaciones completas. Nuestro marketplace te ofrece la posibilidad de elegir contratistas especializados con estadísticas verificadas. ¡Únete ahora y comienza a hacer realidad tus proyectos!'

    // ${emotionCss}
    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Michael Arias Fajardo" />
        <meta name="description" content="${desc}" />
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
            rel="icon"
            type="image/png"
            href="/assets/img/logo/Logo-Comunidad-Dezzpo.png"
            sizes="32x32"
        />
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
            rel="apple-touch-icon"
            sizes="57x57"
            href="/logos/apple-icon-57x57.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/logos/apple-icon-60x60.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/logos/apple-icon-72x72.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/logos/apple-icon-76x76.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/logos/apple-icon-114x114.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/logos/apple-icon-120x120.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/logos/apple-icon-144x144.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/logos/apple-icon-152x152.png"
        />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/logos/apple-icon-180x180.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/logos/android-icon-192x192.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/logos/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/logos/favicon-96x96.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/logos/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <title>${title}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Make-col" />
        <meta name="twitter:creator" content="@Make-col" />
        <meta name="twitter:title" content="Comunidad Dezzpo" />
        <meta
            name="twitter:description"
            content="${desc}"
        />
        <meta
            name="twitter:image"
            type="image/png"
            content="/assets/img/logo/Logo-Comunidad-Dezzpo.png"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta
            property="og:description"
            content="${desc}"
        />
        <meta property="og:url" content="#" />
        <meta property="og:site_name" content="${title}" />
        <meta      
            property="og:image"
            type="image/png"
            content="/assets/img/logo/logo-Comunidad-Dezzpo.png"
        />
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
            crossorigin="anonymous"
        />
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

    return {
        documentHtml,
        pageContext: {
            // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
        },
    }
}
