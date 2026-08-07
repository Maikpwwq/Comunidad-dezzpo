import { test, expect } from '@playwright/test'
import { AuthPage } from '../pom/AuthPage'
import { DashboardPage } from '../pom/DashboardPage'

/**
 * E2E: Admin Security Guard & Control Tower
 *
 * Validates:
 *   1. Non-admin users are immediately redirected away from /admin/* routes
 *      without any data exposure or flickering.
 *   2. Admin users with custom claim can access the dashboard and navigate
 *      between admin subpages.
 *   3. Unauthenticated users cannot reach admin routes.
 */
test.describe('Admin Security Guard & Control Tower', () => {

    test.describe('Non-Admin Redirect', () => {
        test.use({ storageState: { cookies: [], origins: [] } })

        test('regular authenticated user is redirected from /admin/dashboard', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('propietario-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            // Attempt to navigate to admin dashboard
            await page.goto('/admin/dashboard')

            // Should be redirected to / or /app/portal-servicios (not see admin data)
            await expect(page).not.toHaveURL(/\/admin\//)

            // Verify no sensitive admin data leaked during redirect
            const adminContent = page.getByText(/control tower|panel de administración/i)
            await expect(adminContent).not.toBeVisible()
        })

        test('regular user is redirected from /admin/usuarios', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('comerciante-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            await page.goto('/admin/usuarios')

            // Should not stay on admin route
            await expect(page).not.toHaveURL(/\/admin\//)
        })

        test('regular user is redirected from /admin/verificacion', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('propietario-test@example.com', 'Password123!')
            await page.waitForURL(/\/app\//, { timeout: 15000 })

            await page.goto('/admin/verificacion')
            await expect(page).not.toHaveURL(/\/admin\//)
        })
    })

    test.describe('Unauthenticated Access', () => {
        test.use({ storageState: { cookies: [], origins: [] } })

        const ADMIN_ROUTES = [
            '/admin/dashboard',
            '/admin/usuarios',
            '/admin/verificacion',
            '/admin/certificaciones',
            '/admin/referidos',
            '/admin/notificaciones',
            '/admin/blog',
        ]

        ADMIN_ROUTES.forEach((route) => {
            test(`unauthenticated user cannot access ${route}`, async ({ page }) => {
                await page.goto(route)

                // Should redirect to login or home — never stay on admin
                await expect(page).not.toHaveURL(/\/admin\//)
            })
        })
    })

    test.describe('Admin Access (Custom Claim)', () => {
        // NOTE: These tests require a Firebase Auth Emulator user with
        // admin custom claim. In CI, the emulator must be seeded with
        // setCustomClaims('admin-test@example.com', { admin: true }).
        // If the admin user doesn't exist, these tests will be skipped.

        test.use({ storageState: { cookies: [], origins: [] } })

        test('admin user can access /admin/dashboard', async ({ page }) => {
            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('admin-test@example.com', 'AdminPass123!')
            await page.waitForURL(/\//, { timeout: 15000 })

            const dashboardPage = new DashboardPage(page)
            await dashboardPage.goto()

            // Wait for dashboard to load
            await page.waitForLoadState('networkidle')

            // Should stay on admin dashboard (not redirected)
            await expect(page).toHaveURL(/\/admin\/dashboard/)

            // Should see KPI content
            const pageContent = page.locator('main, [role="main"], .main-content, #root')
            await expect(pageContent).toBeVisible()
        })

        test('admin can navigate between admin pages without crashes', async ({ page }) => {
            const errors: Error[] = []
            page.on('pageerror', (err) => errors.push(err))

            const authPage = new AuthPage(page)
            await authPage.gotoLogin()
            await authPage.login('admin-test@example.com', 'AdminPass123!')
            await page.waitForURL(/\//, { timeout: 15000 })

            // Navigate through admin pages
            const adminPages = [
                '/admin/dashboard',
                '/admin/usuarios',
                '/admin/verificacion',
                '/admin/certificaciones',
                '/admin/referidos',
                '/admin/notificaciones',
                '/admin/blog',
            ]

            for (const route of adminPages) {
                await page.goto(route)
                await page.waitForLoadState('networkidle')

                // Should stay on the admin route
                await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')))

                // App shell is visible
                const pageContent = page.locator('main, [role="main"], .main-content, #root')
                await expect(pageContent).toBeVisible()
            }

            // No page-level crashes across all navigation
            expect(errors).toHaveLength(0)
        })
    })
})
