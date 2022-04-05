import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { StaticRouter } from 'react-router-dom/server'
import serverRoutes from './routes/serverRoutes'
// import reducer from '../src/reducers/reducers'
// import initialState from '../src/initialState'

const setResponse = (html, preloadedState, manifest) => {
    const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css'
    const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js'
    const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js'

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="${mainStyles}" type="text/css"/>
        <title>Comunidad Dezzpo</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script >
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
              /</g,
              '\\u003c'
          )},
        </script>
        <script src="${mainBuild}" type="text/javascript"></script>
        <script src="${vendorBuild}" type="text/javascript"></script>
      </body>
    </html>
    `
}

const renderApp = (app) => {
    app.get('*', (req, res) => {
        const store = createStore() // reducer, initialState
        const Routing = serverRoutes
        const html = renderToString(
            <Provider store={store}>
                <StaticRouter location={req.url} context={{}}>
                    <Routing />
                </StaticRouter>
            </Provider>
        )
        const finalState = store.getState()
        res.send(setResponse(html, finalState, req.hashManifest))
    })
}

export default renderApp
