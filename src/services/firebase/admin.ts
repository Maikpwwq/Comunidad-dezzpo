import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

let adminApp: admin.app.App

const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.VITE_APP_FIREBASE_PRIVATE_KEY
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.VITE_APP_FIREBASE_CLIENT_EMAIL
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_APP_FIREBASE_PROJECTID || 'app-comunidad-dezzpo'

if (admin.apps.length === 0) {
    if (privateKey && clientEmail) {
        adminApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        })
    } else {
        // Try local serviceAccountKey.json
        try {
            const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
            const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
            adminApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            })
        } catch {
            console.warn('Firebase Admin credentials not found. Initializing with default environment variables.')
            adminApp = admin.initializeApp()
        }
    }
} else {
    adminApp = admin.apps[0]!
}

const adminFirestore = adminApp.firestore()
const adminAuth = adminApp.auth()

export { adminApp, adminFirestore, adminAuth }
