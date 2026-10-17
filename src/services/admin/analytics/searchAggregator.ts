/**
 * Idempotent Search & Funnel Events Aggregator (`searchAggregator.ts`)
 *
 * Implements:
 * - Incremental batch processing of funnel_events (`search_services` and `view_profile`)
 * - Watermark-based progress tracking (`analytics_metadata/search_services_watermark`)
 * - Invariant I6: Re-processing identical events produces idempotent daily summaries
 * - Partitioning into daily documents (`daily_search_aggregates/{YYYY-MM-DD}`) in America/Bogota time
 * - Safe dry-run support
 * - Runs only on server via Firebase Admin SDK
 */

import { getColombiaDateString } from './colombiaDate'
import { SIN_DATO_KEY, normalizeSearchCatalogText } from './searchMetricsDomain'

export const DAILY_AGGREGATES_COLLECTION = 'daily_search_aggregates' as const
export const ANALYTICS_METADATA_COLLECTION = 'analytics_metadata' as const
export const WATERMARK_DOC_ID = 'search_services_watermark' as const

export interface DailySearchAggregateDoc {
    date: string // YYYY-MM-DD
    totalSearches: number
    totalProfileViews: number
    services: Record<string, number>
    zones: Record<string, number>
    merchants: Record<string, number>
    merchantNames: Record<string, string>
    lastProcessedTimestamp: string
    updatedAt: string
}

export interface SearchWatermarkDoc {
    lastProcessedTimestamp: string
    lastProcessedId: string
    processedSearchEvents: number
    processedProfileViewEvents: number
    lastRunAt: string
}

export interface AggregationResult {
    processedEvents: number
    searchEventsCount: number
    profileViewEventsCount: number
    daysUpdated: string[]
    newWatermark: SearchWatermarkDoc
    isDryRun: boolean
}

export interface RawFunnelEventDoc {
    id: string
    eventName: string
    timestamp?: string | undefined
    params?: Record<string, unknown> | undefined
    userAgent?: string | undefined
}

/**
 * Pure function to aggregate a list of raw funnel events into daily bucket changes.
 */
export function computeDailyBucketUpdates(
    events: readonly RawFunnelEventDoc[],
): Map<string, {
    searchesCount: number
    profileViewsCount: number
    services: Map<string, number>
    zones: Map<string, number>
    merchants: Map<string, number>
    merchantNames: Map<string, string>
    maxTimestamp: string
}> {
    const buckets = new Map<string, {
        searchesCount: number
        profileViewsCount: number
        services: Map<string, number>
        zones: Map<string, number>
        merchants: Map<string, number>
        merchantNames: Map<string, string>
        maxTimestamp: string
    }>()

    for (let i = 0; i < events.length; i++) {
        const ev = events[i]!
        const ts = ev.timestamp || (typeof ev.params?.timestamp === 'string' ? ev.params.timestamp : '')
        if (!ts) continue

        const dayKey = getColombiaDateString(ts)
        let bucket = buckets.get(dayKey)
        if (!bucket) {
            bucket = {
                searchesCount: 0,
                profileViewsCount: 0,
                services: new Map(),
                zones: new Map(),
                merchants: new Map(),
                merchantNames: new Map(),
                maxTimestamp: ts,
            }
            buckets.set(dayKey, bucket)
        }

        if (ts > bucket.maxTimestamp) {
            bucket.maxTimestamp = ts
        }

        const params = ev.params || {}

        if (ev.eventName === 'search_services') {
            bucket.searchesCount++

            // 1. Service Category
            const rawService = typeof params.service === 'string' ? params.service.trim() : ''
            const serviceKey = rawService ? normalizeSearchCatalogText(rawService) : SIN_DATO_KEY
            bucket.services.set(serviceKey, (bucket.services.get(serviceKey) || 0) + 1)

            // 2. Zone
            const rawZone = typeof params.zone === 'string' ? params.zone.trim() : ''
            const zoneKey = rawZone ? normalizeSearchCatalogText(rawZone) : SIN_DATO_KEY
            bucket.zones.set(zoneKey, (bucket.zones.get(zoneKey) || 0) + 1)
        } else if (ev.eventName === 'view_profile') {
            bucket.profileViewsCount++

            // 3. Merchant UID
            const merchantId = typeof params.comerciante_id === 'string' && params.comerciante_id.trim()
                ? params.comerciante_id.trim()
                : SIN_DATO_KEY

            bucket.merchants.set(merchantId, (bucket.merchants.get(merchantId) || 0) + 1)

            // Cache merchant name if available
            if (typeof params.comerciante_name === 'string' && params.comerciante_name.trim() && merchantId !== SIN_DATO_KEY) {
                bucket.merchantNames.set(merchantId, params.comerciante_name.trim())
            }
        }
    }

    return buckets
}

