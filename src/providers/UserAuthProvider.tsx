import React, { useState, createContext, type ReactNode } from 'react'

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