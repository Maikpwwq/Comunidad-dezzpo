/**
 * Component Tests — PreRegistrationModal (Phase 3)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PreRegistrationModal } from '@/features/preRegistration/components/PreRegistrationModal'
import * as preRegService from '@services/preRegistration'

vi.mock('@services/preRegistration', () => ({
    submitPreRegistration: vi.fn(),
    checkEarlyCandidateName: vi.fn(),
    getMyPreRegistrations: vi.fn(),
    withdrawPreRegistration: vi.fn(),
}))

describe('PreRegistrationModal Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(preRegService.checkEarlyCandidateName).mockResolvedValue({
            isAvailable: true,
        })
        vi.mocked(preRegService.getMyPreRegistrations).mockResolvedValue([])
    })

    it('renders the dialog when open=true with header and tabs', () => {
        render(<PreRegistrationModal open={true} onClose={vi.fn()} />)

        expect(screen.getByRole('heading', { name: /recomendar un profesional/i })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: /recomendar profesional/i })).toBeInTheDocument()
        expect(screen.getByRole('tab', { name: /mis recomendaciones/i })).toBeInTheDocument()
    })

    it('displays required fields and disabled submit button when empty', () => {
        render(<PreRegistrationModal open={true} onClose={vi.fn()} />)

        const nameInput = screen.getByLabelText(/nombre del profesional o empresa/i)
        const emailInput = screen.getByLabelText(/correo electrónico/i)
        const phoneInput = screen.getByLabelText(/whatsapp o teléfono celular/i)
        const descInput = screen.getByLabelText(/¿a qué se dedica\? cuéntanos en pocas palabras/i)
        const consentCheckbox = screen.getByRole('checkbox', { name: /aviso de privacidad/i })
        const submitBtn = screen.getByRole('button', { name: /enviar recomendación/i })

        expect(nameInput).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(phoneInput).toBeInTheDocument()
        expect(descInput).toBeInTheDocument()
        expect(consentCheckbox).not.toBeChecked()
        expect(submitBtn).toBeDisabled()
    })

    it('triggers debounced early check when typing candidate name and shows warning if exists', async () => {
        vi.mocked(preRegService.checkEarlyCandidateName).mockResolvedValue({
            isAvailable: false,
            existsInDirectory: true,
            publicProfile: { userId: 'merchant_99', displayName: 'Construcciones Morales' },
        })

        render(<PreRegistrationModal open={true} onClose={vi.fn()} />)

        const nameInput = screen.getByLabelText(/nombre del profesional o empresa/i)
        fireEvent.change(nameInput, { target: { value: 'Morales' } })

        await waitFor(() => {
            expect(preRegService.checkEarlyCandidateName).toHaveBeenCalledWith('Morales')
        })

        await waitFor(() => {
            expect(
                screen.getByText(/este profesional ya está registrado en dezzpo/i),
            ).toBeInTheDocument()
        })
    })

    it('enables submit button only when all required fields and consent are valid', async () => {
        render(<PreRegistrationModal open={true} onClose={vi.fn()} />)

        fireEvent.change(screen.getByLabelText(/nombre del profesional o empresa/i), {
            target: { value: 'Maestro Mario Gómez' },
        })
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
            target: { value: 'mario.gomez@gmail.com' },
        })
        fireEvent.change(screen.getByLabelText(/whatsapp o teléfono celular/i), {
            target: { value: '310 987 6543' },
        })
        fireEvent.change(
            screen.getByLabelText(/¿a qué se dedica\? cuéntanos en pocas palabras/i),
            {
                target: {
                    value: 'Pintor profesional con 15 años de experiencia en interiores y estuco.',
                },
            },
        )

        const submitBtn = screen.getByRole('button', { name: /enviar recomendación/i })
        expect(submitBtn).toBeDisabled()

        // Check consent checkbox
        const consentCheckbox = screen.getByRole('checkbox', { name: /aviso de privacidad/i })
        fireEvent.click(consentCheckbox)

        expect(submitBtn).not.toBeDisabled()
    })

    it('submits recommendation successfully and renders success screen with WhatsApp CTA', async () => {
        vi.mocked(preRegService.submitPreRegistration).mockResolvedValue({
            success: true,
            id: 'pre_reg_new_123',
        })

        render(<PreRegistrationModal open={true} onClose={vi.fn()} />)

        fireEvent.change(screen.getByLabelText(/nombre del profesional o empresa/i), {
            target: { value: 'Carlos Electricista' },
        })
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
            target: { value: 'carlos@electricidad.co' },
        })
        fireEvent.change(screen.getByLabelText(/whatsapp o teléfono celular/i), {
            target: { value: '320 484 2897' },
        })
        fireEvent.change(
            screen.getByLabelText(/¿a qué se dedica\? cuéntanos en pocas palabras/i),
            {
                target: {
                    value: 'Técnico electricista certificado con matrícula conte vigente.',
                },
            },
        )
        fireEvent.click(screen.getByRole('checkbox', { name: /aviso de privacidad/i }))

        const submitBtn = screen.getByRole('button', { name: /enviar recomendación/i })
        fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(preRegService.submitPreRegistration).toHaveBeenCalledTimes(1)
        })

        await waitFor(() => {
            expect(screen.getByText(/¡gracias por recomendar!/i)).toBeInTheDocument()
            expect(
                screen.getByRole('link', { name: /avísale por whatsapp/i }),
            ).toBeInTheDocument()
        })
    })

    it('renders user submissions in Tab 2 and handles withdraw action', async () => {
        vi.mocked(preRegService.getMyPreRegistrations).mockResolvedValue([
            {
                id: 'sub_1',
                status: 'pendiente',
                createdAt: new Date().toISOString(),
                candidate: {
                    displayName: 'Maestro Plomero Juan',
                    skillIds: ['Plomería'],
                },
            },
            {
                id: 'sub_2',
                status: 'aprobada',
                createdAt: new Date().toISOString(),
                candidate: {
                    displayName: 'Vidrios y Aluminios San Pedro',
                    skillIds: ['Vidriería'],
                },
            },
        ])
        vi.mocked(preRegService.withdrawPreRegistration).mockResolvedValue({ success: true })
        vi.spyOn(window, 'confirm').mockReturnValue(true)

        render(<PreRegistrationModal open={true} onClose={vi.fn()} />)

        // Switch to Tab 2
        fireEvent.click(screen.getByRole('tab', { name: /mis recomendaciones/i }))

        await waitFor(() => {
            expect(screen.getByText('Maestro Plomero Juan')).toBeInTheDocument()
            expect(screen.getByText('Vidrios y Aluminios San Pedro')).toBeInTheDocument()
            expect(screen.getByText('En revisión')).toBeInTheDocument()
            expect(screen.getByText('En radar Dezzpo')).toBeInTheDocument()
        })

        // Click Retirar on pending submission
        const withdrawBtn = screen.getByRole('button', { name: /retirar/i })
        fireEvent.click(withdrawBtn)

        await waitFor(() => {
            expect(preRegService.withdrawPreRegistration).toHaveBeenCalledWith('sub_1')
        })
    })
})
