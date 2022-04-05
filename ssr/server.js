const path = require('path')
import express from 'express'
import dotenv from 'dotenv'
import webpack from 'webpack'
import helmet from 'helmet'

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import renderApp from './renderApp'
import getManifest from './getManifest'

dotenv.config()
const { ENV, PORT } = process.env

const app = express()

if (ENV === 'development') {
    console.log('Development config')
    // const { publicPath } = webpackConfig.output;
    const compiler = webpack(webpackConfig)
    const serverConfig = { serverSideRender: true } // Dev middleware  publicPath: publicPath
    app.use(webpackDevMiddleware(compiler, serverConfig))
    app.use(webpackHotMiddleware(compiler))
} else {
    app.use((req, res, next) => {
        if (!req.hashManifest) req.hashManifest = getManifest()
        next()
    })
    app.use(express.static(path.join(__dirname, '/build')))
    app.use(helmet())
    // app.use(
    //   helmet.contentSecurityPolicy({
    //     directives: {
    //       'default-src': ["'self'"],
    //       'script-src': ["'self'", "'sha256-lKtLIbt/r08geDBLpzup7D3pTCavi4hfYSO45z98900='"],
    //       'img-src': ["'self'", 'http://dummyimage.com'],
    //       'style-src-elem': ["'self'", 'https://fonts.googleapis.com'],
    //       'font-src': ['https://fonts.gstatic.com'],
    //       'upgradeInsecureRequest': [],
    //       'media-src': ['*'],
    //     },
    //   }),
    // );
    // app.use(
    //   helmet({
    //     contentSecurityPolicy: false,
    //   }),
    // );
    app.use(helmet.permittedCrossDomainPolicies())
    app.disable('x-powered-by')
    // app.set("x-powered-by", false);
}
renderApp(app)

app.listen(PORT, (err, res) => {
    if (err) console.log(err)
    else {
        console.log(
            `Server running on mode ${ENV}, on url http://localhost:${PORT}`
        )
    }
})
