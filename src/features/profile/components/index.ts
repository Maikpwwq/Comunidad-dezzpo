/**
 * Profile Components Barrel Export
 *
 * @example
 * ```tsx
 * import { UserCard, RatingStars, ProfileMap, Comentarios } from '@features/profile'
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
