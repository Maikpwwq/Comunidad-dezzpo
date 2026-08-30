/**
 * Profile Components Barrel Export
 *
 * @example
 * ```tsx
 * import {
 *     UserCard,
 *     RatingStars,
 *     ProfileMap,
 *     Comentarios,
 *     MicrositeShareCard,
 *     ContactInfoCard,
 *     SocialLinksCard,
 *     ProfileHeader,
 *     ProfileGallery
 * } from '@features/profile'
 * ```
 */

// Profile Display
export { UserCard } from './UserCard'
export type { UserCardProps } from './UserCard'

// Rating
export { RatingStars } from './RatingStars'
export type { RatingStarsProps } from './RatingStars'

// Map
export { ProfileMap } from './ProfileMap'
export type { ProfileMapProps, UserLocationInfo } from './ProfileMap'

// Comments
export { ComentarPerfil } from './ComentarPerfil'
export type { ComentarPerfilProps } from './ComentarPerfil'

export { Comentarios } from './Comentarios'
export type { ComentariosProps } from './Comentarios'

export { HiloComentarios } from './HiloComentarios'
export type { HiloComentariosProps, CommentThread } from './HiloComentarios'

// Auth Providers Management
export { AuthProvidersManager } from './AuthProvidersManager'

// Modular Profile Sections (Refactored)
export { MicrositeShareCard } from './MicrositeShareCard'
export type { MicrositeShareCardProps } from './MicrositeShareCard'

export { ContactInfoCard } from './ContactInfoCard'
export type { ContactInfoCardProps } from './ContactInfoCard'

export { SocialLinksCard } from './SocialLinksCard'
export type { SocialLinksCardProps } from './SocialLinksCard'

export { ProfileHeader } from './ProfileHeader'
export type { ProfileHeaderProps } from './ProfileHeader'

export { ProfileGallery } from './ProfileGallery'
export type { ProfileGalleryProps } from './ProfileGallery'
