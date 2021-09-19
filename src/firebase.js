import { initializeApp } from 'firebase/app'

// Firebase SDK para utilizar Analytics en caso de estar habilitado
import 'firebase/analytics'

require('dotenv').config()
// Productos de Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore';
import * as admin from 'firebase-admin'
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
// import serviceAccount from `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DBURL,
})

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DBURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGE,
    messagingSenderId: process.env.FIREBASE_MESSAGEID,
    appId: process.env.FIREBASE_APPID,
}

// Instancia de Firebase
const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, (user) => {
    // Check for user status
    if (user) {
        console.log(user)
        let displayName = user.displayName
        let email = user.email
        var emailVerified = user.emailVerified
        var uid = user.uid
    } else {
        // El Usuario no ha iniciado su sesion
        console.log('no hay un usuario registrado')
    }
})

// console.log(firebaseApp.database().ref().child('tienda'));
