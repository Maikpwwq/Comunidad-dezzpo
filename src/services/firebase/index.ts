/**
 * Firebase Service Index
 */

export {
    signInWithEmail,
    signInWithGoogle,
    registerWithEmail,
    logout,
    subscribeToAuth,
    getCurrentUser,
    isAuthenticated,
} from './authService'

export {
    firebaseApp,
    auth,
    firestore,
    storage,
} from './client'
