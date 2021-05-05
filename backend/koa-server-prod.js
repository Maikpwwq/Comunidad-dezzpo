const path = require('path');
const HttpStatus = require("http-status");

// Koa
const Koa = require('koa');
const KoaRouter = require('koa-router');
const reactRouter = require('koa-react-router');
const json = require('koa-json');
const view = require('koa-views');
const render = require('koa-ejs');
const cors = require('koa-cors');
const Logger = require("koa-logger");
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const mount = require("koa-mount");
const session = require('koa-session2');
const KoaBody = require('koa-body')

// const Store = require('./models/redis');
// const router = require('./routes/index');
// const App = require("../src/routes/rutas");

const PORT = process.env.PORT || 8080;
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

const app = new Koa();

// Servir juntos servicios en el mismo puerto
const static_pages = new Koa();
static_pages.use(serve(__dirname + "build")); //serve the build directory
app.use(mount("/", static_pages));

const router = new KoaRouter();

app.use(reactRouter({
  App,
  onError: (ctx, err) => console.log('I Have failed!!!!'),
  onRedirect: (ctx, redirect) => console.log('I have redirected!'),
  onRender: (ctx) => ({ Container })
}));

// Reemplazar contenido de base de datos
const things = ["Familia", 'Musica', "programar"];

// Json prettier middleware
app.use(json());

// bodyparser middleware
app.use(bodyParser());
app.use(Logger());
// polyfills middleware
app.use(cors());
// ejs middleware
render(app, {
  root: path.join(__dirname, 'views'), 
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
})

// views middleware
app.use(view(path.resolve(__dirname, './pages/')), {
  extension: 'ejs'
});

// Configurar middleware de sesión
app.use(
  session({
    store: new Store(),
    key: 'SessionId',
    maxAge: 86400000,
    domain: 'localhost',
    path: '/'
  })
);

app.use(
  KoaBody({
    multipart: true,
    formidable: {
      maxFileSize: 1000 * 1024 * 1024
    },
    patchKoa: true
  })
);

//Routes
app.get('*', (req, res) => {
  res.sendFile(HTML_FILE)
});
router.get('/', index);
router.get('/asi-trabajamos', showAsiTrabajamos);
router.get("/book",async (ctx,next)=>{
  const books = [
    "Speaking javascript", 
    "Fluent Python", 
    "Pro Python", 
    "The Go programming language"
  ];
  ctx.status = HttpStatus.OK;
  ctx.body = books;
  await next();
});
// Pagina bienvenida
async function index(ctx) {
  await ctx.render('index');
}
// Pagina de 
async function showAsiTrabajamos(ctx) {
  await ctx.render('asi-trabajamos');
}

// Este koa-static debe usarse, de lo contrario, al importar el archivo js en la vista, usar una importación de ruta relativa causará problemas
app.use(serve(path.resolve(__dirname, 'dist/')));
// absolute paths
// app.use(serve(__dirname + '/test/fixtures'));

// Router middleware
app.use(router.routes(), router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!\n`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});