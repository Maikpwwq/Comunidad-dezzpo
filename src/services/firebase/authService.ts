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
    PhoneAuthProvider,
    linkWithPopup,
    linkWithCredential,
    unlink,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult,
    type User,
    type Unsubscribe as FirebaseUnsubscribe,
} from 'firebase/auth'
import type {
    ServiceResponse,
    ServiceErrorCode,
    EmailCredentials,
    RegisterCredentials,
    AuthUser,
    LinkedAuthProvider,
    AuthCallback,
    Unsubscribe,
} from '@/types/services.d'

// Import auth instance - may be null during SSR
import { auth, isFirebaseAvailable } from './client'
import { syncSendbirdUser } from '@services/sendbird'
import { formatToE164 } from '@services/utils/phoneUtils'

export type { ConfirmationResult }

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
        phoneNumber: user.phoneNumber,
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
 * Map Firebase phone auth error codes
 */
function mapPhoneAuthErrorCode(firebaseCode?: string): ServiceErrorCode {
    if (firebaseCode === 'auth/invalid-phone-number') return 'AUTH_INVALID_PHONE'
    if (firebaseCode === 'auth/code-expired') return 'AUTH_CODE_EXPIRED'
    if (firebaseCode === 'auth/invalid-verification-code') return 'AUTH_INVALID_CODE'
    if (firebaseCode === 'auth/captcha-check-failed') return 'AUTH_CAPTCHA_FAILED'
    if (firebaseCode === 'auth/too-many-requests') return 'AUTH_TOO_MANY_REQUESTS'
    if (firebaseCode?.includes('network')) return 'AUTH_NETWORK_ERROR'
    return 'AUTH_INVALID_CREDENTIALS'
}

/**
 * Map Firebase phone auth error messages to friendly Spanish explanations
 */
