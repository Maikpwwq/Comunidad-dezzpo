// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
//  - Consequently, the server needs be manually restarted when changing this file

// const express = require('express')
// const compression = require('compression')
// const { renderPage } = require('vike/server')
import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server'
import { root } from './root'

// import { auth } from '../src/firebase/firebaseClient'

const isProduction = process.env.NODE_ENV === 'production'

Error.stackTraceLimit = Infinity

startServer()

async function startServer() {
    const app = express()

    app.use(compression())

    // Vite integration
    if (isProduction) {
        // In production, we need to serve our static assets ourselves.
        // (In dev, Vite's middleware serves our static assets.)
        // const sirv = require('sirv')
        const sirv = (await import('sirv')).default
        app.use(sirv(`${root}/dist/client`))
    } else {
        // We instantiate Vite's development server and integrate its middleware to our server.
        // ⚠️ We instantiate it only in development. (It isn't needed in production and it
        // would unnecessarily bloat our server in production.)
        // const vite = require('vite')
        const vite = await import('vite')
        const viteDevMiddleware = (
            await vite.createServer({
                root,
                server: { middlewareMode: true },
            })
        ).middlewares
        app.use(viteDevMiddleware)
    }

    // ...
    // Other middlewares (e.g. some RPC middleware such as Telefunc)
    // ...

    // Vike middleware. It should always be our last middleware (because it's a
    // catch-all middleware superseding any middleware placed after it).
    // Express 5 uses path-to-regexp v8 which requires named wildcards
    app.get('/{*path}', async (req, res, next) => {
        // const user = auth?.currentUser
        const pageContextInit = {
            urlOriginal: req.originalUrl,
            // user
        }
        const pageContext = await renderPage(pageContextInit)
        const { httpResponse } = pageContext
        if (!httpResponse) return next()
        const { body, statusCode, earlyHints, headers } = httpResponse // replace ("Content-Type", contentType); deprecated by headers
        if (res.writeEarlyHints)
            res.writeEarlyHints({
                link: earlyHints.map((e) => e.earlyHintLink),
            })
        headers.forEach(([name, value]) => res.setHeader(name, value))
        res.status(statusCode).send(body)
    })

    const port = process.env.PORT || 3000
    app.listen(port)
    console.log(`Server running at http://localhost:${port}`)
}
