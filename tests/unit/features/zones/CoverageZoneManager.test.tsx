/**
 * CoverageZoneManager Component Tests
 *
 * Verifies UI requirements and user interactions:
 * - R1: Combobox search, keyboard navigation, result selection
 * - R2: Resolution of legacy "otra-zona" chip with "Indicar cuál"
 * - R6: Cap warning at 15 zones, grandfathering indication
 * - R7: Tray rendering, individual remove, and "Quitar todas"
 * - R10: Accessible labels, aria attributes, focus management
 * - R11: Pasting comma-separated list
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoverageZoneManager } from '../../../../src/features/zones/components/CoverageZoneManager/CoverageZoneManager'

describe('CoverageZoneManager Component', () => {
    const defaultProps = {
        coverageZones: ['suba', 'usaquen'],
        onCoverageZonesChange: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders search input with accessible combobox role and placeholder', () => {
        render(<CoverageZoneManager {...defaultProps} />)
        const input = screen.getByRole('combobox', { name: /buscar zona o municipio de colombia/i })
        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('placeholder', 'Buscar zona o municipio (ej: Medellín, Chía, Suba...)')
    })

    it('renders selected zones in tray with correct counter', () => {
        render(<CoverageZoneManager {...defaultProps} />)
        expect(screen.getByText(/TUS ZONAS SELECCIONADAS \(2\/15\)/i)).toBeInTheDocument()
        expect(screen.getByText('Suba (Bogotá D.C.)')).toBeInTheDocument()
        expect(screen.getByText('Usaquén (Bogotá D.C.)')).toBeInTheDocument()
    })

    it('does NOT render opaque "otra-zona" in the curated quick-access chips', () => {
        render(<CoverageZoneManager {...defaultProps} />)
        // Ensure "Otra Zona" is not present as a button/chip in curated sections
        const curatedChips = screen.queryByRole('button', { name: /^otra zona$/i })
        expect(curatedChips).not.toBeInTheDocument()
    })

    it('displays legacy "otra-zona" warning chip with "Indicar cuál" button when present', () => {
        render(<CoverageZoneManager coverageZones={['otra-zona', 'suba']} onCoverageZonesChange={vi.fn()} />)
        expect(screen.getByText('Otra zona (sin especificar)')).toBeInTheDocument()
        const specifyBtn = screen.getByRole('button', { name: /indicar cuál/i })
        expect(specifyBtn).toBeInTheDocument()
    })

    it('focuses search input when clicking "Indicar cuál"', async () => {
        render(<CoverageZoneManager coverageZones={['otra-zona']} onCoverageZonesChange={vi.fn()} />)
        const specifyBtn = screen.getByRole('button', { name: /indicar cuál/i })
        const input = screen.getByRole('combobox', { name: /buscar zona o municipio de colombia/i })

        await userEvent.click(specifyBtn)
        expect(input).toHaveFocus()
    })

    it('allows removing a single zone by clicking its delete icon', async () => {
        const onCoverageZonesChange = vi.fn()
        render(<CoverageZoneManager coverageZones={['suba', 'usaquen']} onCoverageZonesChange={onCoverageZonesChange} />)

        // Find delete buttons in MUI Chips
        const deleteButtons = screen.getAllByTestId('CancelIcon')
        expect(deleteButtons.length).toBeGreaterThanOrEqual(2)

        fireEvent.click(deleteButtons[0]!)
        expect(onCoverageZonesChange).toHaveBeenCalledWith(['usaquen'])
    })

    it('allows clearing all zones with "Quitar todas"', async () => {
        const onCoverageZonesChange = vi.fn()
        render(<CoverageZoneManager coverageZones={['suba', 'usaquen']} onCoverageZonesChange={onCoverageZonesChange} />)

        const clearAllBtn = screen.getByRole('button', { name: /quitar todas/i })
        await userEvent.click(clearAllBtn)

        expect(onCoverageZonesChange).toHaveBeenCalledWith([])
    })

    it('displays cap reached warning when 15 zones are selected', () => {
        const fifteenZones = [
            'suba', 'usaquen', 'chapinero', 'teusaquillo', 'kennedy',
            'engativa', 'fontibon', 'barrios-unidos', 'bosa', 'puente-aranda',
            'los-martires', 'santa-fe', 'san-cristobal', 'usme', 'tunjuelito'
        ]
        render(<CoverageZoneManager coverageZones={fifteenZones} onCoverageZonesChange={vi.fn()} />)

        expect(screen.getByText(/Llegaste al máximo de 15 zonas/i)).toBeInTheDocument()
    })

    it('displays grandfathering banner when profile already exceeds 15 zones', () => {
        const sixteenZones = [
            'suba', 'usaquen', 'chapinero', 'teusaquillo', 'kennedy',
            'engativa', 'fontibon', 'barrios-unidos', 'bosa', 'puente-aranda',
            'los-martires', 'santa-fe', 'san-cristobal', 'usme', 'tunjuelito',
            'antonio-narino'
        ]
        render(<CoverageZoneManager coverageZones={sixteenZones} onCoverageZonesChange={vi.fn()} />)

        expect(screen.getByText(/Tienes 16 zonas guardadas/i)).toBeInTheDocument()
    })

    it('filters zones when typing and selects an option via Enter key', async () => {
        const onCoverageZonesChange = vi.fn()
        render(<CoverageZoneManager coverageZones={[]} onCoverageZonesChange={onCoverageZonesChange} />)

        const input = screen.getByRole('combobox', { name: /buscar zona o municipio de colombia/i })
        await userEvent.type(input, 'Soacha')

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        // Navigate with ArrowDown and Enter
        fireEvent.keyDown(input, { key: 'ArrowDown' })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(onCoverageZonesChange).toHaveBeenCalledWith(['soacha'])
    })

    it('handles pasting comma-separated list of zones (R11)', async () => {
        const onCoverageZonesChange = vi.fn()
        render(<CoverageZoneManager coverageZones={[]} onCoverageZonesChange={onCoverageZonesChange} />)

        const input = screen.getByRole('combobox', { name: /buscar zona o municipio de colombia/i })

        // Simulate paste event with comma-separated text
        fireEvent.paste(input, {
            clipboardData: {
                getData: () => 'Suba, Chía, Cajicá',
            },
        })

        expect(onCoverageZonesChange).toHaveBeenCalledWith(['suba', 'chia', 'cajica'])
    })
})
