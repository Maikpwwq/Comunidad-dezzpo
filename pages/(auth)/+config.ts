import type { Config } from 'vike/types'

/**
 * Auth Route Group Configuration
 *
 * Authentication pages (login, register, password reset)
 * These are public pages but have special layout requirements.
 */
export default {
  // Auth pages are not pre-rendered (dynamic content)
  prerender: false,
} satisfies Config
