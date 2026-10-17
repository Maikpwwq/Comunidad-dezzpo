/**
 * Admin Search Analytics Endpoint (`server/api/admin/searches.ts`)
 *
 * GET /api/v1/admin/analytics/searches?period=7d|30d|90d
 *
 * Implements:
 * - Requirements R1, R2, R3, R5, R6, R7
 * - Hard bounded reads (≤ 90 document reads per load)
 * - Strict Admin authorization via authenticateRequest(c)
 * - Largest Remainder permille distribution and deterministic sorting
 * - Canonical resolution of Category, Zone, and Merchant names (0 N+1)
 */

import type { Context } from 'hono'
import { adminFirestore } from '@/services/firebase/admin'
import { authenticateRequest } from '../auth'
import {
    DAILY_AGGREGATES_COLLECTION,
    type DailySearchAggregateDoc,
} from '@/services/admin/analytics/searchAggregator'
import {
    getPeriodDateRange,
} from '@/services/admin/analytics/colombiaDate'
import {
    buildPieDataset,
    normalizeSearchCatalogText,
    SIN_DATO_KEY,
} from '@/services/admin/analytics/searchMetricsDomain'
import {
    VALID_PERIODS,
    type PeriodId,
    type SearchBreakdown,
} from '@/services/admin/analytics/types'
import { ListadoCategorias } from '@/assets/data/ListadoCategorias'
import { zoneNames } from '@/assets/data/ListadoZonas'

// Pre-indexed catalog lookup maps for O(1) canonical label recovery
const CATEGORY_LABEL_MAP = new Map<string, string>()
for (const cat of ListadoCategorias) {
    if (cat.label) {
        CATEGORY_LABEL_MAP.set(normalizeSearchCatalogText(cat.label), cat.label)
    }
}

const ZONE_LABEL_MAP = new Map<string, string>()
for (const [slug, label] of Object.entries(zoneNames)) {
    ZONE_LABEL_MAP.set(normalizeSearchCatalogText(slug), label)
    ZONE_LABEL_MAP.set(normalizeSearchCatalogText(label), label)
}

function resolveCategoryLabel(key: string): string {
    if (key === SIN_DATO_KEY) return 'Sin categoría indicada'
    const found = CATEGORY_LABEL_MAP.get(key)
    if (found) return found
    // Capitalize as fallback
    return key.charAt(0).toUpperCase() + key.slice(1)
}

function resolveZoneLabel(key: string): string {
    if (key === SIN_DATO_KEY) return 'Sin zona indicada'
    const found = ZONE_LABEL_MAP.get(key)
    if (found) return found
    return key.charAt(0).toUpperCase() + key.slice(1)
}

