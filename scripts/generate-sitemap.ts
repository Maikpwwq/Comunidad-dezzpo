import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { zones } from '@assets/data/ListadoZonas'

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '')
}

const DOMAIN = 'https://comunidad-dezzpo.vercel.app'
const TODAY = new Date().toISOString().split('T')[0]

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
    '/app/directorio-requerimientos',
]

// Fallback blog post slugs if DB is not available at build time
const fallbackBlogSlugs = [
    'guia-definitiva-publicar-proyecto-propietario-dezzpo',
    'como-hacer-crecer-tu-negocio-comerciantes-calificados-dezzpo',
]

async function generateSitemap() {
    console.log('Generating sitemap.xml and sitemap.xsl...')

    // Initialize Admin SDK
    const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
    let db: Firestore | null = null
    try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
        const app = initializeApp({
            credential: cert(serviceAccount),
        })
        db = getFirestore(app)
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

    // 2. Fetch Blog Posts & Comerciantes if DB is available
    if (db) {
        try {
            const blogSnap = await db.collection('blog_posts').get()
            if (!blogSnap.empty) {
                blogSnap.forEach((doc: any) => {
                    const data = doc.data()
                    if (data.status === 'published' && data.slug) {
                        urls.push(`/blog/${data.slug}`)
                    }
                })
            } else {
                fallbackBlogSlugs.forEach((slug) => urls.push(`/blog/${slug}`))
            }
        } catch (err) {
            console.error('Error fetching blog posts for sitemap:', err)
            fallbackBlogSlugs.forEach((slug) => urls.push(`/blog/${slug}`))
        }

        try {
            const snap = await db.collection('usersComerciantesCalificados').get()
            snap.forEach((doc: any) => {
                const data = doc.data()
                const slug = data.userSlug || slugify(data.userName || '')
                if (slug) {
                    urls.push(`/comerciante/${slug}`)
                }
            })
        } catch (err) {
            console.error('Error fetching comerciantes for sitemap:', err)
        }
    } else {
        fallbackBlogSlugs.forEach((slug) => urls.push(`/blog/${slug}`))
    }

    // Generate XML content with XSLT stylesheet & lastmod
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
    const xmlFooter = '</urlset>'
    const xmlEntries = urls
        .map((url) => {
            const fullUrl = `${DOMAIN}${url.startsWith('/') ? url : '/' + url}`
            const priority = url === '/' ? '1.0' : url.startsWith('/blog/') ? '0.9' : '0.8'
            return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`
        })
        .join('\n')

    const xmlContent = `${xmlHeader}\n${xmlEntries}\n${xmlFooter}`

    // Write sitemap.xml to public/
    const publicPath = resolve(process.cwd(), 'public', 'sitemap.xml')
    writeFileSync(publicPath, xmlContent, 'utf-8')
    console.log(`✓ Sitemap written to: ${publicPath} (${urls.length} URLs)`)

    // Ensure sitemap.xsl is copied to dist/client/ if dist exists
    const distSitemapXml = resolve(process.cwd(), 'dist', 'client', 'sitemap.xml')
    const distSitemapXsl = resolve(process.cwd(), 'dist', 'client', 'sitemap.xsl')
    const publicSitemapXsl = resolve(process.cwd(), 'public', 'sitemap.xsl')

    try {
        if (!existsSync(dirname(distSitemapXml))) {
            mkdirSync(dirname(distSitemapXml), { recursive: true })
        }
        writeFileSync(distSitemapXml, xmlContent, 'utf-8')
        if (existsSync(publicSitemapXsl)) {
            copyFileSync(publicSitemapXsl, distSitemapXsl)
        }
        console.log(`✓ Sitemap and XSL stylesheet written to: dist/client/`)
    } catch (e) {
        console.log('Skipped writing to dist/client/ (directory not built yet)')
    }
}

generateSitemap().catch(console.error)
