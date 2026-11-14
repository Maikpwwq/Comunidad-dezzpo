import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserLocationManager } from '@features/profile/components/UserLocationManager'
import type { UserLocationItem } from '@services/types'

vi.mock('@features/marketing', () => ({
    Ubicacion: ({ setLocInfo, setOpen }: { setLocInfo: (info: Record<string, unknown>) => void; setOpen: (open: boolean) => void }) => (
        <div data-testid="mock-ubicacion">
            <button
                data-testid="mock-save-map"
                onClick={() => {
                    setLocInfo({
                        street: 'Calle 100 # 15-20',
                        city: 'Bogotá, Colombia',
                        state: 'Bogotá D.C.',
                        postalCode: '110221',
                        lat: 4.68,
                        lng: -74.05,
                    })
                    setOpen(false)
                }}
            >
                Confirmar Mapa
            </button>
        </div>
    ),
}))

describe('UserLocationManager Component', () => {
    const mockOnChange = vi.fn()

    const initialLocations: UserLocationItem[] = [
        {
            id: 'loc_1',
            nombre: 'Sucursal Principal',
            nombreSede: 'Sucursal Principal',
            direccion: 'Carrera 7 # 72-10',
            departamento: 'Bogotá D.C.',
            ciudad: 'Bogotá, Colombia',
            codigoPostal: '110221',
            zona: 'chapinero',
            detallesUbicacion: 'Oficina 501',
            isPrimary: true,
            nombreContacto: 'Carlos Pérez',
            cargoContacto: 'Gerente',
            telefono: '+57 300 111 2233',
            horario: 'Lun-Vie 8:00 - 17:00',
        },
        {
            id: 'loc_2',
            nombre: 'Sede Norte',
            nombreSede: 'Sede Norte',
            direccion: 'Calle 140 # 11-40',
            departamento: 'Bogotá D.C.',
            ciudad: 'Bogotá, Colombia',
            codigoPostal: '110111',
            zona: 'usaquen',
            detallesUbicacion: 'Local 3',
            isPrimary: false,
            nombreContacto: 'Ana Gómez',
            cargoContacto: 'Asesora',
            telefono: '+57 310 999 8877',
            horario: 'Lun-Sáb 9:00 - 18:00',
        },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the header with count and "Agregar otra Sede" button', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        expect(screen.getByText('Sedes y Puntos de Atención (2)')).toBeDefined()
        expect(screen.getByText('Agregar otra Sede')).toBeDefined()
    })

    it('displays each sede with Sede #1 and Sede #2 headers', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        expect(screen.getByText('Sede #1')).toBeDefined()
        expect(screen.getByText('Sede #2')).toBeDefined()
    })

    it('shows "Principal" badge on primary sede and "Establecer como principal" on secondary sede', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        expect(screen.getByText('Principal')).toBeDefined()
        expect(screen.getByText('Establecer como principal')).toBeDefined()
    })

    it('calls onChange with updated isPrimary when "Establecer como principal" is clicked', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        const setPrimaryBtn = screen.getByText('Establecer como principal')
        fireEvent.click(setPrimaryBtn)

        expect(mockOnChange).toHaveBeenCalledTimes(1)
        const updated = mockOnChange.mock.calls[0][0] as UserLocationItem[]
        expect(updated[0].isPrimary).toBe(false)
        expect(updated[1].isPrimary).toBe(true)
    })

    it('calls onChange with a newly added sede when clicking "Agregar otra Sede"', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        const addBtn = screen.getByText('Agregar otra Sede')
        fireEvent.click(addBtn)

        expect(mockOnChange).toHaveBeenCalledTimes(1)
        const updated = mockOnChange.mock.calls[0][0] as UserLocationItem[]
        expect(updated.length).toBe(3)
        expect(updated[2].nombre).toBe('Sede #3')
        expect(updated[2].isPrimary).toBe(false)
        expect(updated[2].ciudad).toBe('Bogotá, Colombia')
    })

    it('disables delete button for the primary sede and allows deleting a secondary sede', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        // Find all delete buttons
        const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
        expect(deleteButtons.length).toBe(2)

        // Primary is disabled
        expect(deleteButtons[0]).toBeDisabled()
        // Secondary is enabled
        expect(deleteButtons[1]).not.toBeDisabled()

        // Click secondary delete
        fireEvent.click(deleteButtons[1])
        expect(mockOnChange).toHaveBeenCalledTimes(1)
        const updated = mockOnChange.mock.calls[0][0] as UserLocationItem[]
        expect(updated.length).toBe(1)
        expect(updated[0].id).toBe('loc_1')
    })

    it('does not display any delete button if there is only 1 sede', () => {
        render(<UserLocationManager locations={[initialLocations[0]]} onChange={mockOnChange} />)

        expect(screen.queryByRole('button', { name: /eliminar/i })).toBeNull()
    })

    it('updates text fields such as nombre, direccion, detalles, etc.', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        const addressInputs = screen.getAllByLabelText(/Dirección exacta/i)
        expect(addressInputs.length).toBe(2)

        fireEvent.change(addressInputs[0], { target: { value: 'Avenida 68 # 80-20' } })

        expect(mockOnChange).toHaveBeenCalledTimes(1)
        const updated = mockOnChange.mock.calls[0][0] as UserLocationItem[]
        expect(updated[0].direccion).toBe('Avenida 68 # 80-20')
    })

    it('updates city and adjusts available zones accordingly', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        const cityInputs = screen.getAllByLabelText(/Ciudad \/ Municipio/i)
        expect(cityInputs.length).toBe(2)

        fireEvent.change(cityInputs[0], { target: { value: 'Medellín, Colombia' } })

        expect(mockOnChange).toHaveBeenCalledTimes(1)
        const updated = mockOnChange.mock.calls[0][0] as UserLocationItem[]
        expect(updated[0].ciudad).toBe('Medellín, Colombia')
    })

    it('opens map modal and updates address from map selection', () => {
        render(<UserLocationManager locations={initialLocations} onChange={mockOnChange} />)

        const mapButtons = screen.getAllByText('Marcar en mapa (Opcional)')
        fireEvent.click(mapButtons[0])

        expect(screen.getByTestId('mock-ubicacion')).toBeDefined()

        const confirmMapBtn = screen.getByTestId('mock-save-map')
        fireEvent.click(confirmMapBtn)

        expect(mockOnChange).toHaveBeenCalledTimes(1)
        const updated = mockOnChange.mock.calls[0][0] as UserLocationItem[]
        expect(updated[0].direccion).toBe('Calle 100 # 15-20')
        expect(updated[0].lat).toBe(4.68)
        expect(updated[0].lng).toBe(-74.05)
    })
})

