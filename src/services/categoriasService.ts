/**
 * Categorias Sevice
 *
 * Hanldes fetching category pricing data from Firestore.
 * Implements caching strategy to minimize reads.
 */

import {
    collection,
    getDocs,
} from 'firebase/firestore'
import { firestore } from './firebase'
import { ListadoCategorias } from '../assets/data/ListadoCategorias'

// Types
export interface CategoriaItem {
    subSistema?: string
    subCategoria?: string
    subCategoriaCantidad?: string
    subCategoriaDescription?: string
    subCategoriaPrecio?: number
    [key: string]: any
}

interface CacheData {
    timestamp: number
    data: CategoriaItem[]
}

const CACHE_KEY = 'cached_costos_data'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const CategoriasService = {
    /**
     * Get all costs data for the Appendice page.
     * Checks localStorage cache first.
     */
    getAllCostos: async (): Promise<CategoriaItem[]> => {
        // 0. Check Firestore availability
        if (!firestore) {
            console.warn('Firestore not initialized')
            return []
        }

        // 1. Check Cache
        if (typeof window !== 'undefined') {
             const cached = localStorage.getItem(CACHE_KEY)
             if (cached) {
                 try {
                     const { timestamp, data }: CacheData = JSON.parse(cached)
                     const now = Date.now()
                     if (now - timestamp < CACHE_DURATION) {
                         console.log('Using cached costos data')
                         return data
                     }
                 } catch (e) {
                     console.warn('Error parsing cached data', e)
                     localStorage.removeItem(CACHE_KEY)
                 }
             }
        }

        // 2. Fetch Fresh Data
        console.log('Fetching fresh costos data from Firestore...')
        const allData: CategoriaItem[] = []
        const mainDocId = 'aPTAljOeD48FbniBg6Lw' // Main config doc ID

        // Iterate through all defined categories
        // We limit concurrency to avoid overwhelming the network/Firestore
        // Chunking requests in batches of 5
        const chunkSize = 5
        for (let i = 0; i < ListadoCategorias.length; i += chunkSize) {
            const chunk = ListadoCategorias.slice(i, i + chunkSize)
            
            const promises = chunk.map(async (cat: any) => {
                 // The 'label' corresponds to the subcollection name
                 // e.g., 'Pintura', 'Plomería'
                 const categoryName = cat.label
                 try {
                     const subColRef = collection(
                         firestore!, 
                         'categoriasServicios', 
                         mainDocId, 
                         categoryName
                     )
                     const snapshot = await getDocs(subColRef)
                     
                     if (!snapshot.empty) {
                         const items = snapshot.docs.map(d => d.data() as CategoriaItem)
                         // Add header item
                         return [
                             { subSistema: categoryName },
                             ...items
                         ]
                     }
                     return []
                 } catch (err) {
                     console.error(`Error fetching category: ${categoryName}`, err)
                     return []
                 }
            })

            const results = await Promise.all(promises)
            results.forEach(items => {
                if (items.length > 0) {
                    allData.push(...items)
                }
            })
        }

        // 3. Save to Cache
        if (allData.length > 0 && typeof window !== 'undefined') {
            const cachePayload: CacheData = {
                timestamp: Date.now(),
                data: allData
            }
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload))
            } catch (e) {
                console.warn('Storage quota exceeded, could not cache results')
            }
        }

        return allData
    },

    /**
     * Get items for a specific category (used in Nuevo Proyecto)
     * @param categoryName Name of the category (e.g. "Pintura")
     */
    getCategoryItems: async (categoryName: string): Promise<CategoriaItem[]> => {
        if (!categoryName || !firestore) return []

        try {
            const mainDocId = 'aPTAljOeD48FbniBg6Lw'
            const subColRef = collection(
                firestore, 
                'categoriasServicios', 
                mainDocId, 
                categoryName
            )
            const snapshot = await getDocs(subColRef)
            return snapshot.docs.map(doc => doc.data() as CategoriaItem)
        } catch (error) {
            console.error('Error getting category items:', error)
            throw error
        }
    },

    /**
     * Clear the local cache
     */
    clearCache: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CACHE_KEY)
        }
    }
}
