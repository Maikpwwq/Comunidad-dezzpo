import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getMessaging } from 'firebase-admin/messaging'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

let adminApp: App | null = null
let adminFirestore: any
let adminAuth: any
let adminMessaging: any

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

const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
const hasLocalServiceAccount = existsSync(serviceAccountPath)
const hasEnvCredentials = !!(privateKey && clientEmail)
const apps = getApps()

if (apps.length > 0) {
    adminApp = apps[0]!
    adminFirestore = getFirestore(adminApp)
    adminAuth = getAuth(adminApp)
    adminMessaging = getMessaging(adminApp)
} else if (hasEnvCredentials || hasLocalServiceAccount) {
    try {
        if (hasEnvCredentials) {
            adminApp = initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey: privateKey!.replace(/\\n/g, '\n'),
                }),
            })
        } else {
            const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
            adminApp = initializeApp({
                credential: cert(serviceAccount),
            })
        }
        adminFirestore = getFirestore(adminApp)
        adminAuth = getAuth(adminApp)
        adminMessaging = getMessaging(adminApp)
    } catch (err: any) {
        console.error('[Firebase Admin] Initialization failed:', err?.message || err)
    }
}

// Fallback to Mock SDK if not initialized to prevent prerender crashes on Vercel
if (!adminApp) {
    console.warn('[Firebase Admin] No credentials found. Initializing mock admin services to prevent build/prerender crashes.')
    
    class MockQuery {
        where() { return this }
        limit() { return this }
        async get() {
            return {
                size: 0,
                docs: [],
                forEach() {}
            }
        }
    }

    class MockCollection extends MockQuery {
        doc() { return new MockDoc() }
    }

    class MockDoc {
        async get() {
            return {
                exists: false,
                data() { return undefined },
                id: 'mock-id'
            }
        }
    }

    adminFirestore = {
        collection() {
            return new MockCollection()
        },
        batch() {
            return {
                update() {},
                commit() { return Promise.resolve() }
            }
        }
    } as any

    adminAuth = {
        async setCustomUserClaims() {
            console.warn('[Firebase Admin Mock] setCustomUserClaims called')
        },
        async getUser(uid: string) {
            console.warn('[Firebase Admin Mock] getUser called for uid:', uid)
            return {
                uid,
                customClaims: {}
            }
        }
    } as any

    adminMessaging = {
        async sendMulticast() {
            console.warn('[Firebase Admin Mock] sendMulticast called')
            return { successCount: 0, failureCount: 0, responses: [] }
        }
    } as any
}

export { adminApp, adminFirestore, adminAuth, adminMessaging }
