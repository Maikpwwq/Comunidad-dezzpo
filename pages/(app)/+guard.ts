/**
 * App Route Guard
 *
 * Protects most /app/* routes by redirecting unauthenticated users.
 * Exceptions: portal-servicios and perfil pages are publicly accessible.
 * Uses Zustand store to check authentication state.
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
]

export const guard: GuardSync = (pageContext): void => {
  const currentPath = pageContext.urlPathname
  
  // DEBUG: Check what path is being processed
  console.log('[Guard] Checking Path:', currentPath)
  console.log('[Guard] Public Routes:', PUBLIC_APP_ROUTES)

  // Allow public routes without authentication
  const isPublicRoute = PUBLIC_APP_ROUTES.some(route => 
    currentPath.includes(route)
  )
  
  if (isPublicRoute) {
    return // No auth required for public app pages
  }

  // Check for user in pageContext (set by server if authenticated)
  const isAuthenticated = pageContext.isAuthenticated ?? false

  if (!isAuthenticated) {
    // On client side, also check localStorage for quick feedback
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user-storage')
      if (storedUserId) {
        try {
          const parsed = JSON.parse(storedUserId)
          if (parsed.state?.isAuth) {
            return // User is authenticated via Zustand persistence
          }
        } catch {
          // Invalid JSON, proceed with redirect
        }
      }
    }

    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(pageContext.urlPathname)
    throw redirect(`/ingreso?returnTo=${returnUrl}`)
  }
}

