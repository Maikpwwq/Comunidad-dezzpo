/**
 * TiendaFormModal & TiendaFormDraftStore Unit Tests
 *
 * Verifies that Slogan and Descripción are distinct, independent fields:
 * - Slogan: short marketing tagline / phrase
 * - Descripción: detailed store offerings, products, and services
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { TiendaFormModal } from '@features/tiendas/components/TiendaFormModal'
import { useTiendaFormDraftStore, INITIAL_DRAFT } from '@stores/useTiendaFormDraftStore'
import type { TiendaDocument } from '@services/tiendas'

// Mock subcomponents
vi.mock('@features/tiendas/components/TiendaLogoUpload', () => ({
    TiendaLogoUpload: () => <div data-testid="mock-logo-upload" />,
}))

vi.mock('@features/tiendas/components/TiendaSocialLinksManager', () => ({
    TiendaSocialLinksManager: () => <div data-testid="mock-social-links" />,
}))

vi.mock('@features/tiendas/components/SedeManager', () => ({
    SedeManager: () => <div data-testid="mock-sede-manager" />,
}))

vi.mock('@hooks/useDuplicateNameCheck', () => ({
    useDuplicateNameCheck: () => ({
        isChecking: false,
        status: 'idle',
        matches: [],
        exactMatch: false,
        reset: vi.fn(),
        checkName: vi.fn(),
    }),
}))

describe('Tienda Registration Form — Slogan vs Descripción Separation', () => {
    beforeEach(() => {
        useTiendaFormDraftStore.setState({
            draft: { ...INITIAL_DRAFT },
            hasDraft: false,
        })
    })

    it('draft store maintains slogan and descripcion as independent fields', () => {
        const store = useTiendaFormDraftStore.getState()
        expect(store.draft.slogan).toBe('')
        expect(store.draft.descripcion).toBe('')

        store.updateDraft({
            slogan: 'Líderes en perfiles de acero',
            descripcion: 'Distribuidor mayorista de perfiles estructurales, tubos y soldaduras con más de 20 años de experiencia.',
        })

        const updated = useTiendaFormDraftStore.getState().draft
        expect(updated.slogan).toBe('Líderes en perfiles de acero')
        expect(updated.descripcion).toBe(
            'Distribuidor mayorista de perfiles estructurales, tubos y soldaduras con más de 20 años de experiencia.'
        )
    })

    it('renders separate input fields for Slogan and Descripción in TiendaFormModal', () => {
        render(
            <TiendaFormModal
                open={true}
                onClose={() => {}}
                onSave={vi.fn().mockResolvedValue(true)}
            />
        )

        const sloganInput = screen.getByLabelText(/Slogan o Frase Comercial/i)
        const descripcionInput = screen.getByLabelText(/Descripción de la Tienda/i)

        expect(sloganInput).toBeInTheDocument()
        expect(descripcionInput).toBeInTheDocument()
        expect(sloganInput).not.toBe(descripcionInput)
    })

    it('hydrates initialData with both slogan and descripcion in edit mode', () => {
        const mockTienda: TiendaDocument = {
            id: 'tienda-1',
            nombre: 'Aluminios del Norte',
            slug: 'aluminios-del-norte',
            slogan: 'Calidad que perdura',
            descripcion: 'Venta de perfiles de aluminio y vidrio templado.',
            categorias: ['aluminio_vidrio'],
            sedes: [
                {
                    id: 's1',
                    nombreSede: 'Principal',
                    direccion: 'Calle 80 # 20-30',
                    ciudad: 'Bogotá, Colombia',
                    zona: 'barrios_unidos',
                },
            ],
            estado: 'aprobado',
            origen: 'equipo_dezzpo',
            createdBy: 'admin',
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
        }

        render(
            <TiendaFormModal
                open={true}
                onClose={() => {}}
                onSave={vi.fn().mockResolvedValue(true)}
                initialData={mockTienda}
            />
        )

        const sloganInput = screen.getByLabelText(/Slogan o Frase Comercial/i) as HTMLInputElement
        const descripcionInput = screen.getByLabelText(/Descripción de la Tienda/i) as HTMLTextAreaElement

        expect(sloganInput.value).toBe('Calidad que perdura')
        expect(descripcionInput.value).toBe('Venta de perfiles de aluminio y vidrio templado.')
    })

    it('submits payload with distinct slogan and descripcion values', async () => {
        const handleSave = vi.fn().mockResolvedValue(true)
        const handleClose = vi.fn()

        // Setup valid categories and sedes in draft before rendering
        useTiendaFormDraftStore.setState({
            draft: {
                ...INITIAL_DRAFT,
                selectedCategoryKeys: ['pinturas'],
                sedes: [
                    {
                        id: 's1',
                        nombreSede: 'Sede 1',
                        direccion: 'Av 68 # 45-10',
                        ciudad: 'Bogotá, Colombia',
                        zona: 'fontibon',
                    },
                ],
            },
            hasDraft: true,
        })

        render(
            <TiendaFormModal
                open={true}
                onClose={handleClose}
                onSave={handleSave}
            />
        )

        // Fill business name
        const nameInput = screen.getByLabelText(/Nombre del Comercio \/ Tienda \*/i)
        fireEvent.change(nameInput, { target: { value: 'Pinturas Pro' } })

        // Fill Slogan
        const sloganInput = screen.getByLabelText(/Slogan o Frase Comercial/i)
        fireEvent.change(sloganInput, { target: { value: 'El color de tus sueños' } })

        // Fill Descripción
        const descInput = screen.getByLabelText(/Descripción de la Tienda/i)
        fireEvent.change(descInput, { target: { value: 'Amplia gama de pinturas vinílicas, esmaltes y poliuretanos.' } })

        // Submit form
        const submitBtn = screen.getByRole('button', { name: /Enviar Tienda|Guardar Cambios/i })
        fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(handleSave).toHaveBeenCalledTimes(1)
            const payload = handleSave.mock.calls[0][0]
            expect(payload.nombre).toBe('Pinturas Pro')
            expect(payload.slogan).toBe('El color de tus sueños')
            expect(payload.descripcion).toBe('Amplia gama de pinturas vinílicas, esmaltes y poliuretanos.')
        })
    })
})
