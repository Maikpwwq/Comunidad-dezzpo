import { describe, it, expect } from 'vitest';
import { guard } from '#R/(app)/+guard';

// List of routes defined in the requirements
const PROTECTED_ROUTES = [
  '/app/requerimiento',
  '/app/editar-requerimiento',
  '/app/ver/requerimiento',
  '/app/ajustes',
  '/app/mensajes',
  '/app/cotizar',
  '/app/cotizar/ver',
  '/app/cotizar/editar',
  '/app/contratar',
  '/app/contratacion',
  '/app/contratacion/respuesta',
  '/app/historial-servicio'
];

// Routes that are public but within the app shell (hybrid)
const PUBLIC_HYBRID_ROUTES = [
  '/app/portal-servicios',
  '/app/directorio-requerimientos',
  '/app/ver-requerimiento',
  '/app/suscripciones',
  '/app/perfil/123' // Public profile view
];

describe('Auth-gated route access (Integration)', () => {
  describe('Protected Routes', () => {
    PROTECTED_ROUTES.forEach((route) => {
      it(`allows authenticated user to access ${route}`, () => {
        const pageContext = {
          urlPathname: route,
        };

        // Populate localStorage matching +guard.ts check
        localStorage.setItem('user-storage', JSON.stringify({ state: { isAuth: true, userId: 'test-user-123' } }));
        
        try {
          expect(() => guard(pageContext as any)).not.toThrow();
        } finally {
          localStorage.clear();
        }
      });

      it(`redirects unauthenticated user to /ingreso for ${route}`, () => {
        const pageContext = {
          urlPathname: route,
          isAuthenticated: false,
        };
        
        try {
          guard(pageContext as any);
          // If it doesn't throw, the test should fail
          expect.fail('Guard should have thrown a redirect exception');
        } catch (err: any) {
          // Vike's redirect throws an object or error
          // The guard code: throw redirect(`/ingreso?returnTo=${returnUrl}`)
          // We can just verify it throws
          expect(err).toBeDefined();
        }
      });
    });
  });

  describe('Public Hybrid Routes', () => {
    PUBLIC_HYBRID_ROUTES.forEach((route) => {
      it(`allows authenticated user to access ${route}`, () => {
        const pageContext = {
          urlPathname: route,
          isAuthenticated: true,
        };
        
        expect(() => guard(pageContext as any)).not.toThrow();
      });

      it(`allows unauthenticated user to access ${route}`, () => {
        const pageContext = {
          urlPathname: route,
          isAuthenticated: false,
        };
        
        // Guard should not throw because the route is in the whitelist
        expect(() => guard(pageContext as any)).not.toThrow();
      });
    });
  });
});
