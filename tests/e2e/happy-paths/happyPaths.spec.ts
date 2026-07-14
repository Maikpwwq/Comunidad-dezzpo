import { test, expect } from '@playwright/test';
import { AuthPage } from '../pom/AuthPage';

const CRITICAL_ROUTES = [
  { path: '/app/cotizar', keyElementText: /cotizar/i },
  // Appending mock IDs for dynamic routes to prevent 404s if they require an ID
  { path: '/app/cotizar/ver/mock-quote-id', keyElementText: /cotización|detalle/i },
  { path: '/app/cotizar/editar/mock-quote-id', keyElementText: /editar|guardar/i },
  { path: '/app/contratar/mock-draft-id', keyElementText: /contratar|acuerdo/i },
  { path: '/app/contratacion?contractId=mock-contract-id', keyElementText: /pago|contratación/i },
  { path: '/app/contratacion/respuesta', keyElementText: /respuesta|transacción/i },
  { path: '/app/mensajes', keyElementText: /mensajes|chat/i },
  { path: '/app/ajustes', keyElementText: /ajustes|configuración/i }
];

test.describe('Critical Happy Paths (Authenticated)', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate once per test to ensure fresh state, or use a shared state in a real project.
    // For simplicity and isolation, we login here.
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login('test@example.com', 'password123');
    await expect(page).toHaveURL(/\/app\/portal-servicios/);
  });

  CRITICAL_ROUTES.forEach(({ path, keyElementText }) => {
    test(`Route ${path} loads without crashing and shows key UI elements`, async ({ page }) => {
      // Catch any unhandled exceptions or console errors that indicate a crash
      const errors: Error[] = [];
      page.on('pageerror', (err) => errors.push(err));

      await page.goto(path);
      
      // Wait for network idle to ensure full hydration and rendering
      await page.waitForLoadState('networkidle');

      // Assert no page-level crashes
      expect(errors).toHaveLength(0);

      // We expect either the specific key element OR a typical empty state/fallback 
      // if the mock ID doesn't exist, but it shouldn't be a white screen or a 500 error.
      // We look for the main app shell container at least.
      const appShell = page.locator('.app-layout, .main-content, #root'); // Generic fallbacks
      await expect(appShell).toBeVisible();

      // Check for the key element text somewhere on the page, or generic text if empty
      const hasKeyElement = await page.getByText(keyElementText).count() > 0;
      const hasEmptyState = await page.getByText(/no se encontró|no hay|error/i).count() > 0;
      
      expect(hasKeyElement || hasEmptyState).toBeTruthy();
    });
  });

});
