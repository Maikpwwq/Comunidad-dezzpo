import { firebaseClientConfig } from './config'
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

let firebaseApp: FirebaseApp | undefined

// Instancia de Firebase
if (typeof window !== 'undefined') {
    if (getApps().length < 1) {
        try {
            firebaseApp = initializeApp(firebaseClientConfig)
        } catch (error) {
            console.error('Firebase initialization error:', error)
        }
    } else {
        firebaseApp = getApps()[0]!
    }
} else {
    // SSR / Build time stub to prevent crashes
    if (getApps().length < 1) {
         try {
            firebaseApp = initializeApp(firebaseClientConfig)
        } catch (error) {
             console.warn('Firebase init failed in SSR (expected if env missing):', error)
             // Create a dummy app or handle gracefully if possible, or just let it fail later if actually used
        }
    } else {
         firebaseApp = getApps()[0]!
    }
}

// Ensure exports are safe even if initialization failed or is partial
const auth: Auth = firebaseApp ? getAuth(firebaseApp) : {} as Auth
const firestore: Firestore = firebaseApp ? getFirestore(firebaseApp) : {} as Firestore
const storage: FirebaseStorage = firebaseApp ? getStorage(firebaseApp) : {} as FirebaseStorage

export { firebaseApp, auth, firestore, storage }
