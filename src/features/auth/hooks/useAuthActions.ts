/**
 * useAuthActions Hook
 *
 * Centralized Firebase authentication logic using @services/firebase.
 * Extracted from ingreso/+Page.tsx and registro/+Page.tsx.
 *
 * Now uses ServiceResponse<T> pattern for type-safe error handling.
 */

import { useState, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import { useUserStore } from '@stores/userStore'
import {
    signInWithEmail,
    signInWithGoogle,
    registerWithEmail as registerService,
    logout as logoutService,
} from '@services/firebase'
import { setUser } from '@services/users'
import { format } from 'date-fns'

import type {
    AlertState,
    LoginFormData,
    RegisterFormData,
    AuthResult,
    UserFirestoreData,
    DraftInfo,
    UserRoleNumeric,
} from '../types'

interface UseAuthActionsReturn {
    alert: AlertState
    showAlert: (message: string, severity: AlertState['severity']) => void
    closeAlert: () => void
    loginWithEmail: (data: LoginFormData, draftInfo?: DraftInfo) => Promise<AuthResult>
    loginWithGoogle: (role: UserRoleNumeric, draftInfo?: DraftInfo) => Promise<AuthResult>
    registerWithEmail: (data: RegisterFormData, draftInfo?: DraftInfo) => Promise<AuthResult>
    registerWithGoogle: (data: { role: UserRoleNumeric; name?: string }, draftInfo?: DraftInfo) => Promise<AuthResult>
    logout: () => Promise<void>
    isLoading: boolean
}

export function useAuthActions(): UseAuthActionsReturn {
    const updateUser = useUserStore((state) => state.updateUser)
    const clearUser = useUserStore((state) => state.clearUser)

    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success',
    })
    const [isLoading, setIsLoading] = useState(false)

    const showAlert = useCallback((message: string, severity: AlertState['severity']) => {
        setAlert({ open: true, message, severity })
    }, [])

    const closeAlert = useCallback(() => {
        setAlert((prev: AlertState) => ({ ...prev, open: false }))
    }, [])

    /**
     * Common success handler - updates Zustand, localStorage, and Firestore
     */
    const handleAuthSuccess = useCallback(
        async (
            userData: { uid: string; email: string | null; displayName: string | null },
            role: UserRoleNumeric,
            draftInfo?: DraftInfo,
            isRegistration = false
        ): Promise<void> => {
            const { uid, email, displayName } = userData

            // Update Zustand store
            updateUser({
                displayName,
                userId: uid,
                email,
                isAuth: true,
                rol: role,
            })

            // Legacy localStorage
            localStorage.setItem('role', JSON.stringify(role))
            localStorage.setItem('userID', JSON.stringify(uid))

            // Create Firestore document for new registrations
            if (isRegistration && role) {
                const data: UserFirestoreData = {
                    userMail: email,
                    userJoined: format(new Date(), 'dd-MM-yyyy'),
                    userId: uid,
                    userChannelUrl: '',
                    userCreatedDrafts: draftInfo ? [draftInfo.draftId] : [],
                    userName: displayName,
                }
                await setUser({ userId: uid, role, data })
            }

            // Navigate based on context
            if (draftInfo) {
                // Draft flow handled by parent component
            } else if (isRegistration) {
                navigate(`/app/ajustes/${uid}`)
            } else {
                navigate(`/app/perfil/${uid}`)
            }
        },
        [updateUser]
    )

    // Login with email - uses authService
    const loginWithEmail = useCallback(
        async (data: LoginFormData, draftInfo?: DraftInfo): Promise<AuthResult> => {
            const { email, password, role } = data

            if (!role) {
                showAlert('Selecciona un rol para ingresar!', 'info')
                return { success: false, error: 'No role selected' }
            }

            setIsLoading(true)

            const result = await signInWithEmail({ email, password })

            if (result.success) {
                await handleAuthSuccess(result.data, role, draftInfo, false)
                showAlert('Cuenta autorizada con éxito.', 'success')
                setIsLoading(false)
                return { success: true }
            } else {
                showAlert(result.error.message, 'error')
                setIsLoading(false)
                return { success: false, error: result.error.message }
            }
        },
        [showAlert, handleAuthSuccess]
    )

    // Login with Google - uses authService
    const loginWithGoogle = useCallback(
        async (role: UserRoleNumeric, draftInfo?: DraftInfo): Promise<AuthResult> => {
            if (!role) {
                showAlert('Selecciona un rol para ingresar!', 'info')
                return { success: false, error: 'No role selected' }
            }

            setIsLoading(true)

            const result = await signInWithGoogle()

            if (result.success) {
                await handleAuthSuccess(result.data, role, draftInfo, false)
                showAlert('Cuenta autorizada con éxito.', 'success')
                setIsLoading(false)
                return { success: true }
            } else {
                showAlert(result.error.message, 'error')
                setIsLoading(false)
                return { success: false, error: result.error.message }
            }
        },
        [showAlert, handleAuthSuccess]
    )

    // Register with email - uses authService
    const registerWithEmail = useCallback(
        async (data: RegisterFormData, draftInfo?: DraftInfo): Promise<AuthResult> => {
            const { email, password, role, name } = data

            if (!role) {
                showAlert('Selecciona un rol para registrarte!', 'info')
                return { success: false, error: 'No role selected' }
            }

            setIsLoading(true)

            const result = await registerService({ email, password, displayName: name })

            if (result.success) {
                await handleAuthSuccess(result.data, role, draftInfo, true)
                showAlert('Cuenta creada con éxito!', 'success')
                setIsLoading(false)
                return { success: true }
            } else {
                showAlert(result.error.message, 'error')
                setIsLoading(false)
                return { success: false, error: result.error.message }
            }
        },
        [showAlert, handleAuthSuccess]
    )

    // Register with Google - uses authService
    const registerWithGoogle = useCallback(
        async (data: { role: UserRoleNumeric }, draftInfo?: DraftInfo): Promise<AuthResult> => {
            const { role } = data

            if (!role) {
                showAlert('Selecciona un rol para registrarte!', 'info')
                return { success: false, error: 'No role selected' }
            }

            setIsLoading(true)

            const result = await signInWithGoogle()

            if (result.success) {
                await handleAuthSuccess(result.data, role, draftInfo, true)
                showAlert('Cuenta creada con éxito!', 'success')
                setIsLoading(false)
                return { success: true }
            } else {
                showAlert(result.error.message, 'error')
                setIsLoading(false)
                return { success: false, error: result.error.message }
            }
        },
        [showAlert, handleAuthSuccess]
    )

    // Logout - uses authService
    const logout = useCallback(async (): Promise<void> => {
        const result = await logoutService()

        if (result.success) {
            clearUser()
            localStorage.removeItem('role')
            localStorage.removeItem('userID')
            navigate('/')
        } else {
            showAlert(result.error.message, 'error')
        }
    }, [clearUser, showAlert])

    return {
        alert,
        showAlert,
        closeAlert,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        registerWithGoogle,
        logout,
        isLoading,
    }
}

export default useAuthActions
