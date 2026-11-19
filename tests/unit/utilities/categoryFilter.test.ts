import { describe, it, expect } from 'vitest'
import { filterCategoriesBySearch, normalizeSearchText } from '@/utils/categoryFilter'
import { ListadoCategorias } from '@/assets/data/ListadoCategorias'

describe('Category Filter Utility (normalizeSearchText & filterCategoriesBySearch)', () => {
    describe('normalizeSearchText', () => {
        it('removes accents and converts to lowercase', () => {
            expect(normalizeSearchText('Plomería')).toBe('plomeria')
            expect(normalizeSearchText('ALBAÑILERÍA')).toBe('albanileria')
            expect(normalizeSearchText('Eléctrica')).toBe('electrica')
        })
    })

    describe('filterCategoriesBySearch', () => {
        it('returns all categories when query is empty or whitespace', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: '',
            })
            expect(res.length).toBe(ListadoCategorias.length)

            const resWhitespace = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: '   ',
            })
            expect(resWhitespace.length).toBe(ListadoCategorias.length)
        })

        it('filters down to Plomería when searching "plomeria"', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'plomeria',
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Plomería')
            expect(labels).not.toContain('Albañilería')
            expect(labels).not.toContain('Aires Acondicionados')
            expect(res.length).toBeLessThan(5)
        })

        it('filters down to Plomería with accent "plomería"', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'plomería',
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Plomería')
            expect(labels).not.toContain('Acabados en muros')
        })

        it('matches plural or stem "plomeros"', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'plomeros',
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Plomería')
        })

        it('filters down to Pintura when searching "pintor"', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'pintor',
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Pintura')
            expect(labels).not.toContain('Arquitectura')
        })

        it('filters down to Red electrica when searching "electricista"', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'electricista',
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Red electrica')
        })

        it('preserves selected category chip even when search is active', () => {
            // Suppose key 0 ('Acabados en muros') was selected, but user searched 'plomeria'
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'plomeria',
                selectedKey: '0',
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Plomería')
            expect(labels).toContain('Acabados en muros')
        })

        it('uses contextual category names when direct matches are empty', () => {
            // Suppose user searches a word that is not in any category label/keywords
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'termino_inexistente_contextual',
                contextualCategoryNames: ['Plomería', 'Redes hidrosanitarias'],
            })
            const labels = res.map((c) => c.label)
            expect(labels).toContain('Plomería')
            expect(labels).toContain('Redes hidrosanitarias')
        })

        it('finds categories via keywords (e.g. "madera", "vidrio", "fachada", "inoxidable", "divisiones")', () => {
            // Madera -> Carpintería
            const resMadera = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'madera',
            })
            expect(resMadera.map((c) => c.label)).toContain('Carpintería')

            // Vidrio -> Instalación de ventanas o Lavado de Fachadas y Vidrios en Altura o Divisiones
            const resVidrio = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'vidrio',
            })
            expect(resVidrio.map((c) => c.label)).toContain('Instalación de ventanas')

            // Fachada -> Lavado de Fachadas y Vidrios en Altura y Pintura
            const resFachada = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'fachada',
            })
            expect(resFachada.map((c) => c.label)).toContain('Lavado de Fachadas y Vidrios en Altura')

            // Inoxidable -> Metálmecanica y Soldadura
            const resInox = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'inoxidable',
            })
            expect(resInox.map((c) => c.label)).toContain('Metálmecanica')

            // Divisiones -> Divisiones de Baño y Vidrio Templado
            const resDivisiones = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'divisiones',
            })
            expect(resDivisiones.map((c) => c.label)).toContain('Divisiones de Baño y Vidrio Templado')

            // Cobre / Racores -> Tuberías Industriales, Cobre y Racores
            const resCobre = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'cobre',
            })
            expect(resCobre.map((c) => c.label)).toContain('Tuberías Industriales, Cobre y Racores')
        })

        it('returns empty array when query has no matching category or context', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'xyzinexistente999',
            })
            expect(res).toEqual([])
        })

        it('preserves selected category even when query matches nothing else', () => {
            const res = filterCategoriesBySearch({
                categories: ListadoCategorias,
                searchQuery: 'xyzinexistente999',
                selectedKey: '0',
            })
            expect(res.length).toBe(1)
            expect(res[0]?.label).toBe('Acabados en muros')
        })
    })
})
