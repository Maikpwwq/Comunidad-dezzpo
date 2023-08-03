export { render }
export { passToClient }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { PageShell } from './PageShell'

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps', 'routeParams', 'urlPathname']

async function render(pageContext) {
    const { Page, pageProps } = pageContext
    console.log('pageAppContextServer', pageContext, Page, pageProps)
    // if (!Page)
    //     throw new Error(
    //         'My render() hook expects pageContext.Page to be defined'
    //     )
    const pageHtml = renderToString(
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>
    )

    // See https://vite-plugin-ssr.com/head
    const { documentProps } = pageContext.exports
    const title = (documentProps && documentProps.title) || 'Dezzpo'

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

    return { documentHtml }
}
