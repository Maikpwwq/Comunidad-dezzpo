/**
 * App Route Guard
 *
 * Protects most /app/* routes by redirecting unauthenticated users.
 * Exceptions: portal-servicios and perfil pages are publicly accessible.
 * Uses Zustand store to check authentication state.
 *
 * SSR Safety: Firebase Auth is client-only — no server-side session exists.
 * On SSR we MUST NOT redirect because `onAuthStateChanged` has not resolved yet.
 * The guard only enforces auth on client-side navigations and client-side
 * hydration (where localStorage is available).
 *
 * @see https://vike.dev/guard
 */
import { redirect } from 'vike/abort'
import type { GuardSync } from 'vike/types'

// Pages that don't require authentication (public-facing hybrid routes)
const PUBLIC_APP_ROUTES = [
  '/portal-servicios',
  '/perfil',
  '/suscripciones',
  '/directorio-requerimientos',
  '/ver-requerimiento',
  '/tiendas',
]

export const guard: GuardSync = (pageContext): void => {
  const currentPath = pageContext.urlPathname

  // Allow public routes without authentication
  const isPublicRoute = PUBLIC_APP_ROUTES.some(route =>
    currentPath.includes(route)
  )

  if (isPublicRoute) {
    return // No auth required for public app pages
  }

  // ── SSR Safety ──────────────────────────────────────────────────────
  // On the server we have NO auth state (Firebase Auth is client-only).
  // Redirecting here would cause a reload → /ingreso → auth resolves →
  // redirect to /portal-servicios loop. Let the page render; the client
  // Layout + UserAuthProvider will handle auth gating after hydration.
  if (typeof window === 'undefined') {
    return
  }

  // ── Client-side auth check ──────────────────────────────────────────
  // Check Zustand persisted state in localStorage
  const storedUserStorage = localStorage.getItem('user-storage')
  const storedRole = localStorage.getItem('role')

  if (storedUserStorage) {
    try {
      const parsed = JSON.parse(storedUserStorage)
      if (parsed.state?.isAuth || parsed.state?.userId) {
        return // User is authenticated via Zustand persistence
      }
    } catch {
      // Invalid JSON, proceed with redirect check
    }
  }

  // Fallback: If user has a valid role stored, treat as authenticated
  if (storedRole && (storedRole === '1' || storedRole === '2')) {
    return
  }

  // No auth evidence found — redirect to login with return URL
  const returnUrl = encodeURIComponent(pageContext.urlPathname)
  throw redirect(`/ingreso?returnTo=${returnUrl}`)
}
