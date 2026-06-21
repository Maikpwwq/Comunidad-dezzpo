import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Initialize Admin SDK
const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    })
} catch (error) {
    console.error('Failed to load serviceAccountKey.json', error)
    process.exit(1)
}

const db = admin.firestore()

async function main() {
    const snap = await db.collection('usersComerciantesCalificados').limit(2).get()
    console.log(`Found ${snap.size} comerciantes:`)
    snap.forEach(doc => {
        console.log(`ID: ${doc.id}`)
        console.log(JSON.stringify(doc.data(), null, 2))
        console.log('-----------------------------------')
    })
}

main().catch(console.error)
