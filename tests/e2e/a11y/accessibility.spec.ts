import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * E2E Accessibility Audit (WCAG 2.1 AA)
 *
 * Uses axe-core to scan critical pages for accessibility violations.
 * Targets the most user-facing pages: homepage, portal-servicios,
 * login, registration, and public profile views.
 *
 * This runs in the nightly pipeline to catch regressions.
 */
test.describe('Accessibility Audit (WCAG 2.1 AA)', () => {

    const PUBLIC_PAGES = [
        { name: 'Homepage', path: '/' },
        { name: 'Cómo Trabajamos', path: '/asi-trabajamos' },
        { name: 'Comunidad Propietarios', path: '/comunidad-propietarios' },
        { name: 'Comunidad Comerciantes', path: '/comunidad-comerciantes' },
        { name: 'Clasificación Usuarios', path: '/clasificacion-usuarios' },
        { name: 'Apéndice de Costos', path: '/apendice-costos' },
    ]

    PUBLIC_PAGES.forEach(({ name, path }) => {
        test(`${name} (${path}) has no critical accessibility violations`, async ({ page }) => {
            await page.goto(path)
            await page.waitForLoadState('networkidle')

            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .exclude('.recharts-wrapper') // Exclude chart SVGs (known false positives)
                .analyze()

            // Filter only critical and serious violations
            const criticalViolations = results.violations.filter(
                (v) => v.impact === 'critical' || v.impact === 'serious'
            )

            // Log violations for debugging
            if (criticalViolations.length > 0) {
                console.log(`\n🔴 Accessibility violations on ${name}:`)
                criticalViolations.forEach((v) => {
                    console.log(`  [${v.impact}] ${v.id}: ${v.description}`)
                    v.nodes.forEach((n) => {
                        console.log(`    → ${n.target.join(' > ')}`)
                    })
                })
            }

            expect(criticalViolations).toHaveLength(0)
        })
    })

    test.describe('Authenticated Pages a11y', () => {
        test.use({ storageState: { cookies: [], origins: [] } })

        const AUTHENTICATED_PAGES = [
            { name: 'Portal Servicios', path: '/app/portal-servicios' },
            { name: 'Directorio Requerimientos', path: '/app/directorio-requerimientos' },
            { name: 'Suscripciones', path: '/app/suscripciones' },
        ]

        // These hybrid routes are accessible without auth
        AUTHENTICATED_PAGES.forEach(({ name, path }) => {
            test(`${name} (${path}) has no critical a11y violations`, async ({ page }) => {
                await page.goto(path)
                await page.waitForLoadState('networkidle')

                const results = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa'])
                    .exclude('.recharts-wrapper')
                    .analyze()

                const criticalViolations = results.violations.filter(
                    (v) => v.impact === 'critical' || v.impact === 'serious'
                )

                expect(criticalViolations).toHaveLength(0)
            })
        })
    })
})
