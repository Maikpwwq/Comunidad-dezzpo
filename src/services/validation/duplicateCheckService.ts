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
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import type { TiendaDocument } from '@services/tiendas'
import type { UserFirestoreDocument } from '@services/types'

const COMERCIANTES_COLLECTION = 'usersComerciantesCalificados'
const TIENDAS_COLLECTION = 'tiendas'
const SUGGESTED_CATEGORIES_COLLECTION = 'suggestedCategories'

export interface ComercianteDuplicateMatch {
    userId: string
    userName: string
    userRazonSocial?: string | undefined
    userContactName?: string | undefined
    userProfession?: string | undefined
    userCategories?: string[] | undefined
    userCiudad?: string | undefined
    userDirection?: string | undefined
    userZonasCobertura?: string[] | undefined
    similarity: 'exact' | 'similar'
}

export interface TiendaDuplicateMatch {
    id: string
    nombre: string
    razonSocial?: string | undefined
    nit?: string | undefined
    categorias: string[]
    sedes: {
        nombreSede: string
        direccion: string
        zona: string
        ciudad: string
    }[]
    similarity: 'exact' | 'similar'
}

export interface CategoryDuplicateMatch {
    name: string
    source: 'catalog' | 'pending_suggestion' | 'approved_suggestion'
    similarity: 'exact' | 'similar'
    categoryKey?: number | undefined
    description?: string | undefined
    createdAt?: string | undefined
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
        matches.sort((a, b) => {
            if (a.similarity === b.similarity) return 0
            return a.similarity === 'exact' ? -1 : 1
        })

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
        matches.sort((a, b) => {
            if (a.similarity === b.similarity) return 0
            return a.similarity === 'exact' ? -1 : 1
        })

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

/**
 * Check if a suggested category already exists in the official catalog (ListadoCategorias)
 * or has already been submitted to suggestedCategories.
 */
export async function checkCategorySuggestionAvailability(
    inputName: string
): Promise<DuplicateCheckResult<CategoryDuplicateMatch>> {
    const cleanInput = normalizeSearchString(inputName)
    if (!cleanInput || cleanInput.length < 2) {
        return { isAvailable: true, exactMatch: false, matches: [] }
    }

    const matches: CategoryDuplicateMatch[] = []
    let hasExactMatch = false

    // 1. Check against official ListadoCategorias catalog
    const inputWords = cleanInput.split(' ').filter((w) => w.length >= 3)

    for (const cat of ListadoCategorias as any[]) {
        const rawLabel = cat.label || ''
        const normLabel = normalizeSearchString(rawLabel)
        if (!normLabel) continue

        const isExact = normLabel === cleanInput
        const labelWords = normLabel.split(' ').filter((w) => w.length >= 3)
        const hasWordOverlap =
            inputWords.some((w) => labelWords.includes(w)) ||
            (normLabel.length >= 4 && cleanInput.includes(normLabel)) ||
            (cleanInput.length >= 4 && normLabel.includes(cleanInput))

        const isSimilar = !isExact && hasWordOverlap

        if (isExact || isSimilar) {
            if (isExact) hasExactMatch = true
            matches.push({
                name: rawLabel,
                source: 'catalog',
                similarity: isExact ? 'exact' : 'similar',
                categoryKey: cat.key,
            })
        }
    }

    // 2. Check against Firestore suggestedCategories
    if (isFirebaseAvailable() && firestore) {
        try {
            const colRef = collection(firestore, SUGGESTED_CATEGORIES_COLLECTION)
            const snapshot = await getDocs(query(colRef))

            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as any
                const rawName = data.suggestedName || ''
                const normName = normalizeSearchString(rawName)
                if (!normName) return

                const isExact = normName === cleanInput
                const suggWords = normName.split(' ').filter((w) => w.length >= 3)
                const hasWordOverlap =
                    inputWords.some((w) => suggWords.includes(w)) ||
                    (normName.length >= 4 && cleanInput.includes(normName)) ||
                    (cleanInput.length >= 4 && normName.includes(cleanInput))

                const isSimilar = !isExact && hasWordOverlap

                if (isExact || isSimilar) {
                    if (isExact) hasExactMatch = true
                    const status = data.status || 'pending'
                    matches.push({
                        name: rawName,
                        source: status === 'approved' ? 'approved_suggestion' : 'pending_suggestion',
                        similarity: isExact ? 'exact' : 'similar',
                        description: data.description,
                        createdAt: data.createdAt,
                    })
                }
            })
        } catch (err) {
            console.error('[duplicateCheckService] Error querying suggestedCategories:', err)
        }
    }

    // Sort exact matches first, then catalog matches first
    matches.sort((a, b) => {
        if (a.similarity !== b.similarity) {
            return a.similarity === 'exact' ? -1 : 1
        }
        if (a.source === 'catalog' && b.source !== 'catalog') return -1
        if (b.source === 'catalog' && a.source !== 'catalog') return 1
        return 0
    })

    return {
        isAvailable: matches.length === 0,
        exactMatch: hasExactMatch,
        matches,
    }
}
