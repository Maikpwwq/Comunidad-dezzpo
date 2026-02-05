/**
 * Type declarations for legacy JSX modules
 *
 * This file allows TypeScript to import from untyped .jsx files
 * without requiring explicit declaration files for each one.
 *
 * As modules are migrated to TypeScript, remove the corresponding
 * declarations from this file.
 */

// ============================================================================
// Legacy Components
// ============================================================================

declare module '#@/index/components/*' {
  const Component: React.ComponentType<Record<string, unknown>>
  export default Component
}

declare module '#@/index/components/buscador/BuscadorNuevoProyecto' {
  const Component: React.ComponentType
  export default Component
}

declare module '#@/index/components/nuestra-comunidad/NuestraComunidad' {
  const Component: React.ComponentType
  export default Component
}

declare module '#@/index/components/SnackBarAlert' {
  interface SnackBarAlertProps {
    message: string
    onClose: (event?: React.SyntheticEvent, reason?: string) => void
    severity: 'success' | 'error' | 'warning' | 'info'
    open: boolean
  }
  const Component: React.ComponentType<SnackBarAlertProps>
  export default Component
}

// New @index/components alias patterns
declare module '@index/components/*' {
  const Component: React.ComponentType<Record<string, unknown>>
  export default Component
}

declare module '@index/components/buscador/BuscadorNuevoProyecto' {
  const Component: React.ComponentType<Record<string, unknown>>
  export default Component
}

declare module '@index/components/categorias-servicios/CategoriasServicios' {
  const Component: React.ComponentType
  export default Component
}

// ============================================================================
// Legacy Renderer
// ============================================================================

declare module '#@/index/renderer/Link' {
  interface LinkProps {
    href: string
    className?: string
    children?: React.ReactNode
  }
  const Component: React.ComponentType<LinkProps>
  export default Component
}

// ============================================================================
// Firebase (JS files)
// ============================================================================

declare module '#@/firebase/firebaseClient' {
  import type { Auth } from 'firebase/auth'
  import type { Firestore } from 'firebase/firestore'
  import type { FirebaseStorage } from 'firebase/storage'

  export const auth: Auth
  export const firestore: Firestore
  export const storage: FirebaseStorage
}

// New alias pattern
declare module '@firebase/firebaseClient' {
  import type { Auth } from 'firebase/auth'
  import type { Firestore } from 'firebase/firestore'
  import type { FirebaseStorage } from 'firebase/storage'

  export const auth: Auth
  export const firestore: Firestore
  export const storage: FirebaseStorage
}

// ============================================================================
// Google Maps
// ============================================================================

// Legacy Loader interface - v2.0.2 deprecated .load() but original code uses it
interface LegacyLoader {
  load(): Promise<typeof globalThis.google>
}

declare module '#@/google/GoogleMapsAdmin' {
  export const googleLoader: LegacyLoader
  export const mapOptions: {
    center: { lat: number; lng: number }
    zoom: number
    auth_referrer_policy: string
  }
}

declare module '@google/GoogleMapsAdmin' {
  export const googleLoader: LegacyLoader
  export const mapOptions: {
    center: { lat: number; lng: number }
    zoom: number
    auth_referrer_policy: string
  }
}

// ============================================================================
// Legacy Providers
// ============================================================================

declare module '#@/providers/UserAuthProvider' {
  import type { ReactNode } from 'react'

  interface CurrentUser {
    userId?: string | null
    displayName?: string | null
    mobileOpen?: boolean
    isAuth?: boolean
    updated?: boolean
    rol?: number | null
    [key: string]: unknown
  }

  interface UserAuthContextValue {
    currentUser: CurrentUser
    updateUser: (data: Record<string, unknown>) => void
    updateRol: (rol: number) => void
    updateIsAuth: (isAuth: boolean) => void
    updateMobileMenu: (open: boolean) => void
    clearAuthUser: () => void
  }

  export const UserAuthContext: React.Context<UserAuthContextValue>

  interface UserAuthProviderProps {
    children: ReactNode
  }
  export const UserAuthProvider: React.ComponentType<UserAuthProviderProps>
}

declare module '@providers/UserAuthProvider' {
  import type { ReactNode } from 'react'

  interface CurrentUser {
    userId?: string | null
    displayName?: string | null
    mobileOpen?: boolean
    isAuth?: boolean
    updated?: boolean
    rol?: number | null
    [key: string]: unknown
  }

  interface UserAuthContextValue {
    currentUser: CurrentUser
    updateUser: (data: Record<string, unknown>) => void
    updateRol: (rol: number) => void
    updateIsAuth: (isAuth: boolean) => void
    updateMobileMenu: (open: boolean) => void
    clearAuthUser: () => void
  }

  export const UserAuthContext: React.Context<UserAuthContextValue>

  interface UserAuthProviderProps {
    children: ReactNode
  }
  export const UserAuthProvider: React.ComponentType<UserAuthProviderProps>
}

