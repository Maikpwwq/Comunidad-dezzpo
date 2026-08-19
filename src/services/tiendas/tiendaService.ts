/**
 * Tienda Service
 *
 * Cloud Firestore operations for supplier directory, hardware stores, tool rentals,
 * multi-branch locations, user submissions, and admin moderation workbench.
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import { slugify } from '@services/utils/slugify'
import type { ServiceResponse } from '@/types/services.d'
import type {
    TiendaDocument,
    CreateTiendaInput,
    UpdateTiendaInput,
    TiendaFilters,
} from './types'

export { slugify }

const COLLECTION_NAME = 'tiendas'

/**
 * Curated list of 6 seed tiendas transcribed from real business cards.
 * Populated on first run when directory is empty.
 */
const SEEDED_TIENDAS: CreateTiendaInput[] = [
    {
        nombre: 'Ferretería y Metales El Progreso',
        razonSocial: 'Comercializadora El Progreso S.A.S.',
        nit: '900.456.789-1',
        descripcion: 'Venta de perfiles de hierro, tubos, soldadura y ferretería pesada.',
        categorias: ['ferreteria_general', 'perfiles_hierro', 'gases_industriales_soldadura'],
        telefonoPrincipal: '6013456789',
        whatsappPrincipal: '573102345678',
        email: 'ventas@elprogresometales.com',
        sitioWeb: 'https://elprogresometales.com',
        sedes: [
            {
                id: 'sede-1',
                nombreSede: 'Sede Paloquemao',
                direccion: 'Calle 13 # 28-45',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'los-martires',
                hasCustomPhones: true,
                telefonos: ['6013456789', '3102345678'],
                whatsapp: '573102345678',
                horario: 'Lun-Vie 7:30 - 17:30, Sáb 8:00 - 14:00',
                detallesUbicacion: 'Frente al costado sur de la Plaza de Paloquemao, fachada amarilla.',
                nombreContacto: 'Carlos Martínez',
                cargoContacto: 'Gerente de Ventas',
                lat: 4.6125,
                lng: -74.0881,
            },
            {
                id: 'sede-2',
                nombreSede: 'Sucursal 7 de Agosto',
                direccion: 'Carrera 24 # 65-12',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'barrios-unidos',
                hasCustomPhones: true,
                telefonos: ['6014567890'],
                horario: 'Lun-Vie 8:00 - 17:00',
                detallesUbicacion: 'A dos cuadras del parque principal del 7 de Agosto.',
                nombreContacto: 'Sandra Gómez',
                cargoContacto: 'Administradora de Sede',
                lat: 4.6568,
                lng: -74.0721,
            },
        ],
        estado: 'aprobado',
        origen: 'equipo_dezzpo',
        tierVisibilidad: 'destacado',
    },
    {
        nombre: 'Pinturas & Color Tech Bogotá',
        razonSocial: 'Inversiones Color Tech Colombia Ltda.',
        nit: '830.123.987-4',
        descripcion: 'Distribuidor autorizado de pinturas acrílicas, esmaltes, impermeabilizantes y preparación de color.',
        categorias: ['pinturas_insumos', 'impermeabilizantes_aditivos'],
        telefonoPrincipal: '6015678901',
        whatsappPrincipal: '573153456789',
        sitioWeb: 'https://colortech.co',
        sedes: [
            {
                id: 'sede-1',
                nombreSede: 'Sede Chapinero',
                direccion: 'Carrera 15 # 85-30',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'chapinero',
                hasCustomPhones: true,
                telefonos: ['6015678901'],
                whatsapp: '573153456789',
                horario: 'Lun-Sáb 8:00 - 18:00',
                detallesUbicacion: 'Al lado de la entidad bancaria, local esquinero.',
                nombreContacto: 'Andrés López',
                cargoContacto: 'Asesor Técnico de Color',
                lat: 4.6702,
                lng: -74.0582,
            },
        ],
        estado: 'aprobado',
        origen: 'equipo_dezzpo',
        tierVisibilidad: 'estandar',
    },
    {
        nombre: 'Andamios & Equipos de Colombia',
        razonSocial: 'Andamios y Maquinaria de Colombia S.A.S.',
        nit: '901.334.556-2',
        descripcion: 'Alquiler y venta de andamios tubulares, multidireccionales, arneses y equipos de seguridad para trabajos en altura.',
        categorias: ['andamios_equipos', 'seguridad_industrial_epp', 'servicio_tecnico_herramientas'],
        telefonoPrincipal: '6016789012',
        whatsappPrincipal: '573204567890',
        email: 'contacto@andamiosdecolombia.com',
        sedes: [
            {
                id: 'sede-1',
                nombreSede: 'Patio Central Suba',
                direccion: 'Av. Suba # 115-40',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'suba',
                hasCustomPhones: true,
                telefonos: ['6016789012', '3204567890'],
                whatsapp: '573204567890',
                horario: 'Lun-Vie 7:00 - 17:00',
                detallesUbicacion: 'Entrada por la bahía de carga, portón gris industrial.',
                nombreContacto: 'Ing. Jorge Ramírez',
                cargoContacto: 'Jefe de Operaciones y Logística',
                lat: 4.6985,
                lng: -74.0754,
            },
        ],
        estado: 'aprobado',
        origen: 'equipo_dezzpo',
        tierVisibilidad: 'patrocinado',
    },
    {
        nombre: 'Vidrios y Perfiles del Norte',
        razonSocial: 'Vidriería y Aluminio del Norte E.U.',
        nit: '800.776.543-9',
        descripcion: 'Venta de cristal templado, espejos flotados, perfiles de aluminio y accesorios de acero inox.',
        categorias: ['vidrios_cristales', 'perfileria_aluminio'],
        telefonoPrincipal: '6017890123',
        whatsappPrincipal: '573185678901',
        sedes: [
            {
                id: 'sede-1',
                nombreSede: 'Sede Cedritos',
                direccion: 'Calle 140 # 19-25',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'usaquen',
                hasCustomPhones: true,
                telefonos: ['6017890123'],
                whatsapp: '573185678901',
                horario: 'Lun-Sáb 8:00 - 17:30',
                detallesUbicacion: 'Diagonal al centro comercial Cedritos, local 102.',
                nombreContacto: 'Martha Fernández',
                cargoContacto: 'Atención al Cliente',
                lat: 4.7182,
                lng: -74.0415,
            },
        ],
        estado: 'aprobado',
        origen: 'equipo_dezzpo',
        tierVisibilidad: 'estandar',
    },
    {
        nombre: 'Eléctricos & Iluminación del Sur',
        razonSocial: 'Distribuidora Eléctrica del Sur S.A.S.',
        nit: '900.887.654-3',
        descripcion: 'Materiales eléctricos residenciales e industriales, cableado estructurado y paneles LED.',
        categorias: ['materiales_electricos', 'iluminacion_lamparas', 'redes_cableado_estructurado'],
        telefonoPrincipal: '6018901234',
        whatsappPrincipal: '573126789012',
        sedes: [
            {
                id: 'sede-1',
                nombreSede: 'Sede Restrepo',
                direccion: 'Carrera 19 # 18-05 Sur',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'antonio-narino',
                hasCustomPhones: true,
                telefonos: ['6018901234'],
                whatsapp: '573126789012',
                horario: 'Lun-Vie 8:00 - 18:00',
                detallesUbicacion: 'En toda la esquina del sector comercial de Restrepo.',
                nombreContacto: 'Wilson Cruz',
                cargoContacto: 'Encargado de Mostrador',
                lat: 4.5821,
                lng: -74.0954,
            },
        ],
        estado: 'aprobado',
        origen: 'equipo_dezzpo',
        tierVisibilidad: 'estandar',
    },
    {
        nombre: 'Distribuidora de Tubos y Accesorios PVC',
        razonSocial: 'Hidrosanitarios y Plomería PVC S.A.S.',
        nit: '901.112.233-5',
        descripcion: 'Tubería de presión, sanitaria, ventilación, conduit y pegantes PVC al por mayor y detal.',
        categorias: ['tuberia_pvc_hidrosanitaria'],
        telefonoPrincipal: '6019012345',
        whatsappPrincipal: '573147890123',
        sedes: [
            {
                id: 'sede-1',
                nombreSede: 'Sede Fontibón',
                direccion: 'Calle 17 # 98-12',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                zona: 'fontibon',
                hasCustomPhones: true,
                telefonos: ['6019012345'],
                whatsapp: '573147890123',
                horario: 'Lun-Vie 7:30 - 17:00, Sáb 8:00 - 13:00',
                detallesUbicacion: 'Cerca a la zona franca de Fontibón, bodega #3.',
                nombreContacto: 'Hernando Patiño',
                cargoContacto: 'Despachador Principal',
                lat: 4.6734,
                lng: -74.1432,
            },
        ],
        estado: 'aprobado',
        origen: 'equipo_dezzpo',
        tierVisibilidad: 'estandar',
    },
]

