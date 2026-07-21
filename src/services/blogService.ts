/**
 * Blog Service
 *
 * Cloud Firestore operations for blog posts, inbound marketing guides, and admin workbench.
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    increment,
    query,
    where,
    orderBy,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { BlogPost } from '@services/types'

const COLLECTION_NAME = 'blog_posts'

// Helper to generate clean URL slug
export function slugify(text: string): string {
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

/** Initial high-value inbound articles to seed if the collection is empty */
const INITIAL_BLOG_POSTS: Omit<BlogPost, 'id'>[] = [
    {
        slug: 'guia-definitiva-publicar-proyecto-propietario-dezzpo',
        title: 'Guía Definitiva: Cómo publicar tu proyecto en Dezzpo y encontrar al profesional calificado ideal',
        excerpt:
            'Aprende a describir tu requerimiento, recibir cotizaciones transparentes, verificar la experiencia de los comerciantes y proteger tu inversión en remodelaciones o mantenimiento.',
        coverImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
        category: 'Propietarios',
        targetAudience: 'propietario',
        authorName: 'Equipo de Experiencia Dezzpo',
        authorRole: 'Especialistas en Gestión Inmobiliaria',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        readTimeMinutes: 5,
        publishedAt: '2026-07-21T10:00:00Z',
        status: 'published',
        featured: true,
        viewsCount: 142,
        content: `
# Guía Definitiva para Propietarios y Residentes en Dezzpo

Realizar una remodelación, un trabajo de pintura, electricidad o mantenimiento en el hogar puede ser una experiencia llena de retos si no se cuenta con los aliados adecuados. En **Comunidad Dezzpo**, hemos diseñado un ecosistema transparente que conecta a propietarios con comerciantes examinados por sus competencias laborales.

---

## 1. Cómo describir tu Requerimiento con precisión

Para obtener cotizaciones realistas y ajustadas a tu presupuesto, sigue estas recomendaciones al crear tu proyecto:

- **Específica el alcance**: Indica las medidas aproximadas, el tipo de material deseado y las condiciones actuales de la zona a intervenir.
- **Adjunta fotos o planos**: Las imágenes ayudan a los profesionales a calcular el tiempo y las herramientas necesarias sin imprevistos.
- **Asocia tu Inmueble**: Si ya registraste tu propiedad en *"Mis Inmuebles"*, selecciónala para agilizar la ubicación geográfica y la logística del comerciante.

---

## 2. Evaluación de Cotizaciones y Perfiles Certificados

Cuando recibas propuestas en la plataforma, presta atención a los siguientes aspectos:

1. **Insignia "Profesional Certificado"**: Muestra que el comerciante aprobó el proceso de evaluación de competencias técnicas de Dezzpo.
2. **Reputación y Calificaciones de la Comunidad**: Revisa comentarios de otros propietarios que ya hayan contratado al profesional.
3. **Desglose de Costos**: Verifica si el monto incluye insumos, mano de obra o visitas de inspección preliminar.

---

## 3. Pagos Seguros y Firma de Contratos

Para garantizar la seguridad de ambas partes:
- Formaliza el servicio generando el **Contrato Digital Dezzpo**.
- Utiliza la pasarela integrada **ePayco** para realizar pagos trazables mediante tarjetas o PSE.
- Los fondos quedan respaldados con la garantía de cumplimiento y el soporte del sistema de disputas Dezzpo.

¡Publica tu primer requerimiento de forma totalmente gratuita y transforma tu espacio hoy mismo!
`,
    },
    {
        slug: 'como-hacer-crecer-tu-negocio-comerciantes-calificados-dezzpo',
        title: 'Cómo hacer crecer tu negocio de construcción: Guía para Comerciantes Calificados en Dezzpo',
        excerpt:
            'Descubre cómo crear un perfil destacado, obtener insignias de certificación, responder a requerimientos en tu zona y multiplicar tus ingresos con la Comunidad Dezzpo.',
        coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        category: 'Comerciantes',
        targetAudience: 'comerciante',
        authorName: 'Michael Arias Fajardo',
        authorRole: 'Fundador Comunidad Dezzpo',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        readTimeMinutes: 6,
        publishedAt: '2026-07-21T11:30:00Z',
        status: 'published',
        featured: false,
        viewsCount: 215,
        content: `
# Guía de Crecimiento Profesional para Comerciantes Calificados

En el sector de la construcción, remodelación y mantenimiento, la confianza es el activo más valioso. En **Comunidad Dezzpo**, brindamos a los contratistas e independientes las herramientas digitales para destacar, conseguir clientes calificados y formalizar sus ingresos.

---

## 1. Optimiza tu Perfil de Servicios

Tu perfil público es tu carta de presentación ante cientos de propietarios que buscan servicios en tu zona.

- **Sube fotos reales de tus proyectos**: Muestra imágenes del *"antes y después"* de tus trabajos anteriores con buena iluminación.
- **Define tus zonas de cobertura**: Configura si atiendes localidades específicas de Bogotá o municipios del área metropolitana.
- **Mantén actualizados tus datos de contacto y licencias**: Adjunta evidencias como certificación RETIE, alturas o ARL según tu disciplina.

---

## 2. Obtén la Certificación por Competencias

Los comerciantes que aprueban la evaluación de habilidades reciben la insignia de **"Profesional Certificado Dezzpo"**. Esta distinción:
- Aumenta hasta 3 veces la tasa de conversión en las cotizaciones enviadas.
- Otorga posicionamiento prioritario en el directorio de profesionales.
- Genera tranquilidad inmediata en los propietarios al momento de contratar.

---

## 3. Programa de Referidos y Bonificaciones

Aprovecha nuestro programa *"Voz a Voz"*:
- Comparte tu código único de referido con otros colegas y clientes.
- Acumula puntos canjeables por cupones de membresía y visibilidad destacada.

¡Forma parte de la red de comerciantes calificados líderes en Colombia!
`,
    },
]

