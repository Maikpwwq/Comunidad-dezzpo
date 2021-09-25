const path = require('path')
const { resolve } = require('path')
// const HttpStatus = require('http-status')
// Koa
const Koa = require('koa')
const KoaRouter = require('koa-router')
// const reactRouter = require('koa-react-router')
const json = require('koa-json')
// const view = require('koa-views')
// const render = require('koa-ejs')
const cors = require('koa-cors')
const Logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const mount = require('koa-mount')
// const session = require('koa-session2')
const KoaBody = require('koa-body')
// Webpack
const config = require('../config/webpack.dev.js')
// const KoaWebpack = require('koa-webpack')

// Koa Webpack middleware
// const middleware = KoaWebpack({ config })
// app.use(middleware)

const webpack = require('webpack')
const { webpackServer } = require('koa-webpack-server')
const options = {
    compilers: webpack(config),
    dev: {
        noInfo: false,
        quiet: false,
        serverSideRender: true,
    },
}

// Variables
const PORT = process.env.PORT || 8080
// const DIST_DIR = __dirname
// const HTML_FILE = path.join(DIST_DIR, 'index.html')

// Implementation Koa
const app = new Koa()
const router = new KoaRouter()

// Servir juntos servicios en el mismo puerto - Serve the build directory
// Este koa-static debe usarse, de lo contrario, al importar el archivo js en la vista,
// usar una importación de ruta relativa causará problemas
const static_pages = new Koa()
static_pages.use(serve(path.resolve(__dirname, 'dist/')))
app.use(mount('/', static_pages))

// Json prettier middleware
app.use(json())

// bodyparser middleware
app.use(bodyParser())
app.use(Logger())
// polyfills middleware
app.use(cors())

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFileSize: 1000 * 1024 * 1024,
        },
        patchKoa: true,
    })
)

//Routes
// app.get('*', async function(ctx, next) {
//     var html = fs.readFileSync(path.resolve('./build/index.html'))
//     ctx.type = 'html'
//     ctx.body = html
// })
// router.get('/tets', ctx => ( ctx.body = "Hello test"))
// router.get('/book', async (ctx, next) => {
//     const books = [
//         'Speaking javascript',
//         'Fluent Python',
//         'Pro Python',
//         'The Go programming language',
//     ]
//     ctx.status = HttpStatus.OK
//     ctx.body = books
//     await next()
// })
// Pagina bienvenida // redirect
router.get('/', index)
async function index(ctx) {
    await ctx.render('index')
}
// Pagina de Asi Trabajamos
router.get('/asi-trabajamos', showAsiTrabajamos)
async function showAsiTrabajamos(ctx) {
    await ctx.render('asi-trabajamos')
}

const users = require(resolve(__dirname, 'routes', 'users'))
app.use(mount('/users', users))

// Router middleware
app.use(router.routes(), router.allowedMethods())

// wire webpack-dev-middleware、webpack-hot-middleware to app and start webpack-hot-server
webpackServer(app, options)
    .then(({ middlewares }) => {
        const { logger, render } = middlewares

        // apply middlewares
        app.use(logger)
        app.use(render)
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}!\n`)
            console.log(`Environment: ${process.env.NODE_ENV}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })

// absolute paths
// app.use(serve(path.resolve(__dirname, '/test/fixtures')))

// const Store = require('./models/redis');
// const router = require('./routes/index');
// const App = require("../src/routes/rutas");

// app.use(
//     reactRouter({
//         App,
//         onError: (ctx, err) => console.log('I Have failed!!!!'),
//         onRedirect: (ctx, redirect) => console.log('I have redirected!'),
//         onRender: (ctx) => ({ Container }),
//     })
// )

// Reemplazar contenido de base de datos
// const things = ['Familia', 'Musica', 'programar']

// ejs middleware
// render(app, {
//     root: path.join(__dirname, 'dist'),
//     layout: 'index',
//     viewExt: 'html',
//     cache: false,
//     debug: false,
// })

// views middleware
// app.use(view(path.resolve(__dirname, './pages/')), {
//     extension: 'ejs',
// })

// Configurar middleware de sesión
// app.use(
//     session({
//         store: new Store(),
//         key: 'SessionId',
//         maxAge: 86400000,
//         domain: 'localhost',
//         path: '/',
//     })
// )

// Koa Webpack middleware
/*
const options = { 
  hotClient: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    hotOnly: true,
    host: 'localhost',
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    hmr: true
  },
  devMiddleware: {
    dynamicPublicPath: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }
};

// Using with html-webpack-plugin
app.use(async (ctx) => {
  const filename = path.resolve(webpackConfig.output.path, 'index.html')
  ctx.response.type = 'html'
  ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
});
*/
