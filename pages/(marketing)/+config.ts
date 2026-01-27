import type { Config } from 'vike/types'

/**
 * Marketing Route Group Configuration
 *
 * Public-facing pages optimized for SEO.
 * All pages in this group are pre-rendered (SSG).
 */
export default {
  // Enable pre-rendering for all marketing pages
  prerender: true,
} satisfies Config
