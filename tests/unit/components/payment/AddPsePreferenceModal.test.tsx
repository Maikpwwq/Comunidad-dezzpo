/**
 * AddPsePreferenceModal & CashPaymentInfoModal Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddPsePreferenceModal from '@/components/payment/AddPsePreferenceModal'
import CashPaymentInfoModal from '@/components/payment/CashPaymentInfoModal'
import * as paymentService from '@services/paymentService'

vi.mock('@services/paymentService', () => ({
    savePaymentMethod: vi.fn(),
}))

describe('AddPsePreferenceModal', () => {
    const mockUserId = 'user-pse-test'
    const mockOnClose = vi.fn()
    const mockOnSuccess = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders PSE preference modal title and bank notice', () => {
        render(
            <AddPsePreferenceModal
                open={true}
                userId={mockUserId}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        )

        expect(screen.getByText('Preferencia de Banco PSE')).toBeInTheDocument()
        expect(screen.getByText(/El servicio PSE no guarda claves de banco por seguridad/i)).toBeInTheDocument()
    })

    it('saves PSE bank preference when form is submitted', async () => {
        const user = userEvent.setup()
        vi.mocked(paymentService.savePaymentMethod).mockResolvedValueOnce('method-pse-123')

        render(
            <AddPsePreferenceModal
                open={true}
                userId={mockUserId}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        )

        const docInput = screen.getByLabelText(/Número de documento del titular/i)
        await user.type(docInput, '87654321')

        const submitBtn = screen.getByRole('button', { name: /Guardar Banco Preferido/i })
        await user.click(submitBtn)

        expect(paymentService.savePaymentMethod).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: mockUserId,
                type: 'pse',
                bankCode: '1007',
                bankName: 'Bancolombia',
                docNumberMasked: '••••4321',
            })
        )
        expect(mockOnSuccess).toHaveBeenCalled()
    })
})

describe('CashPaymentInfoModal', () => {
    const mockOnClose = vi.fn()

    it('renders cash payment steps notice', () => {
        render(<CashPaymentInfoModal open={true} onClose={mockOnClose} />)

        expect(screen.getByText(/Pago en Efectivo \(Efecty, Baloto, Corresponsales\)/i)).toBeInTheDocument()
        expect(screen.getByText(/¡No requiere registro ni tarjetas!/i)).toBeInTheDocument()
        expect(screen.getByText(/1\. Selecciona Efectivo al Pagar/i)).toBeInTheDocument()
    })

    it('triggers onClose when clicking Entendido', async () => {
        const user = userEvent.setup()
        render(<CashPaymentInfoModal open={true} onClose={mockOnClose} />)

        const closeBtn = screen.getByRole('button', { name: /Entendido/i })
        await user.click(closeBtn)

        expect(mockOnClose).toHaveBeenCalled()
    })
})
