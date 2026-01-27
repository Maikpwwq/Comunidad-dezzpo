import { firebaseClientConfig } from './config'
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

let firebaseApp: FirebaseApp

// Instancia de Firebase
if (getApps().length < 1) {
    firebaseApp = initializeApp(firebaseClientConfig)
} else {
    firebaseApp = getApps()[0]!
}

const auth: Auth = getAuth(firebaseApp)
const firestore: Firestore = getFirestore(firebaseApp)
const storage: FirebaseStorage = getStorage(firebaseApp)

export { firebaseApp, auth, firestore, storage }
