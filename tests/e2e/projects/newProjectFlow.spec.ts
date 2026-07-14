import { test, expect } from '@playwright/test';
import { AuthPage } from '../pom/AuthPage';

test.describe('New Project Creation Flow', () => {
  // Pre-authenticate before testing the flow
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    // Use the seeded test user that should exist in the Firebase Emulator
    await authPage.login('test@example.com', 'password123');
    await expect(page).toHaveURL(/\/app\/portal-servicios/);
  });

  test('User can create a new project and it appears in historial', async ({ page }) => {
    await page.goto('/nuevo-proyecto');

    // Step 0: ¿Qué necesitas?
    await page.getByPlaceholder(/Ej: Se me rompió un tubo/i).fill('Reparación de techo E2E Test');
    await page.getByRole('combobox', { name: /zona de Bogotá/i }).selectOption('Suba');
    await page.getByRole('combobox', { name: /tipo de proyecto/i }).selectOption('remodelacion');
    // For CategorySelector, assuming it's a select or custom dropdown
    // If it's a custom UI, we might need a more generic click, but assuming standard select for now
    // Actually, in the real component it is an Autocomplete or select. Let's find the first valid option.
    const categorySelect = page.getByRole('combobox').nth(2); 
    if (await categorySelect.isVisible()) {
      // Assuming index 2 is the category select based on DOM order
      await categorySelect.selectOption({ index: 1 });
    } else {
      // If Autocomplete
      await page.getByPlaceholder(/Buscar categoría/i).fill('Plom');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    }

    await page.getByRole('button', { name: /Continuar/i }).click();

    // Step 2: Detalles opcionales
    await expect(page.getByText('Detalles opcionales de tu proyecto')).toBeVisible();
    await page.getByPlaceholder(/Ej: Pintar fachada/i).fill('Reparación Completa E2E');
    
    // Submit
    await page.getByRole('button', { name: /Guardar y finalizar/i }).click();

    // Verify redirect to directorio
    await expect(page).toHaveURL(/\/app\/directorio-requerimientos/);

    // Navigate to historial to verify it appears
    // Wait, the prompt says "appears in /app/historial-servicio" or "historial-servicios"
    await page.goto('/app/historial-servicios');
    
    // Look for the project title in the history list
    await expect(page.getByText('Reparación Completa E2E')).toBeVisible();
  });
});
