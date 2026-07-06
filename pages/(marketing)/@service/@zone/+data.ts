import type { PageContextServer } from 'vike/types'
import { adminFirestore } from '@services/firebase/admin'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

export { data }
export type Data = Awaited<ReturnType<typeof data>>

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

function findCategoryBySlug(slug: string) {
    return ListadoCategorias.find(cat => {
        const labelSlug = slugify(cat.label)
        const rolSlug = slugify(cat.rol || '')
        
        if (labelSlug === slug || rolSlug === slug) return true
        if (rolSlug.endsWith('s') && rolSlug.slice(0, -1) === slug) return true
        
        // Manual override helper
        if (slug === 'electricista' && labelSlug === 'red-electrica') return true
        if (slug === 'soldador' && labelSlug === 'soldadura') return true
        if (slug === 'soldador-ornamental' && labelSlug === 'soldadura') return true
        if (slug === 'plomero' && labelSlug === 'plomeria') return true
        if (slug === 'pintor' && labelSlug === 'pintura') return true
        
        return false
    })
}

const zoneNames: Record<string, string> = {
    'bogota': 'Bogotá',
    'bogota-norte': 'Bogotá Norte',
    'bogota-sur': 'Bogotá Sur',
    'bogota-centro': 'Bogotá Centro',
    'bogota-occidente': 'Bogotá Occidente',
    'suba': 'Suba',
    'usaquen': 'Usaquén',
    'chapinero': 'Chapinero',
    'teusaquillo': 'Teusaquillo',
    'kennedy': 'Kennedy',
    'engativa': 'Engativá',
    'fontibon': 'Fontibón'
}

async function data(pageContext: PageContextServer) {
    const { service, zone } = pageContext.routeParams
    if (!service || !zone) {
        return {
            category: null,
            zoneName: 'Bogotá',
            directMatches: [],
            otherMatches: [],
            title: 'Servicio no encontrado',
            description: 'La categoría de servicio solicitada no existe.'
        }
    }

    const category = findCategoryBySlug(service)
    const zoneName = zoneNames[zone] || 'Bogotá'

    if (!category) {
        return {
            category: null,
            zoneName,
            directMatches: [],
            otherMatches: [],
            title: 'Servicio no encontrado',
            description: 'La categoría de servicio solicitada no existe.'
        }
    }

    const serviceName = category.label
    const rolName = category.rol || serviceName

    try {
        const querySnapshot = await adminFirestore
            .collection('usersComerciantesCalificados')
            .where('userCategories', 'array-contains', serviceName)
            .get()

        const allComerciantes: any[] = []
        querySnapshot.forEach(doc => {
            allComerciantes.push({ ...doc.data(), userId: doc.id })
        })

        // Separate matches by zone
        const directMatches: any[] = []
        const otherMatches: any[] = []

        const zoneKeyword = zone.replace('bogota-', '').toLowerCase()

        for (const comerciante of allComerciantes) {
            const address = (comerciante.userDirection || '').toLowerCase()
            const ubication = (comerciante.userUbication || '').toLowerCase()
            const description = (comerciante.userDescription || '').toLowerCase()

            const isDirectZone = 
                zone === 'bogota' || 
                address.includes(zoneKeyword) || 
                ubication.includes(zoneKeyword) || 
                description.includes(zoneKeyword)

            if (isDirectZone) {
                directMatches.push(comerciante)
            } else {
                otherMatches.push(comerciante)
            }
        }

        // Sort destacado profiles first in both arrays
        const tierSort = (a: any, b: any) => {
            const aDestacado = a.profileTier === 'destacado' ? 0 : 1
            const bDestacado = b.profileTier === 'destacado' ? 0 : 1
            return aDestacado - bDestacado
        }
        directMatches.sort(tierSort)
        otherMatches.sort(tierSort)

        const title = `${rolName} en ${zoneName} — Comunidad Dezzpo`
        const description = `Encuentra ${rolName.toLowerCase()} confiables en ${zoneName}. Consulta perfiles, calificaciones y datos de contacto directamente en Comunidad Dezzpo.`

        // Generate FAQs
        const faqs = [
            {
                question: `¿Cómo contactar un ${rolName.toLowerCase()} en ${zoneName}?`,
                answer: `Puedes ver los perfiles de los profesionales listados arriba y contactarlos directamente por teléfono o WhatsApp. Sus datos de contacto son públicos para todos los visitantes.`
            },
            {
                question: `¿Cuánto cuesta contratar servicios de ${serviceName.toLowerCase()} en ${zoneName}?`,
                answer: `Las tarifas dependen del tipo de trabajo y del alcance del proyecto. Te recomendamos hacer clic en el botón "Solicitar Cotización" del profesional para obtener un presupuesto detallado y sin compromiso.`
            },
            {
                question: `¿Qué garantía tienen los trabajos en Comunidad Dezzpo?`,
                answer: `Comunidad Dezzpo es un gremio de comerciantes calificados. Te sugerimos formalizar los acuerdos a través de nuestra plataforma generando un contrato de servicio, lo cual permite vincular los pagos y gestionar cualquier soporte o disputa.`
            }
        ]

        return {
            category,
            serviceName,
            rolName,
            zoneName,
            zoneSlug: zone,
            directMatches,
            otherMatches,
            title,
            description,
            faqs
        }
    } catch (err) {
        console.error('Error fetching comerciantes in +data.ts:', err)
        return {
            category: null,
            zoneName,
            directMatches: [],
            otherMatches: [],
            title: 'Error al cargar servicios',
            description: 'No se pudo cargar la lista de profesionales.'
        }
    }
}
