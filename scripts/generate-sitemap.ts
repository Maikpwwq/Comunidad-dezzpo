import admin from 'firebase-admin'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

// Helper to slugify text
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

const DOMAIN = 'https://comunidad-dezzpo.vercel.app'

// Static URLs
const staticUrls = [
    '/',
    '/nosotros',
    '/asi-trabajamos',
    '/comunidad-propietarios',
    '/comunidad-comerciantes',
    '/ayuda-pqrs',
    '/blog',
    '/contactenos',
    '/legal',
    '/presupuestos',
    '/apendice-costos',
    '/calificaciones',
    '/profesionales-servicios',
    '/app/portal-servicios',
    '/app/directorio-requerimientos'
]

// zones imported from ListadoZonas

// Import ListadoCategorias from ts/tsx source by reading it or using a manual list.
// To keep it simple and ultra-reliable at build time without compile errors, let's extract labels from the file or use a fallback list.
// Better yet, let's load it from the source file! Since tsx runs this, we can import ListadoCategorias directly!
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { zones } from '@assets/data/ListadoZonas'

async function generateSitemap() {
    console.log('Generating sitemap.xml...')

    // Initialize Admin SDK
    const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
    let db: admin.firestore.Firestore | null = null
    try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        })
        db = admin.firestore()
    } catch {
        console.warn('Firebase Admin credentials not found. Generating sitemap without database dynamic comerciantes.')
    }

    const urls: string[] = [...staticUrls]

    // 1. Generate Category × Zone URLs
    for (const cat of ListadoCategorias) {
        const serviceSlug = slugify(cat.label)
        if (serviceSlug) {
            for (const zone of zones) {
                urls.push(`/${serviceSlug}/${zone}`)
            }
        }
    }

    // 2. Fetch Comerciante URLs if DB is available
    if (db) {
        try {
            const snap = await db.collection('usersComerciantesCalificados').get()
            snap.forEach(doc => {
                const data = doc.data()
                const slug = data.userSlug || slugify(data.userName || '')
                if (slug) {
                    urls.push(`/comerciante/${slug}`)
                }
            })
        } catch (err) {
            console.error('Error fetching comerciantes for sitemap:', err)
        }
    }

    // Generate XML content
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    const xmlFooter = '</urlset>'
    const xmlEntries = urls.map(url => {
        const fullUrl = `${DOMAIN}${url.startsWith('/') ? url : '/' + url}`
        return `  <url>\n    <loc>${fullUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${url === '/' ? '1.0' : '0.8'}</priority>\n  </url>`
    }).join('\n')

    const xmlContent = `${xmlHeader}\n${xmlEntries}\n${xmlFooter}`

    // Write to public/
    const publicPath = resolve(process.cwd(), 'public', 'sitemap.xml')
    writeFileSync(publicPath, xmlContent, 'utf-8')
    console.log(`✓ Sitemap written to: ${publicPath} (${urls.length} URLs)`)

    // Write to dist/client/ if directory exists
    const distPath = resolve(process.cwd(), 'dist', 'client', 'sitemap.xml')
    try {
        if (!existsSync(dirname(distPath))) {
            mkdirSync(dirname(distPath), { recursive: true })
        }
        writeFileSync(distPath, xmlContent, 'utf-8')
        console.log(`✓ Sitemap written to: ${distPath}`)
    } catch (e) {
        console.log('Skipped writing to dist/client/sitemap.xml (directory not built yet)')
    }
}

generateSitemap().catch(console.error)
