import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

let adminApp: App

const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.VITE_APP_FIREBASE_PRIVATE_KEY
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.VITE_APP_FIREBASE_CLIENT_EMAIL
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_APP_FIREBASE_PROJECTID || 'app-comunidad-dezzpo'

// Clean up GOOGLE_APPLICATION_CREDENTIALS if it points to a non-existent file
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credsPath = resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS)
    if (!existsSync(credsPath)) {
        console.warn(`[Firebase Admin] Clearing invalid GOOGLE_APPLICATION_CREDENTIALS path: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)
        delete process.env.GOOGLE_APPLICATION_CREDENTIALS
    }
}

const apps = getApps()
if (apps.length === 0) {
    if (privateKey && clientEmail) {
        adminApp = initializeApp({
            credential: cert({
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
            adminApp = initializeApp({
                credential: cert(serviceAccount),
            })
        } catch {
            console.warn('Firebase Admin credentials not found. Initializing with default environment variables.')
            adminApp = initializeApp()
        }
    }
} else {
    adminApp = apps[0]!
}

const adminFirestore = getFirestore(adminApp)
const adminAuth = getAuth(adminApp)

export { adminApp, adminFirestore, adminAuth }
