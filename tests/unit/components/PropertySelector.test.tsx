import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PropertySelector } from '@features/inmuebles/components/PropertySelector'
import * as inmueblesService from '@services/inmuebles'

vi.mock('@services/inmuebles', () => ({
    getInmuebles: vi.fn(),
    createInmueble: vi.fn(),
}))

describe('PropertySelector Component (RTL Component Testing)', () => {
    const mockOnSelect = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders skeleton loading state while fetching properties', () => {
        vi.mocked(inmueblesService.getInmuebles).mockImplementation(
            () => new Promise(() => {}) // never resolves to keep loading
        )

        const { container } = render(
            <PropertySelector propietarioId="prop-123" onSelectInmueble={mockOnSelect} />
        )

        // Verify skeleton elements are present
        expect(container.querySelector('.MuiSkeleton-root')).not.toBeNull()
    })

    it('renders empty alert state when user has zero registered properties', async () => {
        vi.mocked(inmueblesService.getInmuebles).mockResolvedValue({
            success: true,
            data: [],
            error: null,
        })

        render(<PropertySelector propietarioId="prop-123" onSelectInmueble={mockOnSelect} />)

        await waitFor(() => {
            expect(
                screen.getByText(/No tienes inmuebles registrados aún/i)
            ).toBeInTheDocument()
        })

        expect(screen.getByRole('button', { name: /Registrar Inmueble/i })).toBeInTheDocument()
    })

    it('renders property options and automatically selects preferred property', async () => {
        const mockProperties: inmueblesService.Inmueble[] = [
            {
                id: 'inm-1',
                propietarioId: 'prop-123',
                alias: 'Apartamento Chapinero',
                direccion: 'Calle 63 #7-10',
                ciudad: 'Bogotá',
                tipo: 'Apartamento',
                isPreferida: false,
                createdAt: '2026-01-01',
                updatedAt: '2026-01-01',
            },
            {
                id: 'inm-2',
                propietarioId: 'prop-123',
                alias: 'Casa Chía Metrópolis',
                direccion: 'Km 2 Vía Cota',
                ciudad: 'Chía',
                tipo: 'Casa',
                isPreferida: true,
                createdAt: '2026-01-02',
                updatedAt: '2026-01-02',
            },
        ]

        vi.mocked(inmueblesService.getInmuebles).mockResolvedValue({
            success: true,
            data: mockProperties,
            error: null,
        })

        render(<PropertySelector propietarioId="prop-123" onSelectInmueble={mockOnSelect} />)

        await waitFor(() => {
            expect(mockOnSelect).toHaveBeenCalledWith(mockProperties[1]) // Preferred item
        })

        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })
})
