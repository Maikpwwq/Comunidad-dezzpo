/**
 * Types & Domain Contracts for Admin Search Analytics Pie Charts
 *
 * Conforms to:
 * - Requirements R1, R2, R3, R4, R5
 * - Strict Invariants I1 to I7
 * - TypeScript strict flags (exactOptionalPropertyTypes, noUncheckedIndexedAccess)
 */

export type SearchDimension = 'servicio' | 'zona' | 'comerciante'

export type PeriodId = '7d' | '30d' | '90d'

export type SliceKind = 'item' | 'otros' | 'sin_dato'

export interface GroupedItemSummary {
    readonly key: string
    readonly label: string
    readonly count: number
}

export interface GroupedDetail {
    readonly count: number
    readonly top: readonly GroupedItemSummary[]
}

export interface PieSlice {
    readonly key: string
    readonly label: string
    readonly count: number
    readonly fraction: number // [0, 1]
    readonly permille: number // integer [0, 1000]
    readonly rank: number | null
    readonly kind: SliceKind
    readonly grouped?: GroupedDetail | undefined
}

export interface PieDataset {
    readonly dimension: SearchDimension
    readonly total: number
    readonly distinct: number
    readonly slices: readonly PieSlice[]
}

export type DatasetResult =
    | { readonly status: 'ok'; readonly data: PieDataset }
    | { readonly status: 'error'; readonly code: 'no_disponible' }

export interface SearchBreakdown {
    readonly period: PeriodId
    readonly from: string // YYYY-MM-DD
    readonly to: string // YYYY-MM-DD
    readonly asOf: string // ISO-8601 string
    readonly datasets: Readonly<Record<SearchDimension, DatasetResult>>
}

export type BreakdownErrorCode = 'no_autorizado' | 'periodo_invalido' | 'no_disponible'

export type PieSelection =
    | { readonly kind: 'ninguna' }
    | { readonly kind: 'porcion'; readonly key: string; readonly fija: boolean }

export interface AnalyticsConfig {
    readonly defaultTopN: number
    readonly minPercentageThreshold: number
    readonly defaultPeriod: PeriodId
    readonly maxReadQuotaPerLoad: number
}

export const ANALYTICS_CONFIG: AnalyticsConfig = {
    defaultTopN: 7,
    minPercentageThreshold: 2.0, // 2%
    defaultPeriod: '30d',
    maxReadQuotaPerLoad: 150,
} as const

export const VALID_PERIODS: readonly PeriodId[] = ['7d', '30d', '90d'] as const

export const PERIOD_DAYS_MAP: Readonly<Record<PeriodId, number>> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
} as const
