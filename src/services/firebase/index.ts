/**
 * Firebase Service Index
 */

export {
    signInWithEmail,
    signInWithGoogle,
    registerWithEmail,
    sendSMSCode,
    verifySMSCode,
    setupRecaptchaVerifier,
    cleanupRecaptchaVerifier,
    logout,
    subscribeToAuth,
    getCurrentUser,
    isAuthenticated,
    type ConfirmationResult,
} from './authService'

export {
    firebaseApp,
    auth,
    firestore,
    storage,
    isFirebaseAvailable,
} from './client'
