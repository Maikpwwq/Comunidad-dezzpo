/**
 * useAuth Hook
 *
 * Provides access to the current user authentication state and actions.
 * Wraps the UserAuthContext for convenient access throughout the app.
 *
 * @example
 * ```tsx
 * const { currentUser, isAuthenticated, role, updateUser, logout } = useAuth()
 *
 * if (!isAuthenticated) {
 *   return <LoginPrompt />
 * }
 * ```
 */

import { useContext, useMemo, useCallback } from 'react'
import { UserAuthContext } from '@providers/UserAuthProvider'

export interface CurrentUser {
    userId: string | null
    displayName: string | null
    mobileOpen: boolean
    isAuth: boolean
    updated: boolean
    rol: number | null
    [key: string]: unknown
}

export interface UseAuthReturn {
    /** Current user state */
    currentUser: CurrentUser
    /** Whether user is authenticated */
    isAuthenticated: boolean
    /** User role (0 = propietario, 1 = profesional) */
    role: number | null
    /** User ID */
    userId: string | null
    /** Display name */
    displayName: string | null
    /** Update user data */
    updateUser: (data: Partial<CurrentUser>) => void
    /** Update user role */
    updateRol: (rol: number) => void
    /** Update authentication state */
    updateIsAuth: (isAuth: boolean) => void
    /** Toggle mobile menu */
    updateMobileMenu: (open: boolean) => void
    /** Clear auth user (logout) */
    clearAuthUser: () => void
}

/**
 * Hook for accessing authentication state and actions
 */
export function useAuth(): UseAuthReturn {
    const context = useContext(UserAuthContext)

    if (!context) {
        throw new Error('useAuth must be used within a UserAuthProvider')
    }

    const {
        currentUser,
        updateRol,
        updateIsAuth,
        updateMobileMenu,
        updateUser,
        clearAuthUser,
    } = context

    // Derived state
    const isAuthenticated = useMemo(() => currentUser?.isAuth ?? false, [currentUser])
    const role = useMemo(() => currentUser?.rol ?? null, [currentUser])
    const userId = useMemo(() => currentUser?.userId ?? null, [currentUser])
    const displayName = useMemo(() => currentUser?.displayName ?? null, [currentUser])

    // Memoized update function to prevent re-renders
    const memoizedUpdateUser = useCallback(
        (data: Partial<CurrentUser>) => {
            updateUser(data)
        },
        [updateUser]
    )

    return {
        currentUser: currentUser as CurrentUser,
        isAuthenticated,
        role,
        userId,
        displayName,
        updateUser: memoizedUpdateUser,
        updateRol,
        updateIsAuth,
        updateMobileMenu,
        clearAuthUser,
    }
}

export default useAuth
