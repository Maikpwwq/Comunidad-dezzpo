import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  mobileOpen: boolean
}

export interface UserActions {
  updateUser: (data: Partial<UserState>) => void
  updateRol: (rol: 1 | 2 | null) => void
  updateIsAuth: (isAuth: boolean) => void
  updateMobileMenu: (open: boolean) => void
  clearUser: () => void
  hydrate: (data: Partial<UserState>) => void
}

const initialState: UserState = {
  userId: null,
  displayName: null,
  email: null,
  photoUrl: null,
  rol: null,
  isAuth: false,
  mobileOpen: false,
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
  }))

export const useIsAuthenticated = () => useUserStore((state) => state.isAuth)

export const useUserRol = () => useUserStore((state) => state.rol)

export const useMobileMenu = () =>
  useUserStore((state) => ({
    mobileOpen: state.mobileOpen,
    updateMobileMenu: state.updateMobileMenu,
  }))

export default useUserStore
