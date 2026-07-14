import type { Page, Locator } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Selectors assume standard MUI or Bootstrap forms based on typical implementation
    this.emailInput = page.getByRole('textbox', { name: /correo/i });
    this.passwordInput = page.getByLabel(/contraseña/i).first(); // Handles both Sign In and Sign Up passwords
    this.submitButton = page.getByRole('button', { name: /ingresar|registrar|enviar/i });
    
    this.loginLink = page.getByRole('link', { name: /iniciar sesión/i });
    this.registerLink = page.getByRole('link', { name: /regístrate/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /olvidaste tu contraseña/i });
  }

  async gotoLogin() {
    await this.page.goto('/ingreso');
  }

  async gotoRegister() {
    await this.page.goto('/registro');
  }

  async gotoForgotPassword() {
    await this.page.goto('/restaurar-contrasena');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async register(name: string, email: string, password: string, role: string) {
    // Fill specific register fields
    await this.page.getByRole('textbox', { name: /nombre/i }).fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Role selection assuming radio buttons or a select
    const roleSelector = this.page.getByRole('radio', { name: new RegExp(role, 'i') });
    if (await roleSelector.isVisible()) {
      await roleSelector.check();
    }
    
    await this.submitButton.click();
  }
}
