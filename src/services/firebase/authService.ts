/**
 * Firebase Auth Service
 *
 * Centralized authentication service using ServiceResponse<T> discriminated union pattern.
 * All auth operations return consistent success/error states.
 * SSR-safe: All functions check for client-side availability before using Firebase.
 */

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    updateProfile,
    type User,
    type Unsubscribe as FirebaseUnsubscribe,
} from 'firebase/auth'
import type {
    ServiceResponse,
    ServiceErrorCode,
    EmailCredentials,
    RegisterCredentials,
    AuthUser,
    AuthCallback,
    Unsubscribe,
} from '@/types/services.d'

// Import auth instance - may be null during SSR
import { auth, isFirebaseAvailable } from './client'

// Lazy-initialize Google provider only on client
let googleProvider: GoogleAuthProvider | null = null

function getGoogleProvider(): GoogleAuthProvider {
    if (!googleProvider) {
        googleProvider = new GoogleAuthProvider()
    }
    return googleProvider
}

/**
 * Convert Firebase User to AuthUser type
 */
function toAuthUser(user: User): AuthUser {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
    }
}

/**
 * Map Firebase error codes to ServiceErrorCode
 */
function mapAuthErrorCode(firebaseCode?: string): ServiceErrorCode {
    if (firebaseCode?.includes('network')) return 'AUTH_NETWORK_ERROR'
    return 'AUTH_INVALID_CREDENTIALS'
}

/**
 * SSR-safe error response
 */
function ssrErrorResponse<T>(): ServiceResponse<T> {
    return {
        success: false,
        data: null,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Auth not available (SSR)',
        },
    }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
    credentials: EmailCredentials
): Promise<ServiceResponse<AuthUser>> {
    if (!isFirebaseAvailable() || !auth) {
        return ssrErrorResponse()
    }

    try {
        const { email, password } = credentials
        const result = await signInWithEmailAndPassword(auth, email, password)
        return {
            success: true,
            data: toAuthUser(result.user),
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        let message = firebaseError.message ?? 'Error de autenticación'

        if (firebaseError.code === 'auth/wrong-password') {
            message = 'Clave incorrecta!'
        } else if (firebaseError.code === 'auth/user-not-found') {
            message = 'Usuario no encontrado!'
        } else if (firebaseError.code === 'auth/invalid-email') {
            message = 'Email inválido'
        }

        return {
            success: false,
            data: null,
            error: {
                code: mapAuthErrorCode(firebaseError.code),
                message,
            },
        }
    }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<ServiceResponse<AuthUser>> {
    if (!isFirebaseAvailable() || !auth) {
        return ssrErrorResponse()
    }

    try {
        const result = await signInWithPopup(auth, getGoogleProvider())
        return {
            success: true,
            data: toAuthUser(result.user),
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapAuthErrorCode(firebaseError.code),
                message: firebaseError.message ?? 'Error con Google',
            },
        }
    }
}

/**
 * Register new user with email and password
 */
export async function registerWithEmail(
    credentials: RegisterCredentials
): Promise<ServiceResponse<AuthUser>> {
    if (!isFirebaseAvailable() || !auth) {
        return ssrErrorResponse()
    }

    try {
        const { email, password, displayName } = credentials
        const result = await createUserWithEmailAndPassword(auth, email, password)

        if (displayName) {
            await updateProfile(result.user, { displayName })
        }

        return {
            success: true,
            data: toAuthUser(result.user),
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        let message = firebaseError.message ?? 'Error al registrar'

        if (firebaseError.code === 'auth/email-already-in-use') {
            message = 'Este email ya está registrado.'
        } else if (firebaseError.code === 'auth/weak-password') {
            message = 'La contraseña es muy débil.'
        }

        return {
            success: false,
            data: null,
            error: {
                code: mapAuthErrorCode(firebaseError.code),
                message,
            },
        }
    }
}

/**
 * Sign out current user
 */
export async function logout(): Promise<ServiceResponse<void>> {
    if (!isFirebaseAvailable() || !auth) {
        return ssrErrorResponse()
    }

    try {
        await signOut(auth)
        return { success: true, data: undefined as unknown as void, error: null }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message: firebaseError.message ?? 'Error al cerrar sesión',
            },
        }
    }
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(callback: AuthCallback): Unsubscribe {
    if (!isFirebaseAvailable() || !auth) {
        // Return a no-op unsubscribe function during SSR
        return () => {}
    }

    return onAuthStateChanged(auth, (user) => {
        callback(user ? toAuthUser(user) : null)
    }) as FirebaseUnsubscribe
}

/**
 * Get current user (synchronous)
 */
export function getCurrentUser(): AuthUser | null {
    if (!isFirebaseAvailable() || !auth) {
        return null
    }
    const user = auth.currentUser
    return user ? toAuthUser(user) : null
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    if (!isFirebaseAvailable() || !auth) {
        return false
    }
    return auth.currentUser !== null
}

/**
 * Get raw Firebase auth instance for advanced use cases
 */
export function getAuthInstance() {
    return auth
}
