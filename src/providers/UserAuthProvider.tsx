import React, { useState, createContext, useEffect, type ReactNode } from 'react'
import { subscribeToAuth } from '@services/firebase/authService'
import { getUser, findUserByPhone } from '@services/users'
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
                    phoneNumber: user.phoneNumber ?? null,
                    displayName: user.displayName ?? null,
                    photoUrl: user.photoURL ?? null,
                    isAuth: true,
                }))

                // Sync to Zustand store (what Sidebar/Navbar read)
                useUserStore.getState().updateUser({
                    userId: user.uid,
                    email: user.email ?? null,
                    phoneNumber: user.phoneNumber ?? null,
                    displayName: user.displayName ?? null,
                    photoUrl: user.photoURL ?? null,
                    isAuth: true,
                })

                // Check admin custom claim and sync to Zustand
                import('@services/firebase/client').then(({ auth }) => {
                    if (auth?.currentUser) {
                        auth.currentUser.getIdTokenResult().then((result) => {
                            useUserStore.getState().updateUser({
                                isAdmin: result.claims.admin === true,
                            })
                        }).catch(() => { })
                    }
                })

                // Recover role and user ID from localStorage (supports linked accounts)
                let storedUid = user.uid
                try {
                    const rawStoredId = localStorage.getItem('userID')
                    if (rawStoredId) {
                        const parsed = JSON.parse(rawStoredId)
                        if (typeof parsed === 'string' && parsed.length > 0) {
                            storedUid = parsed
                        }
                    }
                } catch (_) { }

                const storedRole = localStorage.getItem('role')
                if (storedRole) {
                    const rol = parseInt(storedRole) as 1 | 2
                    updateRol(rol)
                    useUserStore.getState().updateRol(rol)

                    // Hydrate favorites and profile data from Firestore
                    getUser({ userId: storedUid, role: rol }).then(async (userData) => {
                        if (userData) {
                            useUserStore.getState().setSavedDrafts(userData.savedDrafts ?? [])
                            useUserStore.getState().setLikedProfiles(userData.userLikes?.likedsProfiles ?? [])
                        } else if (user.phoneNumber) {
                            // Fallback: search by phone number if account was auto-linked
                            const found = await findUserByPhone(user.phoneNumber, rol)
                            if (found) {
                                localStorage.setItem('userID', JSON.stringify(found.existingUid))
                                useUserStore.getState().updateUser({ userId: found.existingUid })
                                setCurrentUser(prev => ({ ...prev, userId: found.existingUid }))
                                useUserStore.getState().setSavedDrafts(found.user.savedDrafts ?? [])
                                useUserStore.getState().setLikedProfiles(found.user.userLikes?.likedsProfiles ?? [])
                            }
                        }
                    }).catch((err) => {
                        console.error('[Favorites] Error hydrating user favorites:', err)
                    })
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