/**
 * Types and Contracts for Coverage Zones Domain
 */

export type ZoneKind = 'municipio' | 'localidad' | 'macrozona' | 'sector' | 'area_metropolitana'

/**
 * Stable Zone identifier: either a curated catalog slug (e.g. 'suba', 'chia')
 * or a 5-digit official DANE DIVIPOLA municipality code (e.g. '05001' for Medellín).
 */
export type ZoneId = string

export interface ZoneOption {
    readonly id: ZoneId
    readonly kind: ZoneKind
    readonly label: string
    readonly parentLabel: string | null
    readonly curated: boolean
    readonly daneCode?: string | undefined
    readonly normalizedSearch: string
}

export interface ZoneMatch {
    readonly option: ZoneOption
    readonly selected: boolean
    /** Match quality score used for deterministic ranking (lower = better) */
    readonly matchRank: number
}

export type StoredZone =
    | { readonly status: 'reconocida'; readonly id: ZoneId; readonly option: ZoneOption }
    | { readonly status: 'otra_zona_sin_especificar' }
    | { readonly status: 'sin_reconocer'; readonly raw: string }

export interface ZoneSelectionState {
    readonly zoneIds: readonly ZoneId[]
    readonly hasLegacyOtherZone: boolean
    readonly unrecognized: readonly string[]
}

export interface SearchZonesOptions {
    readonly selectedIds: ReadonlySet<ZoneId>
    readonly limit?: number | undefined
    readonly baseDept?: string | undefined
}

