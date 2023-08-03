import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.VITEST

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop'

export async function createServer(
    root = process.cwd(),
    isProd = isProduction,
    hmrPort
) {
    const resolve = (p) => path.resolve(__dirname, p)

    const indexProd = isProd
        ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        : ''

    const app = express()

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite
    if (!isProd) {
        vite = await (
            await import('vite')
        ).createServer({
            root,
            logLevel: isTest ? 'error' : 'info',
            server: {
                middlewareMode: true,
                watch: {
                    // During tests we edit the files too fast and sometimes chokidar
                    // misses change events, so enforce polling for consistency
                    usePolling: true,
                    interval: 100,
                },
                hmr: {
                    port: hmrPort,
                },
            },
            appType: 'custom',
        })
        // use vite's connect instance as middleware
        app.use(vite.middlewares)
    } else {
        app.use((await import('compression')).default())
        // app.use(
        //     (await import('serve-static')).default(resolve('dist/client'), {
        //         index: false,
        //     })
        // )
        // Replace serve-static to sirv https://github.com/lukeed/sirv
        app.use((await import('sirv')).default(resolve('dist/client')))
    }

    // ...
    // Other middlewares (e.g. some RPC middleware such as Telefunc)
    // ...

    // Vite-plugin-ssr middleware. It should always be our last middleware (because it's a
    // catch-all middleware superseding any middleware placed after it).
    app.use('*', async (req, res, next) => {
        try {
            const url = req.originalUrl

            let template, render
            if (!isProd) {
                // always read fresh template in dev
                template = fs.readFileSync(resolve('index.html'), 'utf-8')
                template = await vite.transformIndexHtml(url, template)
                render = (
                    await vite.ssrLoadModule(
                        '/src/renderer/_default.page.server.jsx'
                    )
                ).render
            } else {
                template = indexProd
                // @ts-ignore
                render = (await import('./dist/server/entry-server.js')).render
            }

            const context = {}
            const appHtml = render(url, context)

            if (context.url) {
                // Somewhere a `<Redirect>` was rendered
                return res.redirect(301, context.url)
            }

            const html = template.replace(`<!--app-html-->`, appHtml)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            !isProd && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })

    return { app, vite }
}

const port = process.env.PORT || 5173

if (!isTest) {
    createServer().then(({ app }) =>
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`)
        })
    )
}
