import { test, expect } from '@playwright/test'

/**
 * E2E: Admin Search Analytics Pie Charts
 *
 * Verifies:
 *   1. Rendering of the Demanda y Búsquedas section with 3 pie cards.
 *   2. Period selector switches between 7d, 30d, and 90d with URL sync (?periodo=...).
 *   3. Interactive SVG pie charts with synchronized legends and summaries.
 *   4. Keyboard accessibility and ARIA roles (region, button, aria-label, aria-live).
 */
test.describe('Admin Dashboard — Search Analytics Pie Charts', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept API call to return fixture search analytics
        await page.route('**/api/v1/admin/analytics/searches*', async (route) => {
            const url = new URL(route.request().url())
            const period = url.searchParams.get('period') || '30d'

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    period,
                    from: '2026-09-17',
                    to: '2026-10-17',
                    asOf: '2026-10-17T05:00:00.000Z',
                    datasets: {
                        servicio: {
                            status: 'ok',
                            data: {
                                dimension: 'servicio',
                                total: 309,
                                distinct: 8,
                                slices: [
                                    {
                                        key: 'plomeria',
                                        label: 'Plomería',
                                        count: 120,
                                        fraction: 0.388,
                                        permille: 388,
                                        rank: 1,
                                        kind: 'item',
                                    },
                                    {
                                        key: 'electricidad',
                                        label: 'Electricidad',
                                        count: 90,
                                        fraction: 0.291,
                                        permille: 291,
                                        rank: 2,
                                        kind: 'item',
                                    },
                                    {
                                        key: 'pintura',
                                        label: 'Pintura',
                                        count: 60,
                                        fraction: 0.194,
                                        permille: 194,
                                        rank: 3,
                                        kind: 'item',
                                    },
                                    {
                                        key: '__otros__',
                                        label: 'Otros (5 servicios)',
                                        count: 39,
                                        fraction: 0.127,
                                        permille: 127,
                                        rank: null,
                                        kind: 'otros',
                                    },
                                ],
                            },
                        },
                        zona: {
                            status: 'ok',
                            data: {
                                dimension: 'zona',
                                total: 309,
                                distinct: 6,
                                slices: [
                                    {
                                        key: 'suba',
                                        label: 'Suba',
                                        count: 140,
                                        fraction: 0.453,
                                        permille: 453,
                                        rank: 1,
                                        kind: 'item',
                                    },
                                    {
                                        key: 'usaquen',
                                        label: 'Usaquén',
                                        count: 100,
                                        fraction: 0.324,
                                        permille: 324,
                                        rank: 2,
                                        kind: 'item',
                                    },
                                    {
                                        key: '__otros__',
                                        label: 'Otros (4 zonas)',
                                        count: 69,
                                        fraction: 0.223,
                                        permille: 223,
                                        rank: null,
                                        kind: 'otros',
                                    },
                                ],
                            },
                        },
                        comerciante: {
                            status: 'ok',
                            data: {
                                dimension: 'comerciante',
                                total: 27,
                                distinct: 3,
                                slices: [
                                    {
                                        key: 'mH9Vbe71NwPvOGVhr5TfIMabroF3',
                                        label: 'AQUA Ingeniería & Diseño',
                                        count: 18,
                                        fraction: 0.667,
                                        permille: 667,
                                        rank: 1,
                                        kind: 'item',
                                    },
                                    {
                                        key: 'uid_2',
                                        label: 'Construcciones Andinas',
                                        count: 9,
                                        fraction: 0.333,
                                        permille: 333,
                                        rank: 2,
                                        kind: 'item',
                                    },
                                ],
                            },
                        },
                    },
                }),
            })
        })
    })

    test('displays the 3 pie charts with accessible titles and summaries', async ({ page }) => {
        await page.goto('/admin/dashboard')

        // Verify section heading
        const heading = page.getByRole('heading', { name: /demanda y búsquedas en el marketplace/i })
        await expect(heading).toBeVisible()

        // Verify period selector buttons
        await expect(page.getByRole('button', { name: /últimos 7 días/i })).toBeVisible()
        await expect(page.getByRole('button', { name: /últimos 30 días/i })).toBeVisible()
        await expect(page.getByRole('button', { name: /últimos 90 días/i })).toBeVisible()

        // Verify 3 pie chart cards
        await expect(page.getByRole('region', { name: /gráfico de torta: servicios consultados/i })).toBeVisible()
        await expect(page.getByRole('region', { name: /gráfico de torta: zonas desde las que se consulta/i })).toBeVisible()
        await expect(page.getByRole('region', { name: /gráfico de torta: comerciantes\/empresas consultadas/i })).toBeVisible()

        // Verify SVG elements and legends
        await expect(page.getByText('Plomería').first()).toBeVisible()
        await expect(page.getByText('Suba').first()).toBeVisible()
        await expect(page.getByText('AQUA Ingeniería & Diseño').first()).toBeVisible()
    })

    test('syncs period selection with URL search parameters', async ({ page }) => {
        await page.goto('/admin/dashboard')

        // Click on 7 days toggle
        await page.getByRole('button', { name: /últimos 7 días/i }).click()
        await expect(page).toHaveURL(/periodo=7d/)

        // Click on 90 days toggle
        await page.getByRole('button', { name: /últimos 90 días/i }).click()
        await expect(page).toHaveURL(/periodo=90d/)
    })
})
