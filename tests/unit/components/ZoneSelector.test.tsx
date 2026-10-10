/**
 * Tests for ZoneCombobox and ZoneSelector
 *
 * Verifies:
 * - WAI-ARIA combobox accessibility attributes
 * - Hover prefetching trigger
 * - Search filtering and selection
 * - "Otra zona" activation and cancelation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ZoneCombobox } from '@components/common/ZoneSelector/ZoneCombobox'
import { ZoneSelector } from '@components/common/ZoneSelector/ZoneSelector'
import * as divipolaService from '@services/matching/divipolaService'

describe('ZoneCombobox Component', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('renders with ARIA combobox role and placeholder', () => {
        render(<ZoneCombobox onSelect={vi.fn()} />)
        const input = screen.getByRole('combobox')
        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('aria-autocomplete', 'list')
        expect(input).toHaveAttribute('aria-expanded', 'false')
    })

    it('triggers prefetch on mouseEnter and onFocus', () => {
        const prefetchSpy = vi.spyOn(divipolaService, 'prefetchDivipolaDataset')
        render(<ZoneCombobox onSelect={vi.fn()} />)

        const input = screen.getByRole('combobox')
        fireEvent.mouseEnter(input)
        expect(prefetchSpy).toHaveBeenCalled()

        fireEvent.focus(input)
        expect(prefetchSpy).toHaveBeenCalledTimes(2)
    })

    it('searches and displays municipality options when typing', async () => {
        const onSelect = vi.fn()
        render(<ZoneCombobox onSelect={onSelect} />)

        const input = screen.getByRole('combobox')
        await userEvent.type(input, 'medellin')

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        const option = await screen.findByText('Medellín')
        expect(option).toBeInTheDocument()

        await userEvent.click(option)
        expect(onSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                code: '05001',
                municipio: 'Medellín',
            })
        )
    })

    it('handles keyboard navigation with ArrowDown and Enter', async () => {
        const onSelect = vi.fn()
        render(<ZoneCombobox onSelect={onSelect} />)

        const input = screen.getByRole('combobox')
        await userEvent.type(input, 'cali')

        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument()
        })

        fireEvent.keyDown(input, { key: 'ArrowDown' })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(onSelect).toHaveBeenCalled()
    })
})

describe('ZoneSelector Component', () => {
    it('renders select with Bogotá and Otra zona as second option', () => {
        render(<ZoneSelector value="bogota" onChange={vi.fn()} />)
        const select = screen.getByRole('combobox')
        expect(select).toBeInTheDocument()

        const options = screen.getAllByRole('option')
        expect(options[0]).toHaveValue('bogota')
        expect(options[1]).toHaveValue('otra-zona')
    })

    it('activates ZoneCombobox when "otra-zona" is selected', async () => {
        const onChange = vi.fn()
        const { rerender } = render(<ZoneSelector value="bogota" onChange={onChange} />)

        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'otra-zona' } })

        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                zone: 'otra-zona',
            })
        )

        rerender(<ZoneSelector value="otra-zona" onChange={onChange} />)
        expect(screen.getByPlaceholderText(/¿En qué ciudad o municipio\?/i)).toBeInTheDocument()
    })
})