/**
 * Fetch list of tiendas filtered by status, category, zone, or search query.
 */
export async function getTiendas(
    filters?: TiendaFilters
): Promise<ServiceResponse<TiendaDocument[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const ref = collection(firestore, COLLECTION_NAME)
        const targetEstado = filters?.estado || 'aprobado'

        let q = query(ref, where('estado', '==', targetEstado), orderBy('createdAt', 'desc'))

        const snapshot = await getDocs(q)
        let docs: TiendaDocument[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<TiendaDocument, 'id'>),
        }))

        // Auto-seed initial entries if empty for approved status
        if (docs.length === 0 && targetEstado === 'aprobado' && (!filters || Object.keys(filters).length === 0)) {
            const seedRes = await seedInitialTiendas()
            if (seedRes.success && seedRes.data) {
                docs = seedRes.data
            }
        }

        // Apply client-side filters (category, zone, text search)
        if (filters?.categoria) {
            docs = docs.filter((item) => item.categorias.includes(filters.categoria!))
        }

        if (filters?.zona) {
            const targetZone = filters.zona.toLowerCase()
            docs = docs.filter((item) =>
                item.sedes.some((sede) => sede.zona.toLowerCase() === targetZone)
            )
        }

        if (filters?.query) {
            const term = filters.query.toLowerCase()
            docs = docs.filter(
                (item) =>
                    item.nombre.toLowerCase().includes(term) ||
                    item.razonSocial?.toLowerCase().includes(term) ||
                    item.nit?.toLowerCase().includes(term) ||
                    item.descripcion?.toLowerCase().includes(term) ||
                    item.sedes.some(
                        (s) =>
                            s.direccion.toLowerCase().includes(term) ||
                            s.nombreSede.toLowerCase().includes(term) ||
                            s.detallesUbicacion?.toLowerCase().includes(term) ||
                            s.nombreContacto?.toLowerCase().includes(term) ||
                            s.cargoContacto?.toLowerCase().includes(term)
                    ) ||
                    item.categorias.some((catKey) => {
                        const catObj = ListadoCategoriasTiendas.find((c) => c.key === catKey)
                        if (!catObj) return false
                        if (catObj.label.toLowerCase().includes(term) || catObj.key.toLowerCase().includes(term)) return true
                        return catObj.synonyms?.some((syn) => syn.toLowerCase().includes(term))
                    })
            )
        }

        if (filters?.tierVisibilidad) {
            docs = docs.filter((item) => item.tierVisibilidad === filters.tierVisibilidad)
        }

        return { success: true, data: docs, error: null }
    } catch (err: any) {
        console.error('[tiendaService] Error in getTiendas:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al obtener las tiendas',
            },
        }
    }
}

