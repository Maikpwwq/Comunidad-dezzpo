import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './App'

export function render(url, context) {
    return renderToString(
        <StaticRouter location={url} context={context}>
            <App />
        </StaticRouter>
    )
}
