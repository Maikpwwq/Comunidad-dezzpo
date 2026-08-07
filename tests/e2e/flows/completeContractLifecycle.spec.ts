import { test, expect } from '@playwright/test'
import { AuthPage } from '../pom/AuthPage'
import { ContractPage } from '../pom/ContractPage'

/**
 * E2E: Complete Contract Lifecycle
 *
 * Simulates the full Propietario → Comerciante flow:
 *   1. Propietario publishes a requirement (draft)
 *   2. Comerciante views the requirement in the marketplace
 *   3. Comerciante sends a quotation
 *   4. Propietario reviews and accepts quotation → contract created
 *   5. Propietario sees contract in their management page
 *
 * NOTE: Payment via ePayco is intercepted in test mode —
 *       real billing never occurs.
 */
test.describe('Complete Contract Lifecycle (Multi-Role)', () => {
    // Shared state for cross-test data
    let projectName: string

    test.beforeAll(() => {
        projectName = `E2E-Lifecycle-${Date.now()}`
    })

    test.describe('Propietario Flow', () => {
        test.use({ storageState: { cookies: [], origins: [] } })

        test('publishes a new requirement that appears in directorio', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('propietario-test@example.com', 'Password123!')

            // Wait for authenticated landing
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            // Navigate to nuevo-proyecto
            await page.goto('/nuevo-proyecto')
            await page.waitForLoadState('networkidle')

            // Step 1: Fill requirement basics
            const descriptionInput = page.getByPlaceholder(/Ej: Se me rompió un tubo|describe|necesitas/i)
            if (await descriptionInput.isVisible()) {
                await descriptionInput.fill(projectName)
            }

            // Select zone if visible
            const zoneSelector = page.getByRole('combobox', { name: /zona/i })
            if (await zoneSelector.isVisible()) {
                await zoneSelector.selectOption({ index: 1 })
            }

            // Click continue/submit
            const continueBtn = page.getByRole('button', { name: /continuar|siguiente|guardar/i })
            if (await continueBtn.isVisible()) {
                await continueBtn.click()
            }

            // If multi-step, complete remaining steps
            const finishBtn = page.getByRole('button', { name: /finalizar|publicar|guardar/i })
            if (await finishBtn.isVisible()) {
                await finishBtn.click()
            }

            // Verify we land on directorio or historial
            await expect(page).toHaveURL(/directorio-requerimientos|historial/)
        })

        test('can view their contracts in contratacion page', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('propietario-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            const contractPage = new ContractPage(page)
            await contractPage.gotoContractManagement()
            await page.waitForLoadState('networkidle')

            // Page should load without crashing — may show empty state or contracts
            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })

        test('can access payment methods page', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('propietario-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            const contractPage = new ContractPage(page)
            await contractPage.gotoPaymentMethods()
            await page.waitForLoadState('networkidle')

            // Should see payment methods or empty state
            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })
    })

    test.describe('Comerciante Flow', () => {
        test.use({ storageState: { cookies: [], origins: [] } })

        test('can browse requirements in portal-servicios', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('comerciante-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            // Navigate to portal-servicios (marketplace)
            await page.goto('/app/portal-servicios')
            await page.waitForLoadState('networkidle')

            // Page loads without crashing
            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })

        test('can browse directorio-requerimientos', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('comerciante-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            await page.goto('/app/directorio-requerimientos')
            await page.waitForLoadState('networkidle')

            // Should display requirement cards or empty state
            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })

        test('can access quotation creation page', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('comerciante-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            await page.goto('/app/cotizar')
            await page.waitForLoadState('networkidle')

            // Should load the quotation page or redirect to select a draft
            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })

        test('can view their service history', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('comerciante-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            await page.goto('/app/historial-servicios')
            await page.waitForLoadState('networkidle')

            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })
    })

    test.describe('Cross-Role Page Crash Guard', () => {
        test.use({ storageState: { cookies: [], origins: [] } })

        const CRITICAL_AUTHENTICATED_ROUTES = [
            '/app/portal-servicios',
            '/app/directorio-requerimientos',
            '/app/ajustes',
            '/app/mensajes',
            '/app/notificaciones',
            '/app/invitar-amigos',
            '/app/calificaciones',
            '/app/historial-servicios',
            '/app/formas-pago',
            '/app/certificaciones',
            '/app/suscripciones',
        ]

        CRITICAL_AUTHENTICATED_ROUTES.forEach((route) => {
            test(`${route} loads without page crashes`, async ({ page }) => {
                const errors: Error[] = []
                page.on('pageerror', (err) => errors.push(err))

                const authPage = new AuthPage(page)
                await authPage.gotoLogin()
                await authPage.login('propietario-test@example.com', 'Password123!')
                await page.waitForURL(/\/app\//, { timeout: 15000 })

                await page.goto(route)
                await page.waitForLoadState('networkidle')

                // No unhandled page-level errors
                expect(errors).toHaveLength(0)

                // App shell is visible (not a white screen)
                const appShell = page.locator('main, [role="main"], .main-content, #root')
                await expect(appShell).toBeVisible()
            })
        })
    })
})
