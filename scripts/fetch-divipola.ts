/**
 * DIVIPOLA Dataset Downloader & Normalizer
 *
 * Fetches official Colombian municipalities from DANE / Datos Abiertos (datos.gov.co)
 * Dataset resource ID: gdxc-w37w
 *
 * Normalizes names to Title Case, builds structured metadata with disambiguated labels,
 * and saves to src/assets/data/divipola-colombia.json.
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface DivipolaRawRecord {
    cod_dpto: string
    dpto: string
    cod_mpio: string
    nom_mpio: string
    tipo_municipio: string
    longitud?: string
    latitud?: string
}

export interface DivipolaMunicipality {
    code: string           // 5-digit official DIVIPOLA code (e.g. '05001')
    departamentoCode: string // 2-digit code (e.g. '05')
    municipio: string      // Title case (e.g. 'Medellín')
    departamento: string   // Title case (e.g. 'Antioquia')
    label: string          // 'Medellín, Antioquia'
    normalized: string     // lowercase accent-free for ultra-fast fuzzy filtering
}

function toTitleCase(str: string): string {
    if (!str) return ''
    return str
        .toLowerCase()
        .replace(/(?:^|\s|\/|-)([a-záéíóúñ])/g, (m) => m.toUpperCase())
        .replace(/\bd\.c\.?/gi, 'D.C.')
        .replace(/\s+/g, ' ')
        .trim()
}

function removeAccents(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

export async function fetchDivipolaDataset(): Promise<DivipolaMunicipality[]> {
    const endpoint = 'https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=2000&$order=nom_mpio%20ASC'
    console.log(`Fetching official DIVIPOLA dataset from ${endpoint}...`)

    const response = await fetch(endpoint)
    if (!response.ok) {
        throw new Error(`Failed to fetch DIVIPOLA: HTTP ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as DivipolaRawRecord[]
    console.log(`Received ${data.length} raw records from DANE API.`)

    const municipalities: DivipolaMunicipality[] = data.map((item) => {
        const municipio = toTitleCase(item.nom_mpio)
        const departamento = toTitleCase(item.dpto)
        const label = `${municipio}, ${departamento}`
        const normalized = `${removeAccents(municipio)} ${removeAccents(departamento)}`

        return {
            code: String(item.cod_mpio).padStart(5, '0'),
            departamentoCode: String(item.cod_dpto).padStart(2, '0'),
            municipio,
            departamento,
            label,
            normalized,
        }
    })

    // Sort alphabetically by label
    municipalities.sort((a, b) => a.label.localeCompare(b.label, 'es'))
    return municipalities
}

// When run via CLI
const isMain = process.argv[1] && process.argv[1].includes('fetch-divipola')
if (isMain) {
    fetchDivipolaDataset()
        .then((items) => {
            const outPath = resolve(process.cwd(), 'src/assets/data/divipola-colombia.json')
            writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf-8')
            console.log(`✓ Saved ${items.length} municipalities to ${outPath}`)
        })
        .catch((err) => {
            console.error('Error fetching DIVIPOLA dataset:', err)
            process.exit(1)
        })
}
