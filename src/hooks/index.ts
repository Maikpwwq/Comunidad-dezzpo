/**
 * Hooks Index
 *
 * Barrel export for @hooks/
 */

// Page context hook (Vike)
export { usePageContext, PageContextProvider } from './usePageContext'

// Navigation
export { default as Link } from './Link'

// Share functionality
export { useShareAction } from './useShareAction'
export type { ShareData, UseShareActionReturn } from './useShareAction'

// Google Maps
export { useGoogleMaps } from './useGoogleMaps'
export type { MapOptions, UseGoogleMapsReturn } from './useGoogleMaps'

// Local storage
export { useLocalStorage } from './useLocalStorage'

// Authentication
export { useAuth } from './useAuth'
export type { CurrentUser, UseAuthReturn } from './useAuth'

// Firestore queries
export { useFirestoreQuery } from './useFirestoreQuery'
export type {
    FirestoreQueryOptions,
    UseFirestoreQueryReturn,
    WhereClause,
    OrderByClause,
} from './useFirestoreQuery'

