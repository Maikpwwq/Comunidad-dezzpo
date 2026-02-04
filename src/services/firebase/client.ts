/**
 * Firebase Client Configuration
 * 
 * SSR-safe initialization - Firebase is only initialized on the client side.
 * During SSR, exports are null and services should check before using.
 */
import { firebaseClientConfig } from './config'
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// Only initialize Firebase on the client side
const isClient = typeof window !== 'undefined'

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null
let firestore: Firestore | null = null
let storage: FirebaseStorage | null = null

if (isClient) {
    try {
        if (getApps().length < 1) {
            firebaseApp = initializeApp(firebaseClientConfig)
        } else {
            firebaseApp = getApps()[0]!
        }
        
        auth = getAuth(firebaseApp)
        firestore = getFirestore(firebaseApp)
        storage = getStorage(firebaseApp)
    } catch (error) {
        console.error('Firebase initialization error:', error)
    }
}

// Export with type assertions - services must check for null during SSR
export { firebaseApp, auth, firestore, storage }

/**
 * Helper to check if Firebase is available (client-side only)
 */
export function isFirebaseAvailable(): boolean {
    return isClient && firebaseApp !== null
}
