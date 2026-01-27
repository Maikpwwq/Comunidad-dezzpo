import type { PageContext as VikePageContext } from 'vike/types'

/**
 * Vike Type Augmentations
 *
 * Extends Vike's built-in types with application-specific data.
 * This ensures type safety when accessing pageContext throughout the app.
 *
 * @see https://vike.dev/pageContext
 */

declare global {
  namespace Vike {
    interface PageContext {
      /** Page-specific props passed from data hooks */
      pageProps?: Record<string, unknown>

      /** URL route parameters (e.g., { id: '123' } for /perfil/@id) */
      routeParams: Record<string, string>

      /** Authenticated user data (populated by auth guard) */
      user?: {
        id: string
        displayName: string | null
        email: string | null
        rol: 1 | 2 | null
      }

      /** Whether the current user is authenticated */
      isAuthenticated?: boolean

      /** Redirect URL for auth flows */
      redirectTo?: string

      /** Document metadata for SEO */
      exports: {
        documentProps?: {
          title?: string
          description?: string
        }
      }
    }
  }
}

/**
 * Re-export PageContext for convenience
 * Use this instead of importing directly from 'vike/types'
 */
export type PageContext = VikePageContext

/**
 * Props type for Page components
 */
export interface PageProps {
  [key: string]: unknown
}

/**
 * Common document props for SEO
 */
export interface DocumentProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
}
