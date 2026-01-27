/**
 * App Route Guard
 *
 * Protects all /app/* routes by redirecting unauthenticated users.
 * Uses Zustand store to check authentication state.
 *
 * @see https://vike.dev/guard
 */
import { redirect } from 'vike/abort'
import type { GuardSync } from 'vike/types'

export const guard: GuardSync = (pageContext): void => {
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

