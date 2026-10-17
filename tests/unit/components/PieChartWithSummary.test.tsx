import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PieChartWithSummary } from '@/features/admin/components/PieChartWithSummary'
import type { PieDataset } from '@/services/admin/analytics/types'

const mockDataset: PieDataset = {
    dimension: 'servicio',
    total: 100,
    distinct: 3,
    slices: [
        {
            key: 'plomeria',
            label: 'Plomería',
            count: 50,
            fraction: 0.5,
            permille: 500,
            rank: 1,
            kind: 'item',
        },
        {
            key: 'electricidad',
            label: 'Electricidad',
            count: 30,
            fraction: 0.3,
            permille: 300,
            rank: 2,
            kind: 'item',
        },
        {
            key: 'otros',
            label: 'Otros (2 servicios)',
            count: 20,
            fraction: 0.2,
            permille: 200,
            rank: null,
            kind: 'otros',
            grouped: { count: 2, top: [] },
        },
    ],
}

describe('PieChartWithSummary Component', () => {
    it('renders card title, subtitle and region role', () => {
        render(
            <PieChartWithSummary
                title="Servicios consultados"
                subtitle="Categorías con mayor demanda"
                dimension="servicio"
                dataset={mockDataset}
            />,
        )

        expect(screen.getByRole('region', { name: /gráfico de torta: servicios consultados/i })).toBeDefined()
        expect(screen.getByText('Servicios consultados')).toBeDefined()
        expect(screen.getByText('Categorías con mayor demanda')).toBeDefined()
    })

    it('renders empty state when dataset has total 0', () => {
        const emptyDataset: PieDataset = {
            dimension: 'zona',
            total: 0,
            distinct: 0,
            slices: [],
        }

        render(
            <PieChartWithSummary
                title="Zonas"
                subtitle="Consultas por zona"
                dimension="zona"
                dataset={emptyDataset}
            />,
        )

        expect(screen.getByText('Sin búsquedas registradas')).toBeDefined()
    })

    it('renders all slices in the SVG and the legend items', () => {
        render(
            <PieChartWithSummary
                title="Servicios"
                subtitle="Servicios"
                dimension="servicio"
                dataset={mockDataset}
            />,
        )

        // Slices in legend
        expect(screen.getAllByText('Plomería').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Electricidad').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Otros (2 servicios)').length).toBeGreaterThanOrEqual(1)

        // Slices have buttons in SVG
        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThanOrEqual(3)
    })

    it('updates selection and live announcement on slice click', () => {
        const onSliceClick = vi.fn()
        render(
            <PieChartWithSummary
                title="Servicios"
                subtitle="Servicios"
                dimension="servicio"
                dataset={mockDataset}
                onSliceClick={onSliceClick}
            />,
        )

        const plomeriaSlice = screen.getByRole('button', { name: /plomería: 50 búsquedas/i })
        fireEvent.click(plomeriaSlice)

        expect(onSliceClick).toHaveBeenCalledWith(mockDataset.slices[0])
        expect(screen.getByText(/representa el/i)).toBeDefined()
        expect(screen.getAllByText('50,0%').length).toBeGreaterThanOrEqual(1)
    })

    it('navigates with keyboard arrow keys and resets with Escape', () => {
        render(
            <PieChartWithSummary
                title="Servicios"
                subtitle="Servicios"
                dimension="servicio"
                dataset={mockDataset}
            />,
        )

        const region = screen.getByRole('region')
        
        // Navigate right -> selects first/next slice
        fireEvent.keyDown(region, { key: 'ArrowRight' })
        expect(screen.getAllByText('Electricidad').length).toBeGreaterThanOrEqual(1)

        // Reset with Escape
        fireEvent.keyDown(region, { key: 'Escape' })
        // Defaults back to dominant slice summary
        expect(screen.getByText('Mayor Demanda Registrada')).toBeDefined()
    })
})
