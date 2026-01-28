// https://vike.dev/config
import type { Config } from 'vike/types'
import vikePhoton from 'vike-photon/config'

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

  extends: [vikePhoton],

  photon: {
    server: 'server/index.ts'
  },

  /**
   * Prefetch strategy for static assets
   * 'viewport' = prefetch when link enters viewport
   */
  prefetchStaticAssets: 'viewport',

  /**
   * Enable pre-rendering for static pages
   * @see https://vike.dev/prerender
   */
  /* prerender: true, (Moved to marketing scope) */

  meta: {
    title: {
      env: { server: true, client: true }
    },
    description: {
      env: { server: true, client: true }
    }
  }
} satisfies Config
