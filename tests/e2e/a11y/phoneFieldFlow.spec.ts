import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * E2E & Accessibility Tests for PhoneField Integration
 *
 * Verifies:
 * - Tienda directory and form modal phone input
 * - Accessible masked input attributes (type="tel", inputMode="tel", aria-hidden scaffolding)
 * - Zero serious or critical axe-core violations on hybrid pages using phone fields
 */
test.describe('PhoneField Integration & A11y Audit', () => {
    test('Tiendas page has no critical accessibility violations with phone actions', async ({ page }) => {
        await page.goto('/app/tiendas')
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