// New @providers alias pattern
declare module '@providers/UserAuthProvider' {
  import type { ReactNode } from 'react'

  interface CurrentUser {
    userId?: string
    displayName?: string
    isAuth?: boolean
    rol?: number
    [key: string]: unknown
  }

  interface UserAuthContextValue {
    currentUser: CurrentUser
    updateUser: (data: Record<string, unknown>) => void
  }

  export const UserAuthContext: React.Context<UserAuthContextValue>

  interface UserAuthProviderProps {
    children: ReactNode
  }
  export const UserAuthProvider: React.ComponentType<UserAuthProviderProps>
}

// @services alias patterns - using new TypeScript service types
declare module '@services/*' {
  const service: (...args: unknown[]) => Promise<unknown>
  export default service
}

// Re-export new TypeScript services
declare module '@services' {
  export * from '/media/oem/MyFiles/8_DEVELOPMENT/Comunidad-Dezzpo-PWA/src/services/types'
  export * from '/media/oem/MyFiles/8_DEVELOPMENT/Comunidad-Dezzpo-PWA/src/services/users'
  export * from '/media/oem/MyFiles/8_DEVELOPMENT/Comunidad-Dezzpo-PWA/src/services/drafts'
  export * from '/media/oem/MyFiles/8_DEVELOPMENT/Comunidad-Dezzpo-PWA/src/services/quotations'
  export * from '/media/oem/MyFiles/8_DEVELOPMENT/Comunidad-Dezzpo-PWA/src/services/search'
}

// Legacy service wrappers (for backward compatibility)
declare module '@services/readUserFromFirestore.service' {
  interface ReadUserProps {
    firestoreUserID: string
    userSelectedRol: number
  }
  const readUserFromFirestore: (props: ReadUserProps) => void
  export default readUserFromFirestore
}

declare module '@services/readDraftFromFirestore.service' {
  interface ReadDraftProps {
    draftId: string
  }
  const readDraftFromFirestore: (props: ReadDraftProps) => void
  export default readDraftFromFirestore
}

declare module '@services/readQuotationFromFirestore.service' {
  interface ReadQuotationProps {
    quotationId: string
  }
  const readQuotationFromFirestore: (props: ReadQuotationProps) => void
  export default readQuotationFromFirestore
}

declare module '@services/doSearchFromFirestore.service' {
  interface SearchProps {
    searchInput: string
  }
  const doSearchFromFirestore: (props: SearchProps) => void
  export default doSearchFromFirestore
}

declare module '@services/updateUserToFirestore.service' {
  interface UpdateUserData {
    updateInfo: Record<string, unknown>
    firestoreUserId: string
    userSelectedRol: number
  }
  const updateUserToFirestore: (data: UpdateUserData) => void
  export default updateUserToFirestore
}

declare module '@services/updateDraftToFirestore.service' {
  interface UpdateDraftData {
    updateInfo: Record<string, unknown>
    draftId: string
  }
  const updateDraftToFirestore: (data: UpdateDraftData) => void
  export default updateDraftToFirestore
}

declare module '@services/updateQuotationToFirestore.service' {
  interface UpdateQuotationData {
    updateInfo: Record<string, unknown>
    quotationId: string
  }
  const updateQuotationToFirestore: (data: UpdateQuotationData) => void
  export default updateQuotationToFirestore
}

declare module '@services/updateAsesoriaToFirestore.service' {
  interface AsesoriaData {
    updateInfo: {
      asesoriaTitulo: string
      asesoriaDescription: string
      asesoriaSelect: string
    }
    docId: string
  }
  const updateAsesoriaToFirestore: (data: AsesoriaData) => Promise<void>
  export default updateAsesoriaToFirestore
}

declare module '@services/sharing-information' {
  interface SubjectData {
    [key: string]: unknown
  }
  interface SharingInformationService {
    setSubject: (data: SubjectData) => void
    getSubject: () => SubjectData
  }
  export const sharingInformationService: SharingInformationService
}

// ============================================================================
// Additional Legacy Modules
// ============================================================================

declare module '#@/index/pages/apendice-costos/tabla/tabla' {
  interface TableCardsProps {
    dataTable: unknown[]
  }
  const Component: React.ComponentType<TableCardsProps>
  export default Component
}

declare module '#@/services/updateAsesoriaToFirestore.service' {
  interface AsesoriaData {
    updateInfo: {
      asesoriaTitulo: string
      asesoriaDescription: string
      asesoriaSelect: string
    }
    docId: string
  }
  const updateAsesoriaToFirestore: (data: AsesoriaData) => Promise<void>
  export default updateAsesoriaToFirestore
}

declare module '#@/index/pages/apendice-costos/apendice-costos.json' {
  const value: Array<{
    subSistema?: string
    subCategoria?: string
    subCategoriaCantidad?: string
    subCategoriaDescription?: string
    subCategoriaPrecio?: number
  }>
  export default value
}

