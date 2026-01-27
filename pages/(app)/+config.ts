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
} satisfies Config
