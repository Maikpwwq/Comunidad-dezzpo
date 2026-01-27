import { firebaseClientConfig } from './firebaseConfig'
import { getApps, initializeApp } from 'firebase/app'
// import * as fb from 'firebase/compat/app'

// Productos de Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth' // , authStateReady
import { getFirestore } from 'firebase/firestore'
// import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
// import { getAnalytics } from 'firebase/analytics'

// import { sharingInformationService } from '#@/services/sharing-information'

let firebaseApp
// Instancia de Firebase
if (getApps().length < 1) {
    firebaseApp = initializeApp(firebaseClientConfig)
}
/*
if (typeof window !== 'undefined' && !fb.apps.length) {
    fb.initializeApp(firebaseClientConfig)
    fb.auth().setPersistence(fb.auth.Auth.Persistence.SESSION)
    // window.firebase = fb
}
const firebaseApp = fb.app()
const firebaseApp = !fb.apps.length
    ? fb.initializeApp(firebaseClientConfig)
    : fb.app()
*/
export { firebaseApp, auth, currentUser, firestore, storage }
// export { currentUser }

const auth = getAuth(firebaseApp)
const currentUser = auth?.currentUser
console.log(currentUser)

const firestore = getFirestore(firebaseApp)
// firestore.settings({ timestampsInSnapshots: true })

const storage = getStorage(firebaseApp)

// export const analytics = getAnalytics(firebaseApp)

// export const db = getDatabase(firebaseApp)

// console.log(db.ref().child('tienda'));
// let currentUser
onAuthStateChanged(auth, (user) => {
    // Check for user status
    if (user) {
        // sharingInformationService.setSubject({ authUser: user }) -> Removed
        // console.log('onAuthStateChanged', user)
        // let displayName = user.displayName
        // let email = user.email
        // var emailVerified = user.emailVerified
        // var uid = user.uid
    } else {
        // El Usuario no ha iniciado su sesion
        console.log('no hay un usuario registrado')
    }
})
