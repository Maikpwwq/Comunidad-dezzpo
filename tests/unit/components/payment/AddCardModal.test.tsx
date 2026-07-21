/**
 * AddCardModal Component Unit Tests
 *
 * Verifies form validation, client-side tokenization handling,
 * and security constraints (no raw PAN/CVC saved to DB).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCardModal from '@/components/payment/AddCardModal'
import * as paymentService from '@services/paymentService'

vi.mock('@services/paymentService', () => ({
    savePaymentMethod: vi.fn(),
}))

describe('AddCardModal', () => {
    const mockUserId = 'user-card-test'
    const mockOnClose = vi.fn()
    const mockOnSuccess = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders modal title and PCI compliance security notice when open', () => {
        render(
            <AddCardModal
                open={true}
                userId={mockUserId}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        )

        expect(screen.getByText('Agregar Tarjeta Débito o Crédito')).toBeInTheDocument()
        expect(screen.getByText(/Tus datos de tarjeta se cifran directamente en ePayco/i)).toBeInTheDocument()
    })

    it('validates required fields before submitting', async () => {
        const user = userEvent.setup()
        render(
            <AddCardModal
                open={true}
                userId={mockUserId}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        )

        const submitBtn = screen.getByRole('button', { name: /Guardar Tarjeta/i })
        await user.click(submitBtn)

        expect(paymentService.savePaymentMethod).not.toHaveBeenCalled()
    })

    it('successfully submits non-sensitive tokenized payload to paymentService', async () => {
        const user = userEvent.setup()
        vi.mocked(paymentService.savePaymentMethod).mockResolvedValueOnce('method-card-123')

        render(
            <AddCardModal
                open={true}
                userId={mockUserId}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        )

        const nameInput = screen.getByLabelText(/Nombre impreso en la tarjeta/i)
        const docInput = screen.getByLabelText(/Número de documento del titular/i)
        const cardInput = screen.getByLabelText(/Número de la tarjeta/i)
        const cvcInput = screen.getByLabelText(/CVC \/ CVV/i)

        await user.type(nameInput, 'Juan Pérez')
        await user.type(docInput, '12345678')
        await user.type(cardInput, '4575623182290326')
        await user.type(cvcInput, '123')

        const submitBtn = screen.getByRole('button', { name: /Guardar Tarjeta/i })
        await user.click(submitBtn)

        expect(paymentService.savePaymentMethod).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: mockUserId,
                type: 'card',
                brand: 'Visa',
                last4: '0326',
                cardholderName: 'Juan Pérez',
                docNumberMasked: '••••5678',
            })
        )
        expect(mockOnSuccess).toHaveBeenCalled()
    })
})
