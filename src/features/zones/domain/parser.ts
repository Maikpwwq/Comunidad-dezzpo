/**
 * Zone Storage Parser, Serializer and Validation Helpers
 *
 * Implements total parsing (Invariants I1, I3, I8),
 * grandfathering logic, and es-CO pluralization.
 */

import { MAX_COVERAGE_ZONES } from '@config/zones.config'
import { findZoneOption, normalizeZoneText, getCuratedZoneOptions } from './catalog'
import type { ZoneId, ZoneSelectionState } from './types'
import type { DivipolaMunicipality } from '@services/matching/divipolaService'

/**
 * Pure and total parser for stored coverage zones data.
 * Guarantees zero data loss (Invariants I1 and I3):
 * - Curated slugs and DANE codes -> status: 'reconocida'
 * - 'otra-zona' -> status: 'otra_zona_sin_especificar'
 * - Anything else -> status: 'sin_reconocer' (preserved, never deleted)
 *
 * Never throws under any input (primitives, null, objects, malformed arrays).
 */
export function parseStoredZones(
    raw: unknown,
    divipolaItems?: readonly DivipolaMunicipality[]
): ZoneSelectionState {
    if (!raw) {
        return {
            zoneIds: [],
            hasLegacyOtherZone: false,
            unrecognized: [],
        }
    }

    const rawArray: unknown[] = Array.isArray(raw) ? raw : [raw]
    const recognizedSet = new Set<ZoneId>()
    const unrecognizedList: string[] = []
    let hasLegacyOtherZone = false

    for (const item of rawArray) {
        if (typeof item !== 'string' && typeof item !== 'number') {
            continue
        }

        const rawStr = String(item).trim()
        if (!rawStr) continue

        const normStr = normalizeZoneText(rawStr)

        // Check for legacy 'otra-zona'
        if (normStr === 'otra-zona' || normStr === 'otra zona') {
            hasLegacyOtherZone = true
            continue
        }

        // Check if it matches a known zone option (curated slug or DANE code)
        const matched = findZoneOption(rawStr, divipolaItems)
        if (matched) {
            recognizedSet.add(matched.id)
        } else {
            // Check if normalized match against curated options exists (e.g. "Bogotá" instead of "bogota")
            const curatedNormMatch = findCuratedByLabelOrNormalized(normStr)
            if (curatedNormMatch) {
                recognizedSet.add(curatedNormMatch.id)
            } else {
                // Invariant I1: Unknown tags are preserved, never silently dropped
                if (!unrecognizedList.includes(rawStr)) {
                    unrecognizedList.push(rawStr)
                }
            }
        }
    }

    return {
        zoneIds: Array.from(recognizedSet),
        hasLegacyOtherZone,
        unrecognized: unrecognizedList,
    }
}

/**
 * Helper to match legacy label strings like "Suba" or "Chía" to their slug.
 */
function findCuratedByLabelOrNormalized(normQuery: string) {
    const curated = getCuratedZoneOptions()
    return curated.find(
        (opt) =>
            normalizeZoneText(opt.id) === normQuery ||
            normalizeZoneText(opt.label) === normQuery
    )
}

/**
 * Checks if a new zone can be added based on the configured maximum cap.
 * Invariant I3: 'otra-zona' and unrecognized items do NOT count toward the cap.
 * Invariant I8: Already stored zones beyond cap are preserved (grandfathering).
 */
export function canAddZone(
    state: ZoneSelectionState,
    max: number = MAX_COVERAGE_ZONES
): boolean {
    return state.zoneIds.length < max
}

/**
 * Pluralizes coverage zone counter in Colombian Spanish.
 * Example:
 * 0 -> "0 zonas seleccionadas"
 * 1 -> "1 zona seleccionada"
 * 5 -> "5 zonas seleccionadas"
 */
export function formatZoneCount(count: number): string {
    if (count === 1) {
        return '1 zona seleccionada'
    }
    return `${count} zonas seleccionadas`
}

/**
 * Resolves human-friendly label and parent (e.g. department) for display.
 */
export function resolveZoneDisplay(
    id: ZoneId,
    divipolaItems?: readonly DivipolaMunicipality[]
): { label: string; parentLabel: string | null } {
    const opt = findZoneOption(id, divipolaItems)
    if (opt) {
        return {
            label: opt.label,
            parentLabel: opt.parentLabel,
        }
    }

    // Fallback for raw unrecognized strings
    return {
        label: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        parentLabel: null,
    }
}
