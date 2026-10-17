/**
 * Integration Test for Search Aggregator & Analytics Processing
 *
 * Verifies:
 * - Incremental processing of search_services and view_profile events
 * - Accurate date bucketing in America/Bogota (UTC-5)
 * - Invariant I6: Idempotent execution (re-running does not corrupt or duplicate counts)
 * - Safe dry-run behavior
 * - Conciliation between daily aggregated totals and raw event counts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
    computeDailyBucketUpdates,
    runSearchAggregator,
    DAILY_AGGREGATES_COLLECTION,
    ANALYTICS_METADATA_COLLECTION,
    WATERMARK_DOC_ID,
    type RawFunnelEventDoc,
} from '@/services/admin/analytics/searchAggregator'
import { SIN_DATO_KEY } from '@/services/admin/analytics/searchMetricsDomain'

describe('Search Aggregator — Integration Tests', () => {
    describe('computeDailyBucketUpdates (Pure Bucket Math)', () => {
        it('accurately partitions search_services and view_profile into America/Bogota day buckets', () => {
            const events: RawFunnelEventDoc[] = [
                // 2026-10-15T02:00:00Z -> 2026-10-14 21:00 in America/Bogota
                {
                    id: 'ev-1',
                    eventName: 'search_services',
                    timestamp: '2026-10-15T02:00:00.000Z',
                    params: { service: 'Plomería', zone: 'Suba' },
                },
                // 2026-10-15T12:00:00Z -> 2026-10-15 07:00 in America/Bogota
                {
                    id: 'ev-2',
                    eventName: 'search_services',
                    timestamp: '2026-10-15T12:00:00.000Z',
                    params: { service: 'Plomería', zone: 'Chapinero' },
                },
                // 2026-10-15T18:00:00Z -> 2026-10-15 13:00 in America/Bogota
                {
                    id: 'ev-3',
                    eventName: 'view_profile',
                    timestamp: '2026-10-15T18:00:00.000Z',
                    params: {
                        comerciante_id: 'merchant-123',
                        comerciante_name: 'Cubiertec',
                    },
                },
                // Event with missing service and zone -> maps to SIN_DATO_KEY
                {
                    id: 'ev-4',
                    eventName: 'search_services',
                    timestamp: '2026-10-15T20:00:00.000Z',
                    params: {},
                },
            ]

            const buckets = computeDailyBucketUpdates(events)

            // Bucket for 2026-10-14
            const b14 = buckets.get('2026-10-14')
            expect(b14).toBeDefined()
            expect(b14!.searchesCount).toBe(1)
            expect(b14!.profileViewsCount).toBe(0)
            expect(b14!.services.get('plomeria')).toBe(1)
            expect(b14!.zones.get('suba')).toBe(1)

            // Bucket for 2026-10-15
            const b15 = buckets.get('2026-10-15')
            expect(b15).toBeDefined()
            expect(b15!.searchesCount).toBe(2) // ev-2 and ev-4
            expect(b15!.profileViewsCount).toBe(1) // ev-3
            expect(b15!.services.get('plomeria')).toBe(1)
            expect(b15!.services.get(SIN_DATO_KEY)).toBe(1)
            expect(b15!.zones.get('chapinero')).toBe(1)
            expect(b15!.zones.get(SIN_DATO_KEY)).toBe(1)
            expect(b15!.merchants.get('merchant-123')).toBe(1)
            expect(b15!.merchantNames.get('merchant-123')).toBe('Cubiertec')
        })

        it('gracefully skips events without timestamp', () => {
            const events: RawFunnelEventDoc[] = [
                { id: 'ev-no-time', eventName: 'search_services' },
            ]
            const buckets = computeDailyBucketUpdates(events)
            expect(buckets.size).toBe(0)
        })
    })

    describe('runSearchAggregator (Firestore Simulation)', () => {
        let fakeStore: Record<string, Record<string, any>>
        let mockDb: any

        beforeEach(() => {
            fakeStore = {
                [ANALYTICS_METADATA_COLLECTION]: {},
                [DAILY_AGGREGATES_COLLECTION]: {},
                funnel_events: {},
            }

            mockDb = {
                collection: (colName: string) => ({
                    doc: (id: string) => ({
                        get: async () => ({
                            exists: !!fakeStore[colName]?.[id],
                            data: () => fakeStore[colName]?.[id] || null,
                        }),
                        set: async (data: any, options?: { merge?: boolean }) => {
                            if (!fakeStore[colName]) fakeStore[colName] = {}
                            if (options?.merge && fakeStore[colName][id]) {
                                fakeStore[colName][id] = { ...fakeStore[colName][id], ...data }
                            } else {
                                fakeStore[colName][id] = data
                            }
                        },
                    }),
                    where: (field: string, op: string, val: any) => ({
                        orderBy: (_orderField: string, _dir: string) => ({
                            limit: (_limitVal: number) => ({
                                get: async () => {
                                    const allDocs = Object.entries(fakeStore[colName] || {})
                                    const filtered = allDocs
                                        .filter(([_, docData]) => {
                                            if (field === 'timestamp' && op === '>') {
                                                return (docData.timestamp || '') > val
                                            }
                                            return true
                                        })
                                        .sort((a, b) => (a[1].timestamp || '').localeCompare(b[1].timestamp || ''))
                                        .slice(0, _limitVal)

                                    return {
                                        empty: filtered.length === 0,
                                        docs: filtered.map(([id, docData]) => ({
                                            id,
                                            data: () => docData,
                                        })),
                                        forEach: (cb: any) => {
                                            filtered.forEach(([id, docData]) => cb({ id, data: () => docData }))
                                        },
                                    }
                                },
                            }),
                        }),
                    }),
                }),
                batch: () => {
                    const ops: Array<() => Promise<void>> = []
                    return {
                        set: (docRef: any, data: any, options?: any) => {
                            ops.push(async () => {
                                await docRef.set(data, options)
                            })
                        },
                        commit: async () => {
                            for (const op of ops) await op()
                        },
                    }
                },
            }
        })

        it('returns zero processed events when funnel_events is empty', async () => {
            const res = await runSearchAggregator(mockDb)
            expect(res.processedEvents).toBe(0)
            expect(res.daysUpdated).toHaveLength(0)
        })

        it('processes search events, advances watermark and writes daily aggregate document', async () => {
            // Seed 2 funnel events
            fakeStore['funnel_events']!['doc-1'] = {
                eventName: 'search_services',
                timestamp: '2026-10-15T15:00:00.000Z',
                params: { service: 'Plomería', zone: 'Suba' },
            }
            fakeStore['funnel_events']!['doc-2'] = {
                eventName: 'search_services',
                timestamp: '2026-10-15T16:00:00.000Z',
                params: { service: 'Pintura', zone: 'Suba' },
            }

            const res = await runSearchAggregator(mockDb)
            expect(res.processedEvents).toBe(2)
            expect(res.searchEventsCount).toBe(2)
            expect(res.daysUpdated).toEqual(['2026-10-15'])

            // Verify daily aggregate document was written
            const dayDoc = fakeStore[DAILY_AGGREGATES_COLLECTION]!['2026-10-15']
            expect(dayDoc).toBeDefined()
            expect(dayDoc.totalSearches).toBe(2)
            expect(dayDoc.services['plomeria']).toBe(1)
            expect(dayDoc.services['pintura']).toBe(1)
            expect(dayDoc.zones['suba']).toBe(2)

            // Verify watermark was updated
            const watermark = fakeStore[ANALYTICS_METADATA_COLLECTION]![WATERMARK_DOC_ID]
            expect(watermark).toBeDefined()
            expect(watermark.lastProcessedId).toBe('doc-2')
            expect(watermark.lastProcessedTimestamp).toBe('2026-10-15T16:00:00.000Z')
            expect(watermark.processedSearchEvents).toBe(2)

            // Second execution without new events does not advance or duplicate (Invariant I6)
            const secondRes = await runSearchAggregator(mockDb)
            expect(secondRes.processedEvents).toBe(0)
            expect(secondRes.daysUpdated).toHaveLength(0)
            expect(fakeStore[DAILY_AGGREGATES_COLLECTION]!['2026-10-15'].totalSearches).toBe(2)
        })

        it('respects dryRun option and leaves Firestore untouched', async () => {
            fakeStore['funnel_events']!['doc-dry'] = {
                eventName: 'search_services',
                timestamp: '2026-10-15T15:00:00.000Z',
                params: { service: 'DryRun Test' },
            }

            const res = await runSearchAggregator(mockDb, { dryRun: true })
            expect(res.processedEvents).toBe(1)
            expect(res.isDryRun).toBe(true)

            // Must NOT have written to daily aggregates or watermark
            expect(fakeStore[DAILY_AGGREGATES_COLLECTION]!['2026-10-15']).toBeUndefined()
            expect(fakeStore[ANALYTICS_METADATA_COLLECTION]![WATERMARK_DOC_ID]).toBeUndefined()
        })
    })
})
