/**
 * Duplicate Check Service
 *
 * Validates name availability and detects homonyms/duplicates for:
 * 1. Qualified Merchants (Comerciantes Profesionales)
 * 2. Hardware stores & suppliers (Tiendas y Proveedores)
 *
 * Normalizes diacritics (accents), whitespace, and case sensitivity.
 */

import { collection, getDocs, query } from 'firebase/firestore'
import { firestore, isFirebaseAvailable } from '@services/firebase'
import type { TiendaDocument } from '@services/tiendas'
import type { UserFirestoreDocument } from '@services/types'

const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'
const TIENDAS_COLLECTION = 'tiendas'

export interface ComercianteDuplicateMatch {
    userId: string
    userName: string
    userRazonSocial?: string
    userContactName?: string
    userProfession?: string
    userCategories?: string[]
    userCiudad?: string
    userDirection?: string
    userZonasCobertura?: string[]
    similarity: 'exact' | 'similar'
}

export interface TiendaDuplicateMatch {
    id: string
    nombre: string
    razonSocial?: string
    nit?: string
    categorias: string[]
    sedes: {
        nombreSede: string
        direccion: string
        zona: string
        ciudad: string
    }[]
    similarity: 'exact' | 'similar'
}

export interface DuplicateCheckResult<T> {
    isAvailable: boolean
    exactMatch: boolean
    matches: T[]
}

/**
 * Helper to normalize string for comparison (removes accents, lowercase, trim)
 */
export function normalizeSearchString(str: string): string {
    return (str || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, ' ')
}

/**
 * Check if a merchant name / business name already exists in usersComerciantesCalificados
 */
export async function checkComercianteNameAvailability(
    inputName: string,
    excludeUserId?: string
): Promise<DuplicateCheckResult<ComercianteDuplicateMatch>> {
    const cleanInput = normalizeSearchString(inputName)
    if (!cleanInput || cleanInput.length < 2) {
        return { isAvailable: true, exactMatch: false, matches: [] }
    }

    if (!isFirebaseAvailable() || !firestore) {
        return { isAvailable: true, exactMatch: false, matches: [] }
    }

    try {
        const colRef = collection(firestore, COMERCIANTES_COLLECTION)
        const snapshot = await getDocs(query(colRef))

        const matches: ComercianteDuplicateMatch[] = []
        let hasExactMatch = false

        snapshot.forEach((docSnap) => {
            const docId = docSnap.id
            if (excludeUserId && docId === excludeUserId) return

            const data = docSnap.data() as Partial<UserFirestoreDocument>
            const rawUserName = data.userName || ''
            const rawRazonSocial = data.userRazonSocial || ''

            const normUserName = normalizeSearchString(rawUserName)
            const normRazonSocial = normalizeSearchString(rawRazonSocial)

            if (!normUserName && !normRazonSocial) return

            const isExact =
                (normUserName && normUserName === cleanInput) ||
                (normRazonSocial && normRazonSocial === cleanInput)

            const isSimilar =
                !isExact &&
                ((normUserName && (normUserName.includes(cleanInput) || cleanInput.includes(normUserName))) ||
                 (normRazonSocial && (normRazonSocial.includes(cleanInput) || cleanInput.includes(normRazonSocial))))

            if (isExact || isSimilar) {
                if (isExact) hasExactMatch = true

                matches.push({
                    userId: docId,
                    userName: rawUserName || 'Comerciante',
                    userRazonSocial: rawRazonSocial || undefined,
                    userContactName: data.userContactName || undefined,
                    userProfession: data.userProfession || undefined,
                    userCategories: data.userCategories || [],
                    userCiudad: data.userCiudad || undefined,
                    userDirection: data.userDirection || undefined,
                    userZonasCobertura: data.userZonasCobertura || [],
                    similarity: isExact ? 'exact' : 'similar',
                })
            }
        })

        // Sort exact matches first
        matches.sort((a, b) => (a.similarity === 'exact' ? -1 : 1))

        return {
            isAvailable: matches.length === 0,
            exactMatch: hasExactMatch,
            matches,
        }
    } catch (error) {
        console.error('[duplicateCheckService] Error checking comerciante name:', error)
        return { isAvailable: true, exactMatch: false, matches: [] }
    }
}

/**
 * Check if a tienda/proveedor name already exists in tiendas collection
 */
export async function checkTiendaNameAvailability(
    inputName: string,
    excludeTiendaId?: string
): Promise<DuplicateCheckResult<TiendaDuplicateMatch>> {
    const cleanInput = normalizeSearchString(inputName)
    if (!cleanInput || cleanInput.length < 2) {
        return { isAvailable: true, exactMatch: false, matches: [] }
    }

    if (!isFirebaseAvailable() || !firestore) {
        return { isAvailable: true, exactMatch: false, matches: [] }
    }

    try {
        const colRef = collection(firestore, TIENDAS_COLLECTION)
        const snapshot = await getDocs(query(colRef))

        const matches: TiendaDuplicateMatch[] = []
        let hasExactMatch = false

        snapshot.forEach((docSnap) => {
            const docId = docSnap.id
            if (excludeTiendaId && docId === excludeTiendaId) return

            const data = docSnap.data() as Partial<TiendaDocument>
            const rawNombre = data.nombre || ''
            const rawRazonSocial = data.razonSocial || ''

            const normNombre = normalizeSearchString(rawNombre)
            const normRazonSocial = normalizeSearchString(rawRazonSocial)

            if (!normNombre && !normRazonSocial) return

            const isExact =
                (normNombre && normNombre === cleanInput) ||
                (normRazonSocial && normRazonSocial === cleanInput)

            const isSimilar =
                !isExact &&
                ((normNombre && (normNombre.includes(cleanInput) || cleanInput.includes(normNombre))) ||
                 (normRazonSocial && (normRazonSocial.includes(cleanInput) || cleanInput.includes(normRazonSocial))))

            if (isExact || isSimilar) {
                if (isExact) hasExactMatch = true

                const sedesSummary = (data.sedes || []).map((s) => ({
                    nombreSede: s.nombreSede || 'Sede Principal',
                    direccion: s.direccion || '',
                    zona: s.zona || '',
                    ciudad: s.ciudad || 'Bogotá, Colombia',
                }))

                matches.push({
                    id: docId,
                    nombre: rawNombre,
                    razonSocial: rawRazonSocial || undefined,
                    nit: data.nit || undefined,
                    categorias: data.categorias || [],
                    sedes: sedesSummary,
                    similarity: isExact ? 'exact' : 'similar',
                })
            }
        })

        // Sort exact matches first
        matches.sort((a, b) => (a.similarity === 'exact' ? -1 : 1))

        return {
            isAvailable: matches.length === 0,
            exactMatch: hasExactMatch,
            matches,
        }
    } catch (error) {
        console.error('[duplicateCheckService] Error checking tienda name:', error)
        return { isAvailable: true, exactMatch: false, matches: [] }
    }
}
