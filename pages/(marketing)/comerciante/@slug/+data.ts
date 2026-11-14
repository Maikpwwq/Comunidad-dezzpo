import type { PageContextServer } from 'vike/types'
import { adminFirestore } from '@services/firebase/admin'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

export { data }
export type Data = Awaited<ReturnType<typeof data>>

async function data(pageContext: PageContextServer) {
    const { slug } = pageContext.routeParams
    if (!slug) {
        return {
            comerciante: null,
            title: 'Perfil no encontrado',
            description: 'El perfil solicitado no existe.'
        }
    }

    try {
        const querySnapshot = await adminFirestore
            .collection('usersComerciantesCalificados')
            .where('userSlug', '==', slug)
            .limit(1)
            .get()

        if (querySnapshot.empty) {
            return {
                comerciante: null,
                title: 'Perfil no encontrado',
                description: 'El perfil solicitado no existe.'
            }
        }

        const doc = querySnapshot.docs[0]!
        const raw = doc.data()
        const comerciante = { ...raw, userId: doc.id } as any

        // Map categories to chips
        let userCategoriesChips: any[] = []
        if (comerciante.userCategories && Array.isArray(comerciante.userCategories)) {
            userCategoriesChips = comerciante.userCategories.map((chip: any) => {
                const found = ListadoCategorias.find((cat: any) => cat.label === chip)
                return found || null
            }).filter((item: any) => item !== null)
        }

        // Fetch structured projects for this comerciante (ADR Option C)
        let structuredProjects: any[] = []
        try {
            const projectsSnapshot = await adminFirestore
                .collection('projects')
                .where('comercianteId', '==', doc.id)
                .limit(6)
                .get()

            if (!projectsSnapshot.empty) {
                structuredProjects = projectsSnapshot.docs.map((pDoc: any) => ({
                    ...pDoc.data(),
                    projectId: pDoc.id,
                }))
            }
        } catch (pErr) {
            console.warn('[+data.ts] Could not load structured projects:', pErr)
        }

        const title = `${comerciante.userName || comerciante.userRazonSocial || 'Comerciante'} — Comunidad Dezzpo`
        const description = comerciante.userDescription || `Perfil profesional de ${comerciante.userName} en Comunidad Dezzpo.`

        return {
            comerciante: {
                ...comerciante,
                userCategoriesChips,
                structuredProjects,
            },
            title,
            description
        }
    } catch (err) {
        console.error('Error fetching comerciante in +data.ts:', err)
        return {
            comerciante: null,
            title: 'Error al cargar perfil',
            description: 'No se pudo cargar el perfil del comerciante.'
        }
    }
}
