/**
 * Set Admin Custom Claim
 *
 * One-time script to set the admin custom claim on a Firebase user.
 * This sets a custom claim in Firebase AUTHENTICATION (not Firestore).
 * The useAdminGuard hook checks getIdTokenResult().claims.admin === true.
 *
 * Usage:
 *   node scripts/setAdminClaim.mjs <UID>
 *
 * Prerequisites:
 *   1. serviceAccountKey.json must exist in the project root
 *   2. pnpm add -D firebase-admin
 */

import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const uid = process.argv[2]

if (!uid) {
    console.error('Usage: node scripts/setAdminClaim.mjs <UID>')
    console.error('  <UID> = Firebase Auth user ID to grant admin access')
    process.exit(1)
}

// Initialize Admin SDK
const serviceAccountPath = resolve(__dirname, '..', 'serviceAccountKey.json')
try {
    const raw = readFileSync(serviceAccountPath, 'utf-8')
    const serviceAccount = JSON.parse(raw)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
} catch (error) {
    console.error('Failed to load serviceAccountKey.json')
    console.error('Make sure the file exists at:', serviceAccountPath)
    process.exit(1)
}

try {
    // Set admin claim in Firebase Auth (NOT Firestore)
    await admin.auth().setCustomUserClaims(uid, { admin: true })
    console.log(`✅ Admin claim set for user: ${uid}`)

    // Verify
    const user = await admin.auth().getUser(uid)
    console.log('Custom claims:', user.customClaims)
    console.log('')
    console.log('⚠️  The user must sign out and sign back in for the claim to take effect.')
    console.log('   Alternatively, call user.getIdToken(true) to force a token refresh.')
} catch (error) {
    console.error('Error setting admin claim:', error)
    process.exit(1)
}
