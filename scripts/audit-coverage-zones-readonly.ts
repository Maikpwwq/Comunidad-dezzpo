/**
 * Read-Only Audit of Coverage Zones in Firestore
 *
 * Safe, zero-write audit script:
 * - Aggregates counts only (NO personal data, NO user IDs, NO names/emails/phones)
 * - Computes:
 *   1. Total merchants analyzed
 *   2. Count of profiles with 0 coverage zones
 *   3. Count of profiles with coverage zones
 *   4. Count of profiles with 'otra-zona'
 *   5. Count of profiles with 'coberturaTodaLaCiudad: true'
 *   6. Count of profiles with 'isAvailableNow: true'
 *   7. Distribution of zone counts per profile
 *   8. Percentiles (p50, p90, p95, max)
 *   9. Frequency of raw zone tags outside the official 52-zone catalog
 *
 * Usage:
 *   npx tsx scripts/audit-coverage-zones-readonly.ts
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { zones as curatedZoneSlugs } from '../src/assets/data/ListadoZonas'

async function runReadOnlyAudit() {
    const serviceAccountPath = resolve(process.cwd(), 'serviceAccountKey.json')
    if (!existsSync(serviceAccountPath)) {
        console.error('serviceAccountKey.json not found in root. Please provide credentials to run audit.')
        process.exit(1)
    }

    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
    const app = initializeApp({
        credential: cert(serviceAccount),
    })
    const db = getFirestore(app)

    console.log('--- AUDITORÍA DE ZONAS DE COBERTURA (SOLO LECTURA) ---')
    console.log('Consultando colección usersComerciantesCalificados...')

    const snapshot = await db.collection('usersComerciantesCalificados').get()
    const totalMerchants = snapshot.size

    let withZeroZones = 0
    let withZones = 0
    let withLegacyOtherZone = 0
    let withCityWide = 0
    let withAvailableNow = 0

    const zoneCountDistribution: Record<string, number> = {
        '0 zonas': 0,
        '1-3 zonas': 0,
        '4-7 zonas': 0,
        '8-15 zonas': 0,
        '16-30 zonas': 0,
        '31+ zonas': 0,
    }

    const zoneCounts: number[] = []
    const unknownZoneTags: Record<string, number> = {}
    const curatedSet = new Set(curatedZoneSlugs)

    snapshot.forEach((doc) => {
        const data = doc.data()
        const rawZones = data.userZonasCobertura
        const isCityWide = data.coberturaTodaLaCiudad === true
        const isAvailableNow = data.isAvailableNow === true

        if (isCityWide) withCityWide++
        if (isAvailableNow) withAvailableNow++

        if (!Array.isArray(rawZones) || rawZones.length === 0) {
            withZeroZones++
            zoneCountDistribution['0 zonas'] = (zoneCountDistribution['0 zonas'] ?? 0) + 1
            zoneCounts.push(0)
            return
        }

        withZones++
        const count = rawZones.length
        zoneCounts.push(count)

        if (count >= 1 && count <= 3) {
            zoneCountDistribution['1-3 zonas'] = (zoneCountDistribution['1-3 zonas'] ?? 0) + 1
        } else if (count >= 4 && count <= 7) {
            zoneCountDistribution['4-7 zonas'] = (zoneCountDistribution['4-7 zonas'] ?? 0) + 1
        } else if (count >= 8 && count <= 15) {
            zoneCountDistribution['8-15 zonas'] = (zoneCountDistribution['8-15 zonas'] ?? 0) + 1
        } else if (count >= 16 && count <= 30) {
            zoneCountDistribution['16-30 zonas'] = (zoneCountDistribution['16-30 zonas'] ?? 0) + 1
        } else if (count >= 31) {
            zoneCountDistribution['31+ zonas'] = (zoneCountDistribution['31+ zonas'] ?? 0) + 1
        }

        let hasOtherZone = false
        for (const item of rawZones) {
            const strItem = String(item).trim()
            if (strItem === 'otra-zona' || strItem.toLowerCase() === 'otra zona') {
                hasOtherZone = true
            }
            if (!curatedSet.has(strItem)) {
                unknownZoneTags[strItem] = (unknownZoneTags[strItem] || 0) + 1
            }
        }
        if (hasOtherZone) withLegacyOtherZone++
    })

    zoneCounts.sort((a, b) => a - b)
    const p50 = zoneCounts[Math.floor(zoneCounts.length * 0.50)] ?? 0
    const p90 = zoneCounts[Math.floor(zoneCounts.length * 0.90)] ?? 0
    const p95 = zoneCounts[Math.floor(zoneCounts.length * 0.95)] ?? 0
    const max = zoneCounts[zoneCounts.length - 1] ?? 0

    console.log('\n--- RESULTADOS AGREGADOS (SIN PII NI DATOS PERSONALES) ---')
    console.log(`Total comerciantes: ${totalMerchants}`)
    console.log(`Con 0 zonas de cobertura: ${withZeroZones} (${((withZeroZones / (totalMerchants || 1)) * 100).toFixed(1)}%)`)
    console.log(`Con >= 1 zona de cobertura: ${withZones} (${((withZones / (totalMerchants || 1)) * 100).toFixed(1)}%)`)
    console.log(`Con 'otra-zona' guardada: ${withLegacyOtherZone} (${((withLegacyOtherZone / (totalMerchants || 1)) * 100).toFixed(1)}%)`)
    console.log(`Con 'coberturaTodaLaCiudad: true': ${withCityWide} (${((withCityWide / (totalMerchants || 1)) * 100).toFixed(1)}%)`)
    console.log(`Con 'isAvailableNow: true': ${withAvailableNow} (${((withAvailableNow / (totalMerchants || 1)) * 100).toFixed(1)}%)`)

    console.log('\n--- DISTRIBUCIÓN DE CANTIDAD DE ZONAS POR PERFIL ---')
    for (const [bucket, qty] of Object.entries(zoneCountDistribution)) {
        console.log(`  ${bucket}: ${qty} perfiles (${((qty / (totalMerchants || 1)) * 100).toFixed(1)}%)`)
    }

    console.log('\n--- PERCENTILES DE ZONAS POR PERFIL ---')
    console.log(`  p50 (mediana): ${p50} zonas`)
    console.log(`  p90: ${p90} zonas`)
    console.log(`  p95: ${p95} zonas`)
    console.log(`  Máximo: ${max} zonas`)

    const unknownEntries = Object.entries(unknownZoneTags)
    console.log(`\n--- ETIQUETAS FUERA DEL CATÁLOGO CURADO (${unknownEntries.length} distintas) ---`)
    if (unknownEntries.length === 0) {
        console.log('  Ninguna etiqueta fuera del catálogo encontrada.')
    } else {
        unknownEntries
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .forEach(([tag, qty]) => {
                console.log(`  "${tag}": ${qty} ocurrencias`)
            })
    }

    console.log('\n✓ Auditoría finalizada de forma segura en modo de solo lectura.')
}

runReadOnlyAudit().catch((err) => {
    console.error('Error durante la auditoría:', err)
    process.exit(1)
})