function mapPhoneAuthErrorMessage(firebaseCode?: string, fallback?: string): string {
    if (firebaseCode === 'auth/invalid-phone-number') {
        return 'El número de teléfono no es válido. Usa el formato con prefijo (ej: +57 320 484 2897).'
    }
    if (firebaseCode === 'auth/missing-phone-number') {
        return 'Por favor ingresa un número de teléfono celular.'
    }
    if (firebaseCode === 'auth/quota-exceeded') {
        return 'Se ha alcanzado el límite de SMS para este número. Intenta más tarde.'
    }
    if (firebaseCode === 'auth/captcha-check-failed') {
        return 'La verificación reCAPTCHA ha fallado o fue cancelada. Intenta nuevamente.'
    }
    if (firebaseCode === 'auth/invalid-verification-code') {
        return 'El código de 6 dígitos ingresado es incorrecto.'
    }
    if (firebaseCode === 'auth/code-expired') {
        return 'El código SMS ha expirado. Por favor solicita un nuevo código.'
    }
    if (firebaseCode === 'auth/too-many-requests') {
        return 'Demasiados intentos fallidos. Por favor espera unos minutos antes de intentar de nuevo.'
    }
    if (firebaseCode === 'auth/user-disabled') {
        return 'Esta cuenta ha sido inhabilitada.'
    }
    return fallback || 'Error en la verificación telefónica'
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
        const authUser = toAuthUser(result.user)
        // Fire and forget Sendbird sync
        syncSendbirdUser(authUser.uid, authUser.displayName || 'Usuario', authUser.photoURL || undefined).catch(console.error)
        
        return {
            success: true,
            data: authUser,
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
        const authUser = toAuthUser(result.user)
        // Fire and forget Sendbird sync
        syncSendbirdUser(authUser.uid, authUser.displayName || 'Usuario', authUser.photoURL || undefined).catch(console.error)

        return {
            success: true,
            data: authUser,
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

        const authUser = toAuthUser(result.user)
        // Fire and forget Sendbird sync
        syncSendbirdUser(authUser.uid, authUser.displayName || 'Usuario', authUser.photoURL || undefined).catch(console.error)

        return {
            success: true,
            data: authUser,
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

// Global registry of active RecaptchaVerifiers by container ID to manage cleanup safely
const recaptchaVerifiers: Record<string, RecaptchaVerifier> = {}

/**
 * Sets up an invisible RecaptchaVerifier on the specified DOM container.
 * SSR-safe: returns null on server-side.
 */
export function setupRecaptchaVerifier(containerId: string = 'recaptcha-container'): RecaptchaVerifier | null {
    if (!isFirebaseAvailable() || !auth || typeof window === 'undefined') {
        return null
    }

    try {
        const container = document.getElementById(containerId)
        if (!container) {
            console.warn(`[authService] Recaptcha container '#${containerId}' not found in DOM`)
            return null
        }

        // Clean up previous instance if any
        if (recaptchaVerifiers[containerId]) {
            try {
                recaptchaVerifiers[containerId].clear()
            } catch (_) {}
            delete recaptchaVerifiers[containerId]
        }

        // Reset container DOM to prevent "reCAPTCHA has already been rendered in this element"
        container.innerHTML = ''

        const verifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved - proceed with phone auth
            },
            'expired-callback': () => {
                console.warn('[authService] reCAPTCHA token expired, re-triggering may be necessary')
            },
        })

        recaptchaVerifiers[containerId] = verifier
        return verifier
    } catch (err: any) {
        console.warn('[authService] Warning initializing RecaptchaVerifier, attempting reset:', err)
        try {
            const container = document.getElementById(containerId)
            if (container) {
                container.innerHTML = ''
                const fallbackVerifier = new RecaptchaVerifier(auth, containerId, {
                    size: 'invisible',
                })
                recaptchaVerifiers[containerId] = fallbackVerifier
                return fallbackVerifier
            }
        } catch (retryErr) {
            console.error('[authService] Retry RecaptchaVerifier failed:', retryErr)
        }
        return null
    }
}

/**
 * Cleans up and clears a RecaptchaVerifier instance.
 */
export function cleanupRecaptchaVerifier(containerId: string = 'recaptcha-container'): void {
    if (recaptchaVerifiers[containerId]) {
        try {
            recaptchaVerifiers[containerId].clear()
        } catch (_) {}
        delete recaptchaVerifiers[containerId]
    }
    if (typeof document !== 'undefined') {
        const container = document.getElementById(containerId)
        if (container) {
            container.innerHTML = ''
        }
    }
}

/**
 * Sends a 6-digit SMS verification code to the provided phone number.
 * Ensures the phone number is formatted to international E.164.
 */
export async function sendSMSCode(
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
): Promise<ServiceResponse<ConfirmationResult>> {
    if (!isFirebaseAvailable() || !auth) {
        return ssrErrorResponse()
    }

    try {
        const formattedPhone = formatToE164(phoneNumber)
        if (!formattedPhone) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'AUTH_INVALID_PHONE',
                    message: 'Por favor ingresa un número de teléfono celular válido.',
                },
            }
        }

        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)

        return {
            success: true,
            data: confirmationResult,
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapPhoneAuthErrorCode(firebaseError.code),
                message: mapPhoneAuthErrorMessage(firebaseError.code, firebaseError.message),
            },
        }
    }
}

/**
 * Verifies the 6-digit SMS code against the ConfirmationResult,
 * resolves the AuthUser, optionally updates displayName, and syncs Sendbird.
 */
export async function verifySMSCode(
    confirmationResult: ConfirmationResult,
    code: string,
    displayName?: string
): Promise<ServiceResponse<AuthUser>> {
    if (!isFirebaseAvailable() || !auth) {
        return ssrErrorResponse()
    }

    try {
        const cleanCode = code.trim().replace(/\D/g, '')
        if (cleanCode.length !== 6) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'AUTH_INVALID_CODE',
                    message: 'El código de verificación debe contener 6 dígitos.',
                },
            }
        }

        const result = await confirmationResult.confirm(cleanCode)

        if (displayName && result.user) {
            try {
                await updateProfile(result.user, { displayName })
            } catch (profileErr) {
                console.warn('[authService] Error updating displayName on phone user:', profileErr)
            }
        }

        const authUser = toAuthUser(result.user)

        // Fire and forget Sendbird sync
        syncSendbirdUser(
            authUser.uid,
            authUser.displayName || authUser.phoneNumber || 'Usuario',
            authUser.photoURL || undefined
        ).catch(console.error)

        return {
            success: true,
            data: authUser,
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapPhoneAuthErrorCode(firebaseError.code),
                message: mapPhoneAuthErrorMessage(firebaseError.code, firebaseError.message),
            },
        }
    }
}

