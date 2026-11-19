import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChipsCategories } from '@/components/common/ChipsCategories'
import { ListadoCategorias } from '@/assets/data/ListadoCategorias'

vi.mock('@hooks/useAuth', () => ({
    useAuth: () => ({
        userAuthID: 'test-user-id',
        userClaims: { email: 'test@dezzpo.com', name: 'Test User' },
    }),
}))

describe('ChipsCategories Component - Search, Deduplication & Keywords', () => {
    it('finds "Lavado de Fachadas y Vidrios en Altura" when searching "fach"', () => {
        render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: [] }}
                editableContent={true}
            />
        )

        const searchInput = screen.getByPlaceholderText(/buscar categoría o palabra clave/i)
        fireEvent.change(searchInput, { target: { value: 'fach' } })

        expect(screen.getByText('Lavado de Fachadas y Vidrios en Altura')).toBeInTheDocument()
        expect(screen.getByText('Pintura')).toBeInTheDocument()
    })

    it('finds single consolidated "Fumigación y Control de Plagas" when searching "plagas"', () => {
        render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: [] }}
                editableContent={true}
            />
        )

        const searchInput = screen.getByPlaceholderText(/buscar categoría o palabra clave/i)
        fireEvent.change(searchInput, { target: { value: 'plagas' } })

        const matches = screen.getAllByText(/plagas/i)
        expect(matches.length).toBe(1)
        expect(matches[0]).toHaveTextContent('Fumigación y Control de Plagas')
    })

    it('finds single consolidated "Cámaras de Seguridad y Videovigilancia CCTV" when searching "cama" or "cctv"', () => {
        const { unmount } = render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: [] }}
                editableContent={true}
            />
        )

        const searchInput = screen.getByPlaceholderText(/buscar categoría o palabra clave/i)
        fireEvent.change(searchInput, { target: { value: 'cama' } })

        expect(screen.getByText('Cámaras de Seguridad y Videovigilancia CCTV')).toBeInTheDocument()

        unmount()

        render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: [] }}
                editableContent={true}
            />
        )

        const searchInput2 = screen.getByPlaceholderText(/buscar categoría o palabra clave/i)
        fireEvent.change(searchInput2, { target: { value: 'cctv' } })
        expect(screen.getByText('Cámaras de Seguridad y Videovigilancia CCTV')).toBeInTheDocument()
    })

    it('finds categories by keywords: madera, vidrio, inoxidable, divisiones, puertas', () => {
        render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: [] }}
                editableContent={true}
            />
        )

        const searchInput = screen.getByPlaceholderText(/buscar categoría o palabra clave/i)

        // Madera
        fireEvent.change(searchInput, { target: { value: 'madera' } })
        expect(screen.getByText('Carpintería')).toBeInTheDocument()

        // Vidrio
        fireEvent.change(searchInput, { target: { value: 'vidrio' } })
        expect(screen.getByText('Instalación de ventanas')).toBeInTheDocument()
        expect(screen.getByText('Divisiones de Baño y Vidrio Templado')).toBeInTheDocument()

        // Inoxidable
        fireEvent.change(searchInput, { target: { value: 'inoxidable' } })
        expect(screen.getByText('Metálmecanica')).toBeInTheDocument()
        expect(screen.getByText('Soldadura')).toBeInTheDocument()

        // Divisiones
        fireEvent.change(searchInput, { target: { value: 'divisiones' } })
        expect(screen.getByText('Divisiones de Baño y Vidrio Templado')).toBeInTheDocument()

        // Puertas
        fireEvent.change(searchInput, { target: { value: 'puertas' } })
        expect(screen.getByText('Puertas Automáticas y Motores')).toBeInTheDocument()
        expect(screen.getByText('Puertas Residenciales y de Seguridad')).toBeInTheDocument()
    })

    it('finds newly added commercial categories: plantas eléctricas, tuberías cobre/racores, bombas/compresores', () => {
        render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: [] }}
                editableContent={true}
            />
        )

        const searchInput = screen.getByPlaceholderText(/buscar categoría o palabra clave/i)

        // Plantas eléctricas / generadores
        fireEvent.change(searchInput, { target: { value: 'generadores' } })
        expect(screen.getByText('Plantas Eléctricas y Generadores')).toBeInTheDocument()

        // Tuberías cobre y racores
        fireEvent.change(searchInput, { target: { value: 'racores' } })
        expect(screen.getByText('Tuberías Industriales, Cobre y Racores')).toBeInTheDocument()

        // Bombas y compresores
        fireEvent.change(searchInput, { target: { value: 'compresores' } })
        expect(screen.getByText('Bombas, Compresores y Equipos de Presión')).toBeInTheDocument()
    })

    it('supports legacy alias mapping when user already had older category name in profile', () => {
        render(
            <ChipsCategories
                listadoCategorias={ListadoCategorias}
                userEditInfo={{ userCategories: ['Control de plagas', 'Camaras de seguridad'] }}
                editableContent={true}
            />
        )

        // The chips should be selected (filled) in the selected tray and in the list
        const cctvChips = screen.getAllByText('Cámaras de Seguridad y Videovigilancia CCTV')
        expect(cctvChips.length).toBeGreaterThanOrEqual(1)
        const filledCctv = cctvChips.some((el) => el.closest('.MuiChip-filled') !== null)
        expect(filledCctv).toBe(true)

        const plagasChips = screen.getAllByText('Fumigación y Control de Plagas')
        expect(plagasChips.length).toBeGreaterThanOrEqual(1)
        const filledPlagas = plagasChips.some((el) => el.closest('.MuiChip-filled') !== null)
        expect(filledPlagas).toBe(true)
    })
})
