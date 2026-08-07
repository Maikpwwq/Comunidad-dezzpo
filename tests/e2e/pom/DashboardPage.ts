import type { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for the Admin Dashboard (/admin/dashboard).
 * Covers the Executive Command Center KPIs, charts, and navigation.
 */
export class DashboardPage {
    readonly page: Page

    // Navigation
    readonly sidebarDashboardLink: Locator
    readonly sidebarUsersLink: Locator
    readonly sidebarVerificationLink: Locator

    // KPI Cards Section
    readonly communityKpiSection: Locator
    readonly totalUsersCard: Locator
    readonly totalPropietariosCard: Locator
    readonly totalComerciantesCard: Locator

    // Monetization Section
    readonly monetizationSection: Locator

    // Classification Section
    readonly classificationSection: Locator
    readonly classificationTabs: Locator

    // Funnel Section
    readonly funnelSection: Locator

    constructor(page: Page) {
        this.page = page

        // Sidebar navigation links
        this.sidebarDashboardLink = page.getByRole('link', { name: /dashboard|panel/i })
        this.sidebarUsersLink = page.getByRole('link', { name: /usuarios/i })
        this.sidebarVerificationLink = page.getByRole('link', { name: /verificación/i })

        // KPI section — look for heading or container
        this.communityKpiSection = page.getByText(/comunidad|kpi|usuarios totales/i).first()
        this.totalUsersCard = page.getByText(/usuarios totales/i)
        this.totalPropietariosCard = page.getByText(/propietarios/i).first()
        this.totalComerciantesCard = page.getByText(/comerciantes/i).first()

        // Monetization section
        this.monetizationSection = page.getByText(/monetización|modelo de negocio|fuentes/i).first()

        // Classification section
        this.classificationSection = page.getByText(/clasificación/i).first()
        this.classificationTabs = page.getByRole('tab')

        // Funnel section
        this.funnelSection = page.getByText(/embudo|funnel|conversión/i).first()
    }

    async goto() {
        await this.page.goto('/admin/dashboard')
    }

    async navigateToUsers() {
        await this.sidebarUsersLink.click()
    }

    async navigateToVerification() {
        await this.sidebarVerificationLink.click()
    }
}
