import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Helper to slugify text
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

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
    console.log('Starting comerciante slug migration...')
    const snap = await db.collection('usersComerciantesCalificados').get()
    console.log(`Found ${snap.size} documents.`)

    const batch = db.batch()
    let count = 0
    const slugMap = new Set<string>()

    for (const doc of snap.docs) {
        const data = doc.data()
        const userName = data.userName || ''
        const userId = doc.id

        if (!userName) {
            console.warn(`Doc ${userId} has no userName, skipping.`)
            continue
        }

        let baseSlug = slugify(userName)
        if (!baseSlug) {
            baseSlug = 'comerciante'
        }

        let slug = baseSlug
        let suffix = 1
        // Ensure uniqueness
        while (slugMap.has(slug)) {
            slug = `${baseSlug}-${suffix}`
            suffix++
        }
        slugMap.add(slug)

        if (data.userSlug !== slug) {
            batch.update(doc.ref, { userSlug: slug })
            console.log(`Mapping: "${userName}" -> /comerciante/${slug}`)
            count++
        }
    }

    if (count > 0) {
        await batch.commit()
        console.log(`Successfully updated ${count} comerciante slugs.`)
    } else {
        console.log('All comerciantes already have correct slugs.')
    }
}

main().catch(console.error)
