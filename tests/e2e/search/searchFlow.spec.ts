import { test, expect } from '@playwright/test';

test.describe('Search Bar Flow - Homepage', () => {

  test('User types a query, sees results, and navigates to discovery page', async ({ page }) => {
    await page.goto('/');

    // QuickMatch input
    const searchInput = page.getByPlaceholder(/Ej: plomero, electricista/i);
    await expect(searchInput).toBeVisible();

    // Type a service query
    await searchInput.fill('plomeria');

    // Wait for the dropdown to appear
    const dropdownItem = page.getByRole('button', { name: /plomeria/i });
    await expect(dropdownItem.first()).toBeVisible();

    // The zone selector defaults to bogota, so we don't need to change it unless required
    
    // Click the matching result
    await dropdownItem.first().click();

    // Verify navigation to the correct micrositio / discovery route
    // The slug is slugified ('plomeria') and zone is 'bogota'
    await expect(page).toHaveURL(/\/plomeria\/bogota/);
    
    // Verify that the discovery page loaded (e.g. looking for a list of comerciantes or a heading)
    await expect(page.getByRole('heading', { name: /plomería/i })).toBeVisible();
  });

  test('Fallback search navigates to /nuevo-proyecto when no exact match is clicked', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder(/Ej: plomero, electricista/i);
    await searchInput.fill('ServicioDesconocidoE2E');

    // Press enter to trigger fallback behavior
    await searchInput.press('Enter');

    // Should navigate to nuevo-proyecto with the query string
    await expect(page).toHaveURL(/\/nuevo-proyecto\?q=ServicioDesconocidoE2E/);
  });
});