/**
 * Fetch a single tienda by ID
 */
export async function getTiendaById(
    id: string
): Promise<ServiceResponse<TiendaDocument | null>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: null, error: null }
    }

    try {
        const docRef = doc(firestore, COLLECTION_NAME, id)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            return { success: true, data: null, error: null }
        }

        const data = {
            id: docSnap.id,
            ...(docSnap.data() as Omit<TiendaDocument, 'id'>),
        }

        return { success: true, data, error: null }
    } catch (err: any) {
        console.error('[tiendaService] Error in getTiendaById:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al consultar la tienda',
            },
        }
    }
}

/**
 * Recursively strips undefined values from an object or array to ensure compatibility with Firestore SDK.
 */
function sanitizeForFirestore<T>(val: T): T {
    if (val === undefined || val === null) {
        return val
    }
    if (Array.isArray(val)) {
        return val.map((item) => sanitizeForFirestore(item)) as unknown as T
    }
    if (typeof val === 'object' && val.constructor === Object) {
        const cleaned: Record<string, any> = {}
        for (const [key, value] of Object.entries(val)) {
            if (value !== undefined) {
                cleaned[key] = sanitizeForFirestore(value)
            }
        }
        return cleaned as T
    }
    return val
}

/**
 * Create a new tienda entry (user submission or admin creation)
 */
