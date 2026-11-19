/**
 * Unified Zone Catalog
 *
 * Integrates the 52 curated zones with official Colombian DIVIPOLA municipalities,
 * with deterministic deduplication of curated municipalities (Bogotá, Soacha, Chía, etc.).
 */

import { zoneNames } from '@assets/data/ListadoZonas'
import {
    CURATED_MUNICIPALITY_DANE_CODES,
    DANE_CODE_TO_CURATED_SLUG,
    CURATED_ZONE_KINDS,
} from '@config/zones.config'
import type { ZoneId, ZoneOption, ZoneKind } from './types'
import type { DivipolaMunicipality } from '@services/matching/divipolaService'

/**
 * Normalizes text for search indexing (lowercase, accent-free, trimmed).
 */
export function normalizeZoneText(text: string | null | undefined): string {
    if (!text) return ''
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

/**
 * Builds static curated ZoneOption array from ListadoZonas.
 * Excludes 'otra-zona' because it is not a concrete zone.
 */
export function getCuratedZoneOptions(): ZoneOption[] {
    const options: ZoneOption[] = []

    for (const [slug, label] of Object.entries(zoneNames)) {
        if (slug === 'otra-zona') continue

        const kind: ZoneKind = CURATED_ZONE_KINDS[slug] || 'sector'
        const daneCode = CURATED_MUNICIPALITY_DANE_CODES[slug]

        let parentLabel: string | null = null
        if (kind === 'localidad' || slug.startsWith('bogota-')) {
            parentLabel = 'Bogotá D.C.'
        } else if (kind === 'municipio' && daneCode?.startsWith('25')) {
            parentLabel = 'Cundinamarca'
        } else if (kind === 'area_metropolitana') {
            parentLabel = 'Alrededores'
        }

        const normName = normalizeZoneText(label)
        const normParent = normalizeZoneText(parentLabel)
        const normalizedSearch = `${normName} ${normParent}`.trim()

        options.push({
            id: slug,
            kind,
            label,
            parentLabel,
            curated: true,
            daneCode,
            normalizedSearch,
        })
    }

    return options
}

/**
 * Cached map of curated options by slug and by DANE code.
 */
let curatedMapCache: Map<string, ZoneOption> | null = null

function getCuratedMap(): Map<string, ZoneOption> {
    if (!curatedMapCache) {
        curatedMapCache = new Map()
        const curated = getCuratedZoneOptions()
        for (const opt of curated) {
            curatedMapCache.set(opt.id, opt)
            if (opt.daneCode) {
                curatedMapCache.set(opt.daneCode, opt)
            }
        }
    }
    return curatedMapCache
}

/**
 * Converts a DivipolaMunicipality into a ZoneOption,
 * linking to curated slug if it represents a curated municipality.
 */
export function divipolaToZoneOption(mpio: DivipolaMunicipality): ZoneOption {
    const curatedSlug = DANE_CODE_TO_CURATED_SLUG[mpio.code]
    if (curatedSlug) {
        const curatedOpt = getCuratedMap().get(curatedSlug)
        if (curatedOpt) return curatedOpt
    }

    const normName = normalizeZoneText(mpio.municipio)
    const normDept = normalizeZoneText(mpio.departamento)
    const normalizedSearch = `${normName} ${normDept} ${mpio.code}`.trim()

    return {
        id: mpio.code,
        kind: 'municipio',
        label: mpio.municipio,
        parentLabel: mpio.departamento,
        curated: false,
        daneCode: mpio.code,
        normalizedSearch,
    }
}

/**
 * Builds the full unified catalog combining curated zones and all DIVIPOLA municipalities.
 * Deduplicates curated municipalities so each physical place exists exactly once.
 */
export function buildUnifiedCatalog(divipolaItems: readonly DivipolaMunicipality[] = []): ZoneOption[] {
    const curated = getCuratedZoneOptions()
    const unified: ZoneOption[] = [...curated]
    const seenCodes = new Set<string>(
        Object.values(CURATED_MUNICIPALITY_DANE_CODES)
    )

    for (const item of divipolaItems) {
        if (seenCodes.has(item.code)) {
            continue
        }
        seenCodes.add(item.code)
        unified.push(divipolaToZoneOption(item))
    }

    return unified
}

/**
 * Finds a ZoneOption by either curated slug or 5-digit DANE code.
 */
export function findZoneOption(
    id: ZoneId,
    divipolaItems?: readonly DivipolaMunicipality[]
): ZoneOption | null {
    if (!id) return null
    const cleanId = id.trim()

    // 1. Check curated map
    const curated = getCuratedMap().get(cleanId)
    if (curated) return curated

    // 2. Check if it's a DANE code in divipolaItems
    if (divipolaItems && divipolaItems.length > 0) {
        const found = divipolaItems.find((m) => m.code === cleanId)
        if (found) {
            return divipolaToZoneOption(found)
        }
    }

    return null
}

/**
 * Checks whether a merchant covers a target zone.
 * Invariant I6: A zone added via search (DANE code or slug) matches seamlessly.
 * Business Rule: 'otra-zona' alone without specification covers NO zone.
 */
export function merchantCoversZone(
    zonasCobertura: readonly string[] | undefined,
    targetZone: string,
    isCityWide = false
): boolean {
    if (isCityWide) return true
    if (!zonasCobertura || zonasCobertura.length === 0 || !targetZone) return false

    const normTarget = normalizeZoneText(targetZone)
    if (!normTarget || normTarget === 'otra-zona' || normTarget === 'otra zona') return false

    const targetDaneCode = CURATED_MUNICIPALITY_DANE_CODES[normTarget]
    const targetCuratedSlug = DANE_CODE_TO_CURATED_SLUG[normTarget]

    for (const z of zonasCobertura) {
        const normZ = normalizeZoneText(z)
        // Legacy 'otra-zona' does not equal any specific zone
        if (normZ === 'otra-zona' || normZ === 'otra zona') continue

        if (normZ === normTarget) return true
        if (targetDaneCode && normZ === targetDaneCode) return true
        if (targetCuratedSlug && normZ === targetCuratedSlug) return true
    }

    return false
}

