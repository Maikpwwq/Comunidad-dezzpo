import React, { useState, createContext, useEffect, type ReactNode } from 'react'
import { subscribeToAuth } from '@services/firebase/authService'

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

    // Persist Auth State
    useEffect(() => {
        const unsubscribe = subscribeToAuth((user: any) => {
            if (user) {
                // User is signed in
                setCurrentUser(prev => ({
                    ...prev,
                    userId: user.uid,
                    email: user.email ?? null,
                    displayName: user.displayName ?? null,
                    photoUrl: user.photoURL ?? null,
                    isAuth: true,
                    // If we had role persistence in localStorage, we could try to read it here
                    // largely relies on the app logic to fetch/set role after auth
                    // For now, we keep existing role if partially hydrated or rely on fetch
                }))

                // Optional: Recover role from localStorage if needed (legacy pattern)
                const storedRole = localStorage.getItem('role')
                if (storedRole) {
                    updateRol(parseInt(storedRole))
                }
            } else {
                // User is signed out
                setCurrentUser(initialValue)
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