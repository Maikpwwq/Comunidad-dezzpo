import React, { useState, createContext, useEffect, type ReactNode } from 'react'
import { subscribeToAuth } from '@services/firebase/authService'
import { useUserStore } from '@stores/userStore'

interface UserData {
    userId: string | null
    displayName: string | null
    mobileOpen: boolean
    isAuth: boolean
    updated: boolean
    rol: string | number | null
}

interface UserAuthContextType {
    currentUser: UserData
    updateRol: (rol: string | number) => void
    updateIsAuth: (bool: boolean) => void
    updateMobileMenu: (bool: boolean) => void
    updateUser: (newData: Partial<UserData>) => void
    clearAuthUser: () => void
}

const initialValue: UserData = {
    userId: null,
    displayName: null,
    mobileOpen: false,
    isAuth: false,
    updated: false,
    rol: null,
}

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined)

interface UserAuthProviderProps {
    children: ReactNode
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserData>(initialValue)

    const updateRol = (rol: string | number) => {
        setCurrentUser((prev) => ({
            ...prev,
            rol: rol,
        }))
    }

    const updateUser = (newData: Partial<UserData>) => {
        setCurrentUser((prev) => ({
            ...prev,
            ...newData,
        }))
    }

    const updateMobileMenu = (bool: boolean) => {
        setCurrentUser((prev) => ({
            ...prev,
            mobileOpen: bool,
        }))
    }

    const updateIsAuth = (bool: boolean) => {
        setCurrentUser((prev) => ({
            ...prev,
            isAuth: bool,
        }))
    }

    const clearAuthUser = () => {
        setCurrentUser(initialValue)
    }

    // Rehydrate Zustand store from localStorage on client mount
    useEffect(() => {
        useUserStore.persist.rehydrate()
    }, [])

    // Persist Auth State — sync to BOTH Context and Zustand store
    useEffect(() => {
        const unsubscribe = subscribeToAuth((user: any) => {
            if (user) {
                // Update Context
                setCurrentUser(prev => ({
                    ...prev,
                    userId: user.uid,
                    email: user.email ?? null,
                    displayName: user.displayName ?? null,
                    photoUrl: user.photoURL ?? null,
                    isAuth: true,
                }))

                // Sync to Zustand store (what Sidebar/Navbar read)
                useUserStore.getState().updateUser({
                    userId: user.uid,
                    email: user.email ?? null,
                    displayName: user.displayName ?? null,
                    photoUrl: user.photoURL ?? null,
                    isAuth: true,
                })

                // Recover role from localStorage (legacy pattern)
                const storedRole = localStorage.getItem('role')
                if (storedRole) {
                    const rol = parseInt(storedRole) as 1 | 2
                    updateRol(rol)
                    useUserStore.getState().updateRol(rol)
                }
            } else {
                // User is signed out
                setCurrentUser(initialValue)
                useUserStore.getState().clearUser()
            }
        })

        return () => unsubscribe()
    }, [])

    return (
        <UserAuthContext.Provider
            value={{
                currentUser,
                updateRol,
                updateIsAuth,
                updateMobileMenu,
                updateUser,
                clearAuthUser,
            }}
        >
            {children}
        </UserAuthContext.Provider>
    )
}

export default UserAuthProvider