function mapProviderErrorCode(code?: string): ServiceErrorCode {
    switch (code) {
        case 'auth/credential-already-in-use':
        case 'auth/email-already-in-use':
        case 'auth/account-exists-with-different-credential':
            return 'AUTH_PROVIDER_ALREADY_LINKED'
        case 'auth/no-such-provider':
            return 'AUTH_UNLINK_FAILED'
        default:
            return 'INTERNAL_ERROR'
    }
}

function mapProviderErrorMessage(code?: string, defaultMsg?: string): string {
    switch (code) {
        case 'auth/credential-already-in-use':
        case 'auth/email-already-in-use':
        case 'auth/account-exists-with-different-credential':
            return 'Esta cuenta o número ya está vinculado a otro usuario en Dezzpo.'
        case 'auth/no-such-provider':
            return 'El método de acceso no se encuentra vinculado a tu cuenta.'
        default:
            return defaultMsg || 'Ocurrió un error al procesar el método de acceso.'
    }
}

/**
 * Returns all active authentication providers linked to the current user.
 */
export function getLinkedProviders(): LinkedAuthProvider[] {
    if (!isFirebaseAvailable() || !auth?.currentUser) {
        return []
    }

    return auth.currentUser.providerData.map((p) => ({
        providerId: p.providerId,
        displayName: p.displayName,
        email: p.email,
        phoneNumber: p.phoneNumber,
        photoURL: p.photoURL,
    }))
}

/**
 * Links Google Account to the currently authenticated user session.
 */
export async function linkGoogleProvider(): Promise<ServiceResponse<AuthUser>> {
    if (!isFirebaseAvailable() || !auth?.currentUser) {
        return ssrErrorResponse()
    }

    try {
        const provider = getGoogleProvider()
        const result = await linkWithPopup(auth.currentUser, provider)
        const authUser = toAuthUser(result.user)

        return {
            success: true,
            data: authUser,
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapProviderErrorCode(firebaseError.code),
                message: mapProviderErrorMessage(firebaseError.code, firebaseError.message),
            },
        }
    }
}

/**
 * Links a verified phone number (via SMS OTP code) to the currently authenticated user.
 */
export async function linkPhoneProvider(
    confirmationResult: ConfirmationResult,
    code: string
): Promise<ServiceResponse<AuthUser>> {
    const cleanCode = code.trim().replace(/\D/g, '')
    if (cleanCode.length !== 6) {
        return {
            success: false,
            data: null,
            error: {
                code: 'AUTH_INVALID_CODE',
                message: 'El código de verificación debe contener 6 dígitos.',
            },
        }
    }

    if (!isFirebaseAvailable() || !auth?.currentUser) {
        return ssrErrorResponse()
    }

    try {
        const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, cleanCode)
        const result = await linkWithCredential(auth.currentUser, credential)
        const authUser = toAuthUser(result.user)

        return {
            success: true,
            data: authUser,
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapProviderErrorCode(firebaseError.code),
                message: mapProviderErrorMessage(firebaseError.code, firebaseError.message),
            },
        }
    }
}

/**
 * Unlinks an authentication provider from the current user.
 * Blocks unlinking if only one provider remains to prevent locking the user out.
 */
export async function unlinkProvider(providerId: string): Promise<ServiceResponse<AuthUser>> {
    if (!isFirebaseAvailable() || !auth?.currentUser) {
        return ssrErrorResponse()
    }

    try {
        const providers = auth.currentUser.providerData
        if (providers.length <= 1) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'AUTH_CANNOT_UNLINK_LAST_PROVIDER',
                    message: 'No puedes desvincular tu único método de acceso. Agrega otro primero para proteger tu cuenta.',
                },
            }
        }

        const result = await unlink(auth.currentUser, providerId)
        const authUser = toAuthUser(result)

        return {
            success: true,
            data: authUser,
            error: null,
        }
    } catch (error) {
        const firebaseError = error as { code?: string; message?: string }
        return {
            success: false,
            data: null,
            error: {
                code: mapProviderErrorCode(firebaseError.code),
                message: mapProviderErrorMessage(firebaseError.code, firebaseError.message),
            },
        }
    }
}

