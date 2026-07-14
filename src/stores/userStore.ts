import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ContactEmail, ContactPhone, SocialLink } from '@services/types'

/**
 * User Authentication Store
 *
 * Replaces the legacy UserAuthProvider Context + RxJS pattern.
 * Zustand provides simpler state management with built-in persistence.
 *
 * @example
 * ```tsx
 * // Read state
 * const { currentUser, isAuth } = useUserStore()
 *
 * // Update state
 * const updateUser = useUserStore((state) => state.updateUser)
 * updateUser({ displayName: 'New Name' })
 * ```
 */

export interface UserState {
  userId: string | null
  displayName: string | null
  email: string | null
  photoUrl: string | null
  rol: 1 | 2 | null // 1 = Propietario, 2 = Comerciante
  isAuth: boolean
  isAdmin: boolean
  mobileOpen: boolean
  emails: ContactEmail[]
  phones: ContactPhone[]
  socialLinks: SocialLink[]
  savedDrafts: string[]
  likedProfiles: string[]
  // Coverage zones (comerciante only)
  userZonasCobertura: string[]
  coberturaTodaLaCiudad: boolean
  isAvailableNow: boolean
}

export interface UserActions {
  updateUser: (data: Partial<UserState>) => void
  updateRol: (rol: 1 | 2 | null) => void
  updateIsAuth: (isAuth: boolean) => void
  updateMobileMenu: (open: boolean) => void
  clearUser: () => void
  hydrate: (data: Partial<UserState>) => void
  // Multi-channel contact actions
  updateContact: (type: 'emails' | 'phones', index: number, data: Partial<ContactEmail> | Partial<ContactPhone>) => void
  addContact: (type: 'emails' | 'phones', entry: ContactEmail | ContactPhone) => void
  removeContact: (type: 'emails' | 'phones', index: number) => void
  setPrimaryContact: (type: 'emails' | 'phones', index: number) => void
  // Social links actions
  setSocialLinks: (links: SocialLink[]) => void
  addSocialLink: (link: SocialLink) => void
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void
  removeSocialLink: (id: string) => void
  // Favorites actions
  setSavedDrafts: (drafts: string[]) => void
  setLikedProfiles: (profiles: string[]) => void
  toggleSavedDraft: (draftId: string) => void
  toggleLikedProfile: (profileId: string) => void
  // Coverage zone actions (comerciante)
  setZonasCobertura: (zonas: string[]) => void
  setCoberturaTodaLaCiudad: (flag: boolean) => void
  setIsAvailableNow: (flag: boolean) => void
}

const initialState: UserState = {
  userId: null,
  displayName: null,
  email: null,
  photoUrl: null,
  rol: null,
  isAuth: false,
  isAdmin: false,
  mobileOpen: false,
  emails: [],
  phones: [],
  socialLinks: [],
  savedDrafts: [],
  likedProfiles: [],
  userZonasCobertura: [],
  coberturaTodaLaCiudad: false,
  isAvailableNow: false,
}

/**
 * User Store with localStorage persistence
 *
 * The 'role' key in localStorage is maintained for backwards compatibility
 * with the legacy localStorage.getItem('role') pattern.
 */
export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      ...initialState,

      updateUser: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updateRol: (rol) =>
        set((state) => ({
          ...state,
          rol,
        })),

      updateIsAuth: (isAuth) =>
        set((state) => ({
          ...state,
          isAuth,
        })),

      updateMobileMenu: (mobileOpen) =>
        set((state) => ({
          ...state,
          mobileOpen,
        })),

      clearUser: () => set(initialState),

      hydrate: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      updateContact: (type, index, data) =>
        set((state) => {
          const arr = [...state[type]]
          arr[index] = { ...arr[index], ...data } as any
          return { ...state, [type]: arr }
        }),

      addContact: (type, entry) =>
        set((state) => ({
          ...state,
          [type]: [...state[type], entry],
        })),

      removeContact: (type, index) =>
        set((state) => {
          const arr = [...state[type]]
          // Prevent removing primary contact
          if ((arr[index] as any)?.isPrimary) return state
          arr.splice(index, 1)
          return { ...state, [type]: arr }
        }),

      setPrimaryContact: (type, index) =>
        set((state) => {
          const arr = state[type].map((item, i) => ({
            ...item,
            isPrimary: i === index,
          }))
          return { ...state, [type]: arr }
        }),

      setSocialLinks: (links) =>
        set((state) => ({ ...state, socialLinks: links })),

      addSocialLink: (link) =>
        set((state) => ({
          ...state,
          socialLinks: [...state.socialLinks, link],
        })),

      updateSocialLink: (id, updates) =>
        set((state) => ({
          ...state,
          socialLinks: state.socialLinks.map((sl) =>
            sl.id === id ? { ...sl, ...updates } : sl
          ),
        })),

      removeSocialLink: (id) =>
        set((state) => ({
          ...state,
          socialLinks: state.socialLinks.filter((sl) => sl.id !== id),
        })),

      // Favorites
      setSavedDrafts: (drafts) =>
        set((state) => ({ ...state, savedDrafts: drafts })),

      setLikedProfiles: (profiles) =>
        set((state) => ({ ...state, likedProfiles: profiles })),

      toggleSavedDraft: (draftId) =>
        set((state) => ({
          ...state,
          savedDrafts: state.savedDrafts.includes(draftId)
            ? state.savedDrafts.filter((id) => id !== draftId)
            : [...state.savedDrafts, draftId],
        })),

      toggleLikedProfile: (profileId) =>
        set((state) => ({
          ...state,
          likedProfiles: state.likedProfiles.includes(profileId)
            ? state.likedProfiles.filter((id) => id !== profileId)
            : [...state.likedProfiles, profileId],
        })),

      // Coverage zone actions
      setZonasCobertura: (zonas) =>
        set((state) => ({ ...state, userZonasCobertura: zonas })),

      setCoberturaTodaLaCiudad: (flag) =>
        set((state) => ({ ...state, coberturaTodaLaCiudad: flag })),

      // Availability action
      setIsAvailableNow: (flag) =>
        set((state) => ({ ...state, isAvailableNow: flag })),
    }),
    {
      name: 'user-storage',
      // SSR-safe: Skip hydration on server, only hydrate on client
      skipHydration: true,
      partialize: (state) => ({
        userId: state.userId,
        displayName: state.displayName,
        email: state.email,
        rol: state.rol,
        isAuth: state.isAuth,
        isAdmin: state.isAdmin,
        emails: state.emails,
        phones: state.phones,
        socialLinks: state.socialLinks,
        savedDrafts: state.savedDrafts,
        likedProfiles: state.likedProfiles,
        userZonasCobertura: state.userZonasCobertura,
        coberturaTodaLaCiudad: state.coberturaTodaLaCiudad,
        isAvailableNow: state.isAvailableNow,
      }),
    }
  )
)

/**
 * Selector hooks for common access patterns
 * Use these for better performance (prevents unnecessary re-renders)
 */
export const useCurrentUser = () =>
  useUserStore((state) => ({
    userId: state.userId,
    displayName: state.displayName,
    email: state.email,
    photoUrl: state.photoUrl,
    rol: state.rol,
    emails: state.emails,
    phones: state.phones,
    socialLinks: state.socialLinks,
  }))

export const useIsAuthenticated = () => useUserStore((state) => state.isAuth)

export const useUserRol = () => useUserStore((state) => state.rol)

export const useMobileMenu = () =>
  useUserStore((state) => ({
    mobileOpen: state.mobileOpen,
    updateMobileMenu: state.updateMobileMenu,
  }))

export default useUserStore