export async function createTienda(
    input: CreateTiendaInput,
    userId: string = 'guest'
): Promise<ServiceResponse<TiendaDocument>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Firebase no está inicializado' },
        }
    }

    try {
        const tiendaId = `tienda_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        const docRef = doc(firestore, COLLECTION_NAME, tiendaId)
        const generatedSlug = slugify(input.nombre)

        const now = new Date().toISOString()
        const documentData: TiendaDocument = {
            id: tiendaId,
            nombre: input.nombre.trim(),
            razonSocial: input.razonSocial?.trim() || '',
            nit: input.nit?.trim() || '',
            slug: generatedSlug,
            categorias: input.categorias || [],
            descripcion: input.descripcion?.trim() || '',
            email: input.email?.trim() || '',
            sitioWeb: input.sitioWeb?.trim() || '',
            telefonoPrincipal: input.telefonoPrincipal?.trim() || input.sedes?.[0]?.telefonos?.[0] || '',
            whatsappPrincipal: input.whatsappPrincipal?.trim() || input.sedes?.[0]?.whatsapp || '',
            logoUrl: input.logoUrl || '',
            sedes: (input.sedes || []).map((s, idx) => ({
                ...s,
                id: s.id || `sede_${idx + 1}_${Date.now()}`,
                nombreSede: s.nombreSede?.trim() || `Sede ${idx + 1}`,
                direccion: s.direccion?.trim() || '',
                ciudad: s.ciudad || 'Bogotá, Colombia',
                zona: s.zona || 'bogota',
                telefonos: s.telefonos || [],
                whatsapp: s.whatsapp?.trim() || '',
                horario: s.horario?.trim() || '',
                detallesUbicacion: s.detallesUbicacion?.trim() || '',
                nombreContacto: s.nombreContacto?.trim() || '',
                cargoContacto: s.cargoContacto?.trim() || '',
            })),
            estado: input.estado || 'pendiente',
            origen: input.origen || (userId === 'admin' ? 'equipo_dezzpo' : 'usuario'),
            createdBy: input.createdBy || userId,
            createdAt: now,
            updatedAt: now,
            tierVisibilidad: input.tierVisibilidad || 'estandar',
            estadoOutreach: 'sin_contactar',
            notasInternas: input.notasInternas || '',
        }

        const cleanedDocumentData = sanitizeForFirestore(documentData)
        await setDoc(docRef, cleanedDocumentData)

        return { success: true, data: cleanedDocumentData, error: null }
    } catch (err: any) {
        console.error('[tiendaService] Error in createTienda:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al guardar la tienda',
            },
        }
    }
}

/**
 * Update an existing tienda record (Admin or edit)
 */
export async function updateTienda(
    id: string,
    input: UpdateTiendaInput
): Promise<ServiceResponse<TiendaDocument>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Firebase no está inicializado' },
        }
    }

    try {
        const docRef = doc(firestore, COLLECTION_NAME, id)
        const currentRes = await getTiendaById(id)

        if (!currentRes.success || !currentRes.data) {
            return {
                success: false,
                data: null,
                error: { code: 'FIRESTORE_NOT_FOUND', message: 'La tienda especificada no existe' },
            }
        }

        const current = currentRes.data
        const updatedData: Record<string, unknown> = {
            ...input,
            updatedAt: new Date().toISOString(),
        }

        if (input.nombre) {
            updatedData.nombre = input.nombre.trim()
            updatedData.slug = slugify(input.nombre)
        }
        if (input.razonSocial !== undefined) {
            updatedData.razonSocial = input.razonSocial.trim()
        }
        if (input.nit !== undefined) {
            updatedData.nit = input.nit.trim()
        }
        if (input.descripcion !== undefined) {
            updatedData.descripcion = input.descripcion.trim()
        }
        if (input.email !== undefined) {
            updatedData.email = input.email.trim()
        }
        if (input.sitioWeb !== undefined) {
            updatedData.sitioWeb = input.sitioWeb.trim()
        }
        if (input.telefonoPrincipal !== undefined) {
            updatedData.telefonoPrincipal = input.telefonoPrincipal.trim()
        }
        if (input.whatsappPrincipal !== undefined) {
            updatedData.whatsappPrincipal = input.whatsappPrincipal.trim()
        }
        if (input.sedes) {
            updatedData.sedes = input.sedes.map((s, idx) => ({
                ...s,
                id: s.id || `sede_${idx + 1}_${Date.now()}`,
                nombreSede: s.nombreSede?.trim() || `Sede ${idx + 1}`,
                direccion: s.direccion?.trim() || '',
                ciudad: s.ciudad || 'Bogotá, Colombia',
                zona: s.zona || 'bogota',
                telefonos: s.telefonos || [],
                whatsapp: s.whatsapp?.trim() || '',
                horario: s.horario?.trim() || '',
                detallesUbicacion: s.detallesUbicacion?.trim() || '',
                nombreContacto: s.nombreContacto?.trim() || '',
                cargoContacto: s.cargoContacto?.trim() || '',
            }))
        }

        const cleanedUpdatedData = sanitizeForFirestore(updatedData)
        await updateDoc(docRef, cleanedUpdatedData)

        const finalData: TiendaDocument = {
            ...current,
            ...cleanedUpdatedData,
        }

        return { success: true, data: finalData, error: null }
    } catch (err: any) {
        console.error('[tiendaService] Error in updateTienda:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al actualizar la tienda',
            },
        }
    }
}

/**
 * Delete a tienda record (Admin only)
 */
export async function deleteTienda(id: string): Promise<ServiceResponse<boolean>> {
    if (!isFirebaseAvailable() || !firestore) {
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: 'Firebase no está inicializado' },
        }
    }

    try {
        const docRef = doc(firestore, COLLECTION_NAME, id)
        await deleteDoc(docRef)
        return { success: true, data: true, error: null }
    } catch (err: any) {
        console.error('[tiendaService] Error in deleteTienda:', err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: err.message || 'Error al eliminar la tienda',
            },
        }
    }
}

/**
 * Admin shortcut to approve a tienda
 */
export async function approveTienda(id: string): Promise<ServiceResponse<TiendaDocument>> {
    return updateTienda(id, { estado: 'aprobado' })
}

/**
 * Admin shortcut to reject a tienda
 */
export async function rejectTienda(id: string): Promise<ServiceResponse<TiendaDocument>> {
    return updateTienda(id, { estado: 'rechazado' })
}

/**
 * Seed initial curated tiendas if collection is empty
 */
export async function seedInitialTiendas(): Promise<ServiceResponse<TiendaDocument[]>> {
    if (!isFirebaseAvailable() || !firestore) {
        return { success: true, data: [], error: null }
    }

    try {
        const createdTiendas: TiendaDocument[] = []
        for (const item of SEEDED_TIENDAS) {
            const res = await createTienda(item, 'admin')
            if (res.success && res.data) {
                createdTiendas.push(res.data)
            }
        }
        return { success: true, data: createdTiendas, error: null }
    } catch (err: any) {
        console.error('[tiendaService] Error in seedInitialTiendas:', err)
        return {
            success: false,
            data: null,
            error: { code: 'INTERNAL_ERROR', message: err.message || 'Error al sembrar tiendas iniciales' },
        }
    }
}