export async function adminSearchAnalyticsHandler(c: Context) {
    // 1. Strict Security Guard (R7)
    const user = await authenticateRequest(c)
    if (!user) {
        return c.json({ error: 'No autorizado. Inicia sesión como administrador.' }, 401)
    }
    if (!user.isAdmin) {
        return c.json({ error: 'Acceso denegado. Se requieren privilegios de administrador.' }, 403)
    }

    // 2. Validate Period Parameter
    const rawPeriod = c.req.query('period') || '30d'
    const period: PeriodId = VALID_PERIODS.includes(rawPeriod as PeriodId)
        ? (rawPeriod as PeriodId)
        : '30d'

    // 3. Compute Dates in America/Bogota time
    const { from, to, days } = getPeriodDateRange(period)

    if (!adminFirestore) {
        return c.json({ error: 'Servicio de base de datos no disponible.' }, 503)
    }

    try {
        // 4. Batch fetch daily aggregate documents (hard bound: ≤ 90 docs)
        const docRefs = days.map((dayStr) =>
            adminFirestore.collection(DAILY_AGGREGATES_COLLECTION).doc(dayStr),
        )

        const snapshots = docRefs.length > 0 ? await adminFirestore.getAll(...docRefs) : []

        // 5. Merge day buckets
        const mergedServices: Record<string, number> = {}
        const mergedZones: Record<string, number> = {}
        const mergedMerchants: Record<string, number> = {}
        const cachedMerchantNames = new Map<string, string>()

        for (const snap of snapshots) {
            if (!snap.exists) continue
            const data = snap.data() as DailySearchAggregateDoc

            // Services
            if (data.services) {
                for (const [k, count] of Object.entries(data.services)) {
                    mergedServices[k] = (mergedServices[k] || 0) + (count || 0)
                }
            }

            // Zones
            if (data.zones) {
                for (const [k, count] of Object.entries(data.zones)) {
                    mergedZones[k] = (mergedZones[k] || 0) + (count || 0)
                }
            }

            // Merchants
            if (data.merchants) {
                for (const [k, count] of Object.entries(data.merchants)) {
                    mergedMerchants[k] = (mergedMerchants[k] || 0) + (count || 0)
                }
            }

            // Cached merchant names
            if (data.merchantNames) {
                for (const [k, name] of Object.entries(data.merchantNames)) {
                    if (name && !cachedMerchantNames.has(k)) {
                        cachedMerchantNames.set(k, name)
                    }
                }
            }
        }

        // 6. Resolve Merchant Names for Top Candidates (Bounded batch read, zero N+1)
        // Sort merchant IDs by count descending to identify top 10
        const sortedMerchantKeys = Object.keys(mergedMerchants)
            .filter((k) => k !== SIN_DATO_KEY)
            .sort((a, b) => (mergedMerchants[b] || 0) - (mergedMerchants[a] || 0))
            .slice(0, 10)

        // Find keys that need live name resolution from usersComerciantesCalificados
        const merchantsToFetch = sortedMerchantKeys.filter((k) => !cachedMerchantNames.has(k))

        if (merchantsToFetch.length > 0) {
            try {
                const merchantRefs = merchantsToFetch.map((id) =>
                    adminFirestore.collection('usersComerciantesCalificados').doc(id),
                )
                const merchantSnaps = await adminFirestore.getAll(...merchantRefs)
                for (const mSnap of merchantSnaps) {
                    if (mSnap.exists) {
                        const mData = mSnap.data()
                        const liveName = mData.userName || mData.userRazonSocial || mData.userNombreComercial
                        if (liveName) {
                            cachedMerchantNames.set(mSnap.id, liveName.trim())
                        }
                    }
                }
            } catch (fetchErr) {
                console.warn('[Admin Search Analytics] Could not fetch live merchant names:', fetchErr)
            }
        }

        const resolveMerchantLabel = (key: string): string => {
            if (key === SIN_DATO_KEY) return 'Sin comerciante indicado'
            const name = cachedMerchantNames.get(key)
            if (name) return name
            return 'Perfil no disponible'
        }

        // 7. Build datasets with Largest Remainder distribution (Invariants I1 to I5)
        const servicioDataset = buildPieDataset('servicio', mergedServices, resolveCategoryLabel, {
            sinDatoLabel: 'Sin categoría indicada',
        })

        const zonaDataset = buildPieDataset('zona', mergedZones, resolveZoneLabel, {
            sinDatoLabel: 'Sin zona indicada',
        })

        const comercianteDataset = buildPieDataset('comerciante', mergedMerchants, resolveMerchantLabel, {
            sinDatoLabel: 'Sin comerciante indicado',
        })

        const response: SearchBreakdown = {
            period,
            from,
            to,
            asOf: new Date().toISOString(),
            datasets: {
                servicio: { status: 'ok', data: servicioDataset },
                zona: { status: 'ok', data: zonaDataset },
                comerciante: { status: 'ok', data: comercianteDataset },
            },
        }

        return c.json(response)
    } catch (err: any) {
        console.error('[Admin Search Analytics] Route error:', err?.message || err)
        return c.json({ error: 'Error al procesar métricas de búsqueda.' }, 500)
    }
}
