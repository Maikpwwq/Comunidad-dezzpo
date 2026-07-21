import type { Config } from 'vike/types'

/**
 * App Route Configuration
 *
 * Protected dashboard pages requiring authentication.
 * SSR enabled for personalized content.
 */
export default {
  // No pre-rendering - content is user-specific
  prerender: false,
  // CSR / SPA behavior — disable SSR to prevent crashes from client-only
  // APIs (Zustand localStorage, Sendbird SDK, FCM push) during Vercel SSR.
  ssr: false,
  filesystemRoutingRoot: '/app',
} satisfies Config