/**
 * Seed initial blog posts if the collection is empty
 */
export async function seedDefaultBlogPosts(): Promise<void> {
    if (!isFirebaseAvailable() || !firestore) return

    try {
        const colRef = collection(firestore, COLLECTION_NAME)
        const snapshot = await getDocs(colRef)
        if (snapshot.empty) {
            console.log('[BlogService] Seeding initial onboarding guide posts...')
            for (const post of INITIAL_BLOG_POSTS) {
                const docRef = await addDoc(colRef, post)
                await updateDoc(docRef, { id: docRef.id })
            }
        }
    } catch (err) {
        console.error('Error seeding initial blog posts:', err)
    }
}

/**
 * Fetch all published blog posts for public marketing portal
 */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
    if (!isFirebaseAvailable() || !firestore) return INITIAL_BLOG_POSTS as BlogPost[]

    try {
        await seedDefaultBlogPosts()

        const colRef = collection(firestore, COLLECTION_NAME)
        const snapshot = await getDocs(colRef)
        const list = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
        })) as BlogPost[]

        const published = list.filter((p) => p.status === 'published')
        return published.sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
            return dateB - dateA
        })
    } catch (err) {
        console.error('Error fetching published blog posts:', err)
        return INITIAL_BLOG_POSTS as BlogPost[]
    }
}

/**
 * Fetch a single blog post by slug or document ID
 */
export async function getBlogPostBySlug(slugOrId: string): Promise<BlogPost | null> {
    if (!isFirebaseAvailable() || !firestore) {
        return (
            (INITIAL_BLOG_POSTS as BlogPost[]).find(
                (p) => p.slug === slugOrId || p.id === slugOrId
            ) || null
        )
    }

    try {
        const colRef = collection(firestore, COLLECTION_NAME)

        // Try lookup by doc ID
        try {
            const docSnap = await getDoc(doc(firestore, COLLECTION_NAME, slugOrId))
            if (docSnap.exists()) {
                return { ...docSnap.data(), id: docSnap.id } as BlogPost
            }
        } catch {}

        // Lookup by slug field
        const q = query(colRef, where('slug', '==', slugOrId))
        const snapshot = await getDocs(q)
        if (!snapshot.empty && snapshot.docs[0]) {
            const docSnap = snapshot.docs[0]
            return { ...docSnap.data(), id: docSnap.id } as BlogPost
        }

        // Fallback to initial static posts
        return (
            (INITIAL_BLOG_POSTS as BlogPost[]).find(
                (p) => p.slug === slugOrId || p.id === slugOrId
            ) || null
        )
    } catch (err) {
        console.error('Error fetching blog post by slug:', err)
        return null
    }
}

/**
 * Fetch all posts (including drafts) for admin workbench
 */
export async function getAllAdminBlogPosts(): Promise<BlogPost[]> {
    if (!isFirebaseAvailable() || !firestore) return INITIAL_BLOG_POSTS as BlogPost[]

    try {
        await seedDefaultBlogPosts()
        const colRef = collection(firestore, COLLECTION_NAME)
        const snapshot = await getDocs(colRef)
        const list = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
        })) as BlogPost[]

        return list.sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
            return dateB - dateA
        })
    } catch (err) {
        console.error('Error fetching admin blog posts:', err)
        return INITIAL_BLOG_POSTS as BlogPost[]
    }
}

/**
 * Create a new blog post (Admin action)
 */
export async function createBlogPost(data: Omit<BlogPost, 'id'>): Promise<string | null> {
    if (!isFirebaseAvailable() || !firestore) return null

    try {
        const colRef = collection(firestore, COLLECTION_NAME)
        const generatedSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title)
        const payload: Omit<BlogPost, 'id'> = {
            ...data,
            slug: generatedSlug,
            publishedAt: data.publishedAt || new Date().toISOString(),
            viewsCount: data.viewsCount || 0,
        }

        const docRef = await addDoc(colRef, payload)
        await updateDoc(docRef, { id: docRef.id })
        return docRef.id
    } catch (err) {
        console.error('Error creating blog post:', err)
        return null
    }
}

/**
 * Update an existing blog post (Admin action)
 */
export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !id) return false

    try {
        const docRef = doc(firestore, COLLECTION_NAME, id)
        const payload = { ...data }
        if (payload.title && !payload.slug) {
            payload.slug = slugify(payload.title)
        }
        await updateDoc(docRef, payload)
        return true
    } catch (err) {
        console.error('Error updating blog post:', err)
        return false
    }
}

/**
 * Delete a blog post (Admin action)
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
    if (!isFirebaseAvailable() || !firestore || !id) return false

    try {
        const docRef = doc(firestore, COLLECTION_NAME, id)
        await deleteDoc(docRef)
        return true
    } catch (err) {
        console.error('Error deleting blog post:', err)
        return false
    }
}

/**
 * Increment view count for a blog post
 */
export async function incrementPostViews(id: string): Promise<void> {
    if (!isFirebaseAvailable() || !firestore || !id) return
    try {
        const docRef = doc(firestore, COLLECTION_NAME, id)
        await updateDoc(docRef, { viewsCount: increment(1) })
    } catch {}
}
