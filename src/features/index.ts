/**
 * Features Barrel Export
 *
 * Central export for all feature modules.
 *
 * @example
 * ```tsx
 * import { useAuthActions } from '@features/auth'
 * import { UserCard } from '@features/profile'
 * import { DraftCard } from '@features/quotes'
 * import { MenuComunidad } from '@features/marketing'
 * import { SendbirdChat } from '@features/messaging'
 * ```
 */

// Auth feature
export * from './auth'

// Profile feature
export * from './profile'

// Quotes feature
export * from './quotes'

// Marketing feature
export * from './marketing'

// Projects feature
export * from './projects'

// Messaging feature
export * from './messaging'
