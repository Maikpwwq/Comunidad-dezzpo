import * as firebaseAdmin from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
// const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// import serviceAccount from `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
import serviceAccount from '../../serviceAccountKey.json'

console.log(serviceAccount)
if (!firebaseAdmin.apps.length) {
    initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: 'https://app-comunidad-dezzpo.firebaseio.com',
    })
}

export default firebaseAdmin