declare module '#@/index/components/categorias-servicios/CategoriasServicios' {
  const Component: React.ComponentType
  export default Component
}

// ============================================================================
// App Components
// ============================================================================

declare module '#@/app/components/DraftCard' {
  interface DraftCardProps {
    props: Record<string, unknown>
  }
  const Component: React.ComponentType<DraftCardProps>
  export default Component
}

declare module '#@/app/components/UserCard' {
  interface UserCardProps {
    props: Record<string, unknown>
    className?: string
  }
  const Component: React.ComponentType<UserCardProps>
  export default Component
}

declare module '#@/app/components/SearchBar' {
  const Component: React.ComponentType
  export default Component
}

declare module '#@/app/components/MapaPerfil' {
  interface MapaPerfilProps {
    userInfo: Record<string, unknown>
  }
  const Component: React.ComponentType<MapaPerfilProps>
  export default Component
}

declare module '#@/app/components/CincoEstrellas' {
  const Component: React.ComponentType
  export default Component
}

declare module '#@/app/components/Comentarios' {
  interface ComentariosProps {
    channelUrl: string
    userID: string
    nickname: string
  }
  const Component: React.ComponentType<ComentariosProps>
  export default Component
}

declare module '#@/app/components/ChipsCategories' {
  interface ChipsCategoriesProps {
    listadoCategorias?: Array<{ label: string; [key: string]: unknown }>
    editableContent?: boolean
    setUserEditInfo?: (info: Record<string, unknown>) => void
    userEditInfo?: Record<string, unknown>
    saved?: boolean
  }
  const Component: React.ComponentType<ChipsCategoriesProps>
  export default Component
}

declare module '#@/app/components/AdjuntarArchivos' {
  interface AdjuntarArchivosProps {
    name: string
    multiple: boolean
    idPerson: string
    rol: number
    route: string
    functionState: (state: Record<string, unknown>) => void
    state: Record<string, unknown>
  }
  const Component: React.ComponentType<AdjuntarArchivosProps>
  export default Component
}

// ============================================================================
// App Services
// ============================================================================

declare module '#@/services/doSearchFromFirestore.service' {
  interface SearchParams {
    searchInput: string
  }
  const doSearchFromFirestore: (params: SearchParams) => void
  export default doSearchFromFirestore
}

declare module '#@/services/readUsersFromFirestore.service' {
  interface ReadUsersParams {
    userSelectedRol: number
  }
  const readUsersFromFirestore: (params: ReadUsersParams) => void
  export default readUsersFromFirestore
}

declare module '#@/services/readUserFromFirestore.service' {
  interface ReadUserParams {
    firestoreUserID: string
    userSelectedRol: number
  }
  const readUserFromFirestore: (params: ReadUserParams) => void
  export default readUserFromFirestore
}

declare module '#@/services/updateUserToFirestore.service' {
  interface UpdateUserParams {
    firestoreUserID: string
    userSelectedRol: number
    userEditInfo: Record<string, unknown>
  }
  const updateUserToFirestore: (params: UpdateUserParams) => void
  export default updateUserToFirestore
}

declare module '#@/services/updateDraftToFirestore.service' {
  interface UpdateDraftParams {
    updateInfo: Record<string, unknown>
    docId: string
  }
  const updateDraftToFirestore: (params: UpdateDraftParams) => void
  export default updateDraftToFirestore
}

declare module '#@/services/updateQuotationToFirestore.service' {
  interface UpdateQuotationParams {
    updateInfo: Record<string, unknown>
    docId: string
  }
  const updateQuotationToFirestore: (params: UpdateQuotationParams) => void
  export default updateQuotationToFirestore
}

declare module '#@/services/readQuotationFromFirestore.service' {
  interface ReadQuotationParams {
    docId: string
  }
  const readQuotationFromFirestore: (params: ReadQuotationParams) => void
  export default readQuotationFromFirestore
}

declare module '#@/index/components/SnackBarAlert' {
  interface SnackBarAlertProps {
    message: string
    onClose: (event: unknown, reason: string) => void
    severity: 'success' | 'error' | 'warning' | 'info'
    open: boolean
  }
  const Component: React.ComponentType<SnackBarAlertProps>
  export default Component
}

declare module '#@/index/components/ListadoCategorias' {
  interface CategoriaItem {
    key: number
    label: string
    icon?: React.ReactNode
    [key: string]: unknown
  }
  export const ListadoCategorias: CategoriaItem[]
}

// New @index alias pattern
declare module '@index/components/ListadoCategorias' {
  import type { ElementType } from 'react'
  
  interface CategoriaItem {
    key: number
    label: string
    rol: string
    variant: 'outlined' | 'filled'
    icon: ElementType
  }
  export const ListadoCategorias: CategoriaItem[]
}

declare module '@index/components/SeleccionarCategoria' {
  const Component: React.ComponentType<Record<string, unknown>>
  export default Component
}


declare module '@app/components/ChipsCategories' {
    const Component: React.ComponentType<any>;
    export default Component;
}
