/**
 * Set Admin Custom Claim
 *
 * One-time script to set the admin custom claim on a Firebase user.
 * Requires the Firebase Admin SDK and a service account key.
 *
 * Usage:
 *   pnpm dlx ts-node scripts/setAdminClaim.ts <UID>
 *
 * Prerequisites:
 *   1. serviceAccountKey.json must exist in the project root
 *   2. pnpm install firebase-admin (dev dependency)
 */

import * as admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const uid = process.argv[2]

if (!uid) {
    console.error('Usage: pnpm dlx ts-node scripts/setAdminClaim.ts <UID>')
    console.error('  <UID> = Firebase Auth user ID to grant admin access')
    process.exit(1)
}

// Initialize Admin SDK
const serviceAccountPath = resolve(__dirname, '..', 'serviceAccountKey.json')
try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
} catch (error) {
    console.error('Failed to load serviceAccountKey.json')
    console.error('Make sure the file exists at:', serviceAccountPath)
    process.exit(1)
}

async function setAdminClaim() {
    try {
        // Set admin claim
        await admin.auth().setCustomUserClaims(uid!, { admin: true })
        console.log(`✅ Admin claim set for user: ${uid}`)

        // Verify
        const user = await admin.auth().getUser(uid!)
        console.log('Custom claims:', user.customClaims)
        console.log('')
        console.log('⚠️  The user must sign out and sign back in for the claim to take effect.')
        console.log('   Alternatively, call user.getIdToken(true) to force a token refresh.')
    } catch (error) {
        console.error('Error setting admin claim:', error)
        process.exit(1)
    }
}

setAdminClaim()
