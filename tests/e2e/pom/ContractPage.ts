import type { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for the Contract pages:
 *   - /app/contratacion (contract management)
 *   - /app/contratacion/respuesta (payment response)
 *   - /app/formas-pago (payment methods)
 */
export class ContractPage {
    readonly page: Page

    // Contract list / management
    readonly contractsList: Locator
    readonly contractCard: Locator
    readonly contractStatusBadge: Locator
    readonly payButton: Locator

    // Contract detail
    readonly agreedAmountLabel: Locator
    readonly clientNameLabel: Locator
    readonly providerNameLabel: Locator

    // Payment response page
    readonly paymentSuccessMessage: Locator
    readonly paymentErrorMessage: Locator
    readonly transactionReference: Locator

    constructor(page: Page) {
        this.page = page

        // Contract list elements
        this.contractsList = page.locator('[data-testid="contracts-list"], .contracts-container').first()
        this.contractCard = page.locator('[data-testid="contract-card"]').first()
        this.contractStatusBadge = page.getByText(/pendiente|activo|completado|disputado/i).first()
        this.payButton = page.getByRole('button', { name: /pagar/i })

        // Contract detail fields
        this.agreedAmountLabel = page.getByText(/monto|valor acordado|total/i).first()
        this.clientNameLabel = page.getByText(/cliente|propietario/i).first()
        this.providerNameLabel = page.getByText(/proveedor|comerciante/i).first()

        // Payment response
        this.paymentSuccessMessage = page.getByText(/pago exitoso|transacción aprobada|aprobada/i)
        this.paymentErrorMessage = page.getByText(/pago rechazado|error en la transacción|rechazada/i)
        this.transactionReference = page.getByText(/referencia|ref_payco/i)
    }

    async gotoContractManagement() {
        await this.page.goto('/app/contratacion')
    }

    async gotoPaymentResponse() {
        await this.page.goto('/app/contratacion/respuesta')
    }

    async gotoPaymentMethods() {
        await this.page.goto('/app/formas-pago')
    }

    async getContractCount(): Promise<number> {
        return await this.page.locator('[data-testid="contract-card"]').count()
    }
}
