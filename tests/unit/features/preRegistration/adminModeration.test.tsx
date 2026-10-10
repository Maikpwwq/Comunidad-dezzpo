/**
 * Admin Moderation Workbench & Dialog Tests (Phase 4)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PreRegistrationDetailDialog } from '@/features/admin/components/PreRegistrationDetailDialog'
import PreRegistrosAdminPage from '../../../../pages/admin/pre-registros/+Page'
import * as preRegService from '@services/preRegistration/preRegistrationService'
import type { PreRegistration } from '@/features/preRegistration/types'

vi.mock('@services/preRegistration/preRegistrationService', () => ({
    getAdminPreRegistrations: vi.fn(),
    getPreRegistrationCounts: vi.fn(),
    moderatePreRegistration: vi.fn(),
}))

const mockPendingCandidate: PreRegistration = {
    id: 'pr-test-1',
    version: 1,
    status: 'pendiente',
    submittedBy: 'user-recommender-123',
    createdAt: '2026-10-10T12:00:00.000Z',
    updatedAt: '2026-10-10T12:00:00.000Z',
    candidate: {
        displayName: 'Pedro Gómez Carpintero',
        phoneE164: '+573105556677',
        email: 'pedro@carpinteria.co',
        description: 'Carpintero con más de 10 años haciendo muebles a la medida y cocinas integrales.',
        skillIds: ['4', '7'],
        address: 'Calle 140 # 15-20, Cedritos',
        website: 'https://instagram.com/pedro_carpintero',
    },
    consent: {
        privacyNoticeVersion: 'V1.1',
        acceptedAt: '2026-10-10T12:00:00.000Z',
    },
    hasPossibleMatch: false,
}

const mockMatchCandidate: PreRegistration = {
    ...mockPendingCandidate,
    id: 'pr-test-2',
    hasPossibleMatch: true,
    matchedUserId: 'merchant-registered-uid-999',
}

describe('Admin Moderation Workbench & Dialog (Phase 4)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(preRegService.getPreRegistrationCounts).mockResolvedValue({
            pendientes: 1,
            aprobadas: 2,
            rechazadas: 1,
            duplicadas: 0,
        })
        vi.mocked(preRegService.getAdminPreRegistrations).mockResolvedValue([mockPendingCandidate])
    })

    describe('PreRegistrationDetailDialog', () => {
        it('renders candidate fields and submitter info when opened', () => {
            render(
                <PreRegistrationDetailDialog
                    open={true}
                    item={mockPendingCandidate}
                    onClose={vi.fn()}
                    onModerationComplete={vi.fn()}
                />,
            )

            expect(screen.getByText(/Ficha de Moderación/i)).toBeInTheDocument()
            expect(screen.getByDisplayValue('Pedro Gómez Carpintero')).toBeInTheDocument()
            expect(screen.getByDisplayValue('+573105556677')).toBeInTheDocument()
            expect(screen.getByText(/user-recommender-123/i)).toBeInTheDocument()
            expect(screen.getByText(/Versión V1.1/i)).toBeInTheDocument()
        })

        it('renders warning alert when hasPossibleMatch is true (R9)', () => {
            render(
                <PreRegistrationDetailDialog
                    open={true}
                    item={mockMatchCandidate}
                    onClose={vi.fn()}
                    onModerationComplete={vi.fn()}
                />,
            )

            expect(screen.getByText(/Alerta de Coincidencia \(R9\)/i)).toBeInTheDocument()
            expect(screen.getByText(/merchant-registered-uid-999/i)).toBeInTheDocument()
        })

        it('disables Aprobar button until checklist contrastedSources is checked', async () => {
            render(
                <PreRegistrationDetailDialog
                    open={true}
                    item={mockPendingCandidate}
                    onClose={vi.fn()}
                    onModerationComplete={vi.fn()}
                />,
            )

            const approveBtn = screen.getByRole('button', { name: /Aprobar \(Radar\)/i })
            expect(approveBtn).toBeDisabled()

            const checklistCheckbox = screen.getByLabelText(/Contrasté fuentes en internet \/ redes/i)
            fireEvent.click(checklistCheckbox)

            expect(approveBtn).not.toBeDisabled()
        })

        it('executes approval with updated edits and checklist', async () => {
            const onComplete = vi.fn()
            const onClose = vi.fn()
            vi.mocked(preRegService.moderatePreRegistration).mockResolvedValue({
                success: true,
            })

            render(
                <PreRegistrationDetailDialog
                    open={true}
                    item={mockPendingCandidate}
                    onClose={onClose}
                    onModerationComplete={onComplete}
                />,
            )

            const checklistCheckbox = screen.getByLabelText(/Contrasté fuentes en internet \/ redes/i)
            fireEvent.click(checklistCheckbox)

            const approveBtn = screen.getByRole('button', { name: /Aprobar \(Radar\)/i })
            fireEvent.click(approveBtn)

            await waitFor(() => {
                expect(preRegService.moderatePreRegistration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: 'pr-test-1',
                        expectedVersion: 1,
                        action: expect.objectContaining({
                            type: 'aprobar',
                            verification: expect.objectContaining({
                                contrastedWithSources: true,
                            }),
                        }),
                    }),
                )
            })

            expect(onComplete).toHaveBeenCalledWith(expect.stringContaining('aprobado e incorporado al Radar'))
            expect(onClose).toHaveBeenCalled()
        })

        it('handles rejection flow with closed reason code', async () => {
            const onComplete = vi.fn()
            vi.mocked(preRegService.moderatePreRegistration).mockResolvedValue({
                success: true,
            })

            render(
                <PreRegistrationDetailDialog
                    open={true}
                    item={mockPendingCandidate}
                    onClose={vi.fn()}
                    onModerationComplete={onComplete}
                />,
            )

            const rejectActionBtn = screen.getByRole('button', { name: /Rechazar/i })
            fireEvent.click(rejectActionBtn)

            const confirmRejectBtn = screen.getByRole('button', { name: /Confirmar Rechazo/i })
            expect(confirmRejectBtn).toBeInTheDocument()
            fireEvent.click(confirmRejectBtn)

            await waitFor(() => {
                expect(preRegService.moderatePreRegistration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: 'pr-test-1',
                        expectedVersion: 1,
                        action: expect.objectContaining({
                            type: 'rechazar',
                            reasonCode: 'informacion_insuficiente',
                        }),
                    }),
                )
            })
        })

        it('displays conflict message when version mismatch occurs (concurrency)', async () => {
            vi.mocked(preRegService.moderatePreRegistration).mockResolvedValue({
                success: false,
                code: 'CONFLICT',
                error: 'Version conflict',
            })

            render(
                <PreRegistrationDetailDialog
                    open={true}
                    item={mockPendingCandidate}
                    onClose={vi.fn()}
                    onModerationComplete={vi.fn()}
                />,
            )

            fireEvent.click(screen.getByLabelText(/Contrasté fuentes en internet \/ redes/i))
            fireEvent.click(screen.getByRole('button', { name: /Aprobar \(Radar\)/i }))

            await waitFor(() => {
                expect(screen.getByText(/Conflicto de concurrencia/i)).toBeInTheDocument()
            })
        })
    })

    describe('PreRegistrosAdminPage', () => {
        it('renders page header, KPI cards and queue table', async () => {
            render(<PreRegistrosAdminPage />)

            expect(screen.getByText(/Pre-Registros y Radar de Profesionales/i)).toBeInTheDocument()
            await waitFor(() => {
                expect(screen.getByText('Pedro Gómez Carpintero')).toBeInTheDocument()
            })
            expect(screen.getByText(/RADAR APROBADO/i)).toBeInTheDocument()
            expect(screen.getByText('2')).toBeInTheDocument()
        })

        it('filters table by search query in real time', async () => {
            render(<PreRegistrosAdminPage />)

            await waitFor(() => {
                expect(screen.getByText('Pedro Gómez Carpintero')).toBeInTheDocument()
            })

            const searchInput = screen.getByPlaceholderText(/Buscar por nombre, teléfono, oficio/i)
            fireEvent.change(searchInput, { target: { value: 'Inexistente' } })

            await waitFor(() => {
                expect(screen.queryByText('Pedro Gómez Carpintero')).not.toBeInTheDocument()
                expect(screen.getByText(/No se encontraron resultados/i)).toBeInTheDocument()
            })
        })
    })
})
