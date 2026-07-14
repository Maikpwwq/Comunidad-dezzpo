import { test, expect } from '@playwright/test';
import { AuthPage } from '../pom/AuthPage';

test.describe('Authentication Flows', () => {
  // Use isolated context for auth tests to prevent session bleed
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Registration flow lands on correct post-auth route', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.gotoRegister();
    
    // Fill registration with random email to avoid collision in emulator
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await authPage.register('Test User', uniqueEmail, 'Password123!', 'Propietario');
    
    // Expect redirection to portal-servicios or onboarding
    await expect(page).toHaveURL(/\/app\/portal-servicios|\/app\/directorio-requerimientos/);
  });

  test('Login flow with valid credentials redirects correctly', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    
    // Assuming a test user exists in the emulator
    await authPage.login('test@example.com', 'password123');
    
    await expect(page).toHaveURL(/\/app\/portal-servicios/);
  });

  test('Password reset flow shows confirmation UI', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.gotoForgotPassword();
    
    await authPage.emailInput.fill('test@example.com');
    await authPage.submitButton.click();
    
    // Look for success message or alert
    const successAlert = page.getByText(/correo enviado|revisa tu bandeja/i);
    await expect(successAlert).toBeVisible();
  });

  test('Unauthenticated direct navigation redirects to login and returns to destination', async ({ page }) => {
    // Attempt to access a protected route directly
    await page.goto('/app/ajustes');
    
    // Should be redirected to login with returnTo parameter
    await expect(page).toHaveURL(/\/ingreso\?returnTo=.*ajustes/);
    
    const authPage = new AuthPage(page);
    // Login
    await authPage.login('test@example.com', 'password123');
    
    // Should be redirected back to the originally requested route
    await expect(page).toHaveURL(/\/app\/ajustes/);
  });
});
