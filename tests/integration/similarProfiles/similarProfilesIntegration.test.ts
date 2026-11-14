/**
 * Integration Tests — Similar Profiles Service & Scaled Verification (Invariants I5 & I6)
 *
 * Verifies:
 * - Invariant I5: Bounded reads (<= 3 queries, <= 40 candidate docs) across 100, 1,000, and 10,000 profiles
 * - Invariant I6: Zero private data leakage (emails, phones, fcmTokens, IDs strictly stripped)
 * - ADR-02: Server-side cache hits result in 0 queries and 0 document reads
 * - R5: Sparse categories below minResults (2) return status 'vacio'
 * - R8: Suspended and missing profiles return identical 'vacio' response
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { generateSyntheticProfiles } from './syntheticProfileFactory'
import { MockFirestoreDb } from './mockFirestore'
import { getSimilarProfiles } from '@/../server/api/similarProfiles/similarProfilesService'
import { similarProfilesMemoryCache } from '@/../server/api/similarProfiles/cache'

describe('Fase 2: Similar Profiles Integration & Scaled Verification', () => {
    beforeEach(() => {
        similarProfilesMemoryCache.clear()
    })

    describe('Invariant I5: Scaled Read Bounds (100 vs 1,000 vs 10,000 profiles)', () => {
        it('verifies bounded reads with 100 profiles (docReads <= 41, queryCount <= 3)', async () => {
            const profiles100 = generateSyntheticProfiles(100)
            const db100 = new MockFirestoreDb(profiles100)

            const targetId = profiles100[0]!.id
            const { outcome, metrics } = await getSimilarProfiles(
                { profileId: targetId, zone: 'suba' },
                db100
            )

            expect(outcome.status).toBe('ok')
            expect(metrics.queryCount).toBeLessThanOrEqual(3)
            expect(metrics.documentsRead).toBeLessThanOrEqual(41) // 1 target + max 40 candidates
        })

        it('verifies bounded reads with 1,000 profiles (reads do not grow with directory size)', async () => {
            const profiles1000 = generateSyntheticProfiles(1000)
            const db1000 = new MockFirestoreDb(profiles1000)

            const targetId = profiles1000[0]!.id
            const { outcome, metrics } = await getSimilarProfiles(
                { profileId: targetId, zone: 'suba' },
                db1000
            )

            expect(outcome.status).toBe('ok')
            expect(metrics.queryCount).toBeLessThanOrEqual(3)
            expect(metrics.documentsRead).toBeLessThanOrEqual(41)
        })

        it('verifies bounded reads with 10,000 profiles (hard O(1) read ceiling maintained)', async () => {
            const profiles10000 = generateSyntheticProfiles(10000)
            const db10000 = new MockFirestoreDb(profiles10000)

            const targetId = profiles10000[0]!.id
            const { outcome, metrics } = await getSimilarProfiles(
                { profileId: targetId, zone: 'suba' },
                db10000
            )

            expect(outcome.status).toBe('ok')
            expect(metrics.queryCount).toBeLessThanOrEqual(3)
            expect(metrics.documentsRead).toBeLessThanOrEqual(41)
        })
    })

    describe('Invariant I6: Strict Public Allowlist (Zero Private Data Leakage)', () => {
        it('ensures no emails, phones, FCM tokens, identification or internal notes leak to output', async () => {
            const profiles = generateSyntheticProfiles(50)
            const db = new MockFirestoreDb(profiles)

            const targetId = profiles[0]!.id
            const { outcome } = await getSimilarProfiles({ profileId: targetId }, db)

            expect(outcome.status).toBe('ok')
            if (outcome.status === 'ok') {
                expect(outcome.data.items.length).toBeGreaterThanOrEqual(2)

                for (const item of outcome.data.items) {
                    const rawAny = item as unknown as Record<string, unknown>

                    // Strictly banned sensitive fields
                    expect(rawAny.userMail).toBeUndefined()
                    expect(rawAny.userPhone).toBeUndefined()
                    expect(rawAny.emails).toBeUndefined()
                    expect(rawAny.phones).toBeUndefined()
                    expect(rawAny.fcmTokens).toBeUndefined()
                    expect(rawAny.userIdentification).toBeUndefined()
                    expect(rawAny.internalNotes).toBeUndefined()
                    expect(rawAny.privateBillingAddress).toBeUndefined()

                    // Permitted public fields
                    expect(item.profileId).toBeDefined()
                    expect(item.displayName).toBeDefined()
                    expect(item.userCategories).toBeDefined()
                    expect(item.tier).toBeDefined()
                    expect(item.score).toBeDefined()
                    expect(item.reasons).toBeDefined()
                }
            }
        })
    })

    describe('ADR-02: Server-Side Cache Hits', () => {
        it('returns cached payload on second request with ZERO Firestore reads and queryCount = 0', async () => {
            const profiles = generateSyntheticProfiles(100)
            const db = new MockFirestoreDb(profiles)
            const targetId = profiles[0]!.id

            // Request 1: Cache Miss
            const run1 = await getSimilarProfiles({ profileId: targetId, zone: 'suba' }, db)
            expect(run1.outcome.status).toBe('ok')
            expect(run1.metrics.cacheHit).toBe(false)
            expect(run1.metrics.documentsRead).toBeGreaterThan(0)

            // Reset DB metrics to observe subsequent call
            db.resetMetrics()

            // Request 2: Cache Hit
            const run2 = await getSimilarProfiles({ profileId: targetId, zone: 'suba' }, db)
            expect(run2.outcome.status).toBe('ok')
            expect(run2.metrics.cacheHit).toBe(true)
            expect(run2.metrics.documentsRead).toBe(0)
            expect(run2.metrics.queryCount).toBe(0)
        })
    })

    describe('R5: Sparse Category Fallback & Honest Empty Handling', () => {
        it('returns status "vacio" when category has fewer than minResults (2) matching merchants', async () => {
            // Create a small catalog where only 1 merchant has category 'Ascensores'
            const soloAscensor = generateSyntheticProfiles(5).map((p, idx) => {
                if (idx === 0) return { ...p, id: 'target_ascensor', userCategories: ['Ascensores'] }
                return { ...p, userCategories: ['Pintura'] } // no other elevator techs
            })

            const db = new MockFirestoreDb(soloAscensor)
            const { outcome } = await getSimilarProfiles({ profileId: 'target_ascensor' }, db)

            // Because there is only 1 merchant with 'Ascensores' (the target itself) and zero other candidates,
            // the system gracefully yields 'vacio' without forcing irrelevant results (R5).
            expect(outcome.status).toBe('vacio')
        })
    })

    describe('R8: Anti-Enumeration for Suspended / Inexistent Profiles', () => {
        it('returns indistinguishable "vacio" response for non-existent and suspended profiles', async () => {
            const profiles = generateSyntheticProfiles(20)
            // Explicitly set one as suspended
            const suspendedDoc = { ...profiles[1]!, id: 'suspended_user', status: 'suspended' }
            profiles[1] = suspendedDoc

            const db = new MockFirestoreDb(profiles)

            // Non-existent
            const resNonExistent = await getSimilarProfiles({ profileId: 'inexistent_profile_id_xyz' }, db)
            expect(resNonExistent.outcome.status).toBe('vacio')

            // Suspended
            const resSuspended = await getSimilarProfiles({ profileId: 'suspended_user' }, db)
            expect(resSuspended.outcome.status).toBe('vacio')
        })
    })
})
