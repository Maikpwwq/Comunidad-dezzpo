export { UserAuthProvider }

import React, { useState, createContext } from 'react'

export const UserAuthContext = createContext()

const initialValue = {
    userId: null,
    displayName: null,
    isAuth: false,
    updated: false,
    rol: null,
}

const UserAuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(initialValue)
    const updateRol = (rol) => {
        // console.log('updateRol', rol)
        setCurrentUser((currentUser) => ({
            ...currentUser,
            rol: rol,
        }))
    }
    const updateUser = (newData) => {
        // console.log('updateUser', newData)
        setCurrentUser((currentUser) => ({
            ...currentUser,
            ...newData,
        }))
    }
    const updateIsAuth = (bool) => {
        // console.log('updateIsAuth', bool)
        setCurrentUser((currentUser) => ({
            ...currentUser,
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
                updateUser,
                clearAuthUser,
            }}
        >
            {children}
        </UserAuthContext.Provider>
    )
}
