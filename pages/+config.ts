// https://vike.dev/config
import type { Config } from 'vike/types'

/**
 * Global Vike v0.4.x Configuration
 * This configuration applies to all pages unless overridden.
 */
export default {
  /**
   * Enable client-side routing for SPA-like navigation
   * @see https://vike.dev/clientRouting
   */
  clientRouting: true,

  /**
   * Allow React 18 to abort hydration for client-side navigation
   */
  hydrationCanBeAborted: true,

  /**
   * Data passed from server to client
   * @see https://vike.dev/passToClient
   */
  passToClient: [
    'pageProps',
    'routeParams',
    'user',
    'isAuthenticated',
    'redirectTo',
  ],

  /**
   * Prefetch strategy for static assets
   * 'viewport' = prefetch when link enters viewport
   */
  prefetchStaticAssets: 'viewport',

  /**
   * Enable pre-rendering for static pages
   * @see https://vike.dev/prerender
   */
  prerender: true,
} satisfies Config
