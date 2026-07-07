import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Initialize Admin SDK
const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
let app
try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
    app = initializeApp({
        credential: cert(serviceAccount),
    })
} catch (error) {
    console.error('Failed to load serviceAccountKey.json', error)
    process.exit(1)
}

const db = getFirestore(app)

async function main() {
    const snap = await db.collection('usersComerciantesCalificados').limit(2).get()
    console.log(`Found ${snap.size} comerciantes:`)
    snap.forEach((doc: any) => {
        console.log(`ID: ${doc.id}`)
        console.log(JSON.stringify(doc.data(), null, 2))
        console.log('-----------------------------------')
    })
}

main().catch(console.error)