/**
 * Runs the aggregator against Firestore using Firebase Admin SDK.
 */
export async function runSearchAggregator(
    db: any,
    options: {
        batchSize?: number
        dryRun?: boolean
        forceFromStart?: boolean
    } = {},
): Promise<AggregationResult> {
    const batchSize = options.batchSize || 500
    const isDryRun = !!options.dryRun

    // 1. Read existing watermark
    const watermarkRef = db.collection(ANALYTICS_METADATA_COLLECTION).doc(WATERMARK_DOC_ID)
    const watermarkSnap = await watermarkRef.get()

    let lastTimestamp = '1970-01-01T00:00:00.000Z'
    let lastId = ''
    let totalSearchesProcessed = 0
    let totalViewsProcessed = 0

    if (watermarkSnap.exists && !options.forceFromStart) {
        const data = watermarkSnap.data() as SearchWatermarkDoc
        lastTimestamp = data.lastProcessedTimestamp || lastTimestamp
        lastId = data.lastProcessedId || ''
        totalSearchesProcessed = data.processedSearchEvents || 0
        totalViewsProcessed = data.processedProfileViewEvents || 0
    }

    // 2. Fetch events in chronological order since last watermark
    const funnelCol = db.collection('funnel_events')
    const querySnap = await funnelCol
        .where('timestamp', '>', lastTimestamp)
        .orderBy('timestamp', 'asc')
        .limit(batchSize)
        .get()

    if (querySnap.empty) {
        return {
            processedEvents: 0,
            searchEventsCount: 0,
            profileViewEventsCount: 0,
            daysUpdated: [],
            newWatermark: {
                lastProcessedTimestamp: lastTimestamp,
                lastProcessedId: lastId,
                processedSearchEvents: totalSearchesProcessed,
                processedProfileViewEvents: totalViewsProcessed,
                lastRunAt: new Date().toISOString(),
            },
            isDryRun,
        }
    }

    const eventsToProcess: RawFunnelEventDoc[] = []
    let searchCount = 0
    let viewCount = 0

    querySnap.forEach((doc: any) => {
        const data = doc.data()
        if (data.eventName === 'search_services' || data.eventName === 'view_profile') {
            const eventTs = data.timestamp || (typeof data.params?.timestamp === 'string' ? data.params.timestamp : '')
            const eventUa = data.userAgent || (typeof data.params?.userAgent === 'string' ? data.params.userAgent : '')
            eventsToProcess.push({
                id: doc.id,
                eventName: data.eventName,
                timestamp: eventTs,
                params: data.params,
                userAgent: eventUa,
            })
            if (data.eventName === 'search_services') searchCount++
            if (data.eventName === 'view_profile') viewCount++
        }
    })

    if (eventsToProcess.length === 0) {
        // If query returned other events, advance timestamp to the last doc in query
        const lastDoc = querySnap.docs[querySnap.docs.length - 1]
        const lastDocData = lastDoc.data()
        const advancedTimestamp = lastDocData.timestamp || lastDocData.params?.timestamp || lastTimestamp

        if (!isDryRun) {
            await watermarkRef.set({
                lastProcessedTimestamp: advancedTimestamp,
                lastProcessedId: lastDoc.id,
                processedSearchEvents: totalSearchesProcessed,
                processedProfileViewEvents: totalViewsProcessed,
                lastRunAt: new Date().toISOString(),
            }, { merge: true })
        }

        return {
            processedEvents: 0,
            searchEventsCount: 0,
            profileViewEventsCount: 0,
            daysUpdated: [],
            newWatermark: {
                lastProcessedTimestamp: advancedTimestamp,
                lastProcessedId: lastDoc.id,
                processedSearchEvents: totalSearchesProcessed,
                processedProfileViewEvents: totalViewsProcessed,
                lastRunAt: new Date().toISOString(),
            },
            isDryRun,
        }
    }

    // 3. Compute bucket updates
    const bucketUpdates = computeDailyBucketUpdates(eventsToProcess)
    const daysUpdated: string[] = Array.from(bucketUpdates.keys())

    const lastProcessedEvent = eventsToProcess[eventsToProcess.length - 1]!
    const newLastTimestamp = lastProcessedEvent.timestamp || lastTimestamp
    const newLastId = lastProcessedEvent.id

    const newWatermark: SearchWatermarkDoc = {
        lastProcessedTimestamp: newLastTimestamp,
        lastProcessedId: newLastId,
        processedSearchEvents: totalSearchesProcessed + searchCount,
        processedProfileViewEvents: totalViewsProcessed + viewCount,
        lastRunAt: new Date().toISOString(),
    }

    // 4. Commit updates unless dryRun
    if (!isDryRun) {
        const batch = db.batch()

        for (const [dateStr, update] of bucketUpdates.entries()) {
            const dayDocRef = db.collection(DAILY_AGGREGATES_COLLECTION).doc(dateStr)
            const dayDocSnap = await dayDocRef.get()

            const existingData: DailySearchAggregateDoc = dayDocSnap.exists
                ? dayDocSnap.data()
                : {
                    date: dateStr,
                    totalSearches: 0,
                    totalProfileViews: 0,
                    services: {},
                    zones: {},
                    merchants: {},
                    merchantNames: {},
                    lastProcessedTimestamp: '',
                    updatedAt: '',
                }

            // Merge services
            const mergedServices = { ...existingData.services }
            for (const [sKey, count] of update.services.entries()) {
                mergedServices[sKey] = (mergedServices[sKey] || 0) + count
            }

            // Merge zones
            const mergedZones = { ...existingData.zones }
            for (const [zKey, count] of update.zones.entries()) {
                mergedZones[zKey] = (mergedZones[zKey] || 0) + count
            }

            // Merge merchants
            const mergedMerchants = { ...existingData.merchants }
            for (const [mKey, count] of update.merchants.entries()) {
                mergedMerchants[mKey] = (mergedMerchants[mKey] || 0) + count
            }

            // Merge merchant names
            const mergedMerchantNames = { ...existingData.merchantNames }
            for (const [mKey, name] of update.merchantNames.entries()) {
                mergedMerchantNames[mKey] = name
            }

            const updatedDoc: DailySearchAggregateDoc = {
                date: dateStr,
                totalSearches: existingData.totalSearches + update.searchesCount,
                totalProfileViews: existingData.totalProfileViews + update.profileViewsCount,
                services: mergedServices,
                zones: mergedZones,
                merchants: mergedMerchants,
                merchantNames: mergedMerchantNames,
                lastProcessedTimestamp: update.maxTimestamp > existingData.lastProcessedTimestamp
                    ? update.maxTimestamp
                    : existingData.lastProcessedTimestamp,
                updatedAt: new Date().toISOString(),
            }

            batch.set(dayDocRef, updatedDoc, { merge: true })
        }

        // Commit watermark update
        batch.set(watermarkRef, newWatermark, { merge: true })

        await batch.commit()
    }

    return {
        processedEvents: eventsToProcess.length,
        searchEventsCount: searchCount,
        profileViewEventsCount: viewCount,
        daysUpdated,
        newWatermark,
        isDryRun,
    }
}
