import { describe, it, expect, beforeEach } from 'vitest'
import {
    checkUserRedesignQuota,
    analyzeRoomRedesign,
    MAX_DAILY_REDESIGNS,
} from '@/services/ai/aiRedesignService'

describe('AI Room Redesign Service (T-I8.2)', () => {
    beforeEach(() => {
        if (typeof localStorage !== 'undefined') {
            localStorage.clear()
        }
    })

    it('denies redesign request if user is not authenticated', async () => {
        const res = await analyzeRoomRedesign({})
        expect(res.success).toBe(false)
        expect(res.error?.code).toBe('FIRESTORE_PERMISSION_DENIED')
    })

    it('allows redesign for authenticated user within daily quota', async () => {
        const res = await analyzeRoomRedesign({
            userId: 'user-test-123',
            approxAreaM2: 25,
            preferredStyleSlug: 'nordico-calmo',
        })

        expect(res.success).toBe(true)
        expect(res.data).toBeDefined()
        expect(res.data?.recommendedStyle.slug).toBe('nordico-calmo')
        expect(res.data?.disclaimer).toContain('Ley 1480 de 2011')
        expect(res.data?.sourceMode).toBe('deterministic_plan_b')
    })

    it('tracks quota consumption and exhausts after MAX_DAILY_REDESIGNS', async () => {
        const userId = 'user-quota-test'

        // 3 allowed calls
        for (let i = 0; i < MAX_DAILY_REDESIGNS; i++) {
            const res = await analyzeRoomRedesign({ userId })
            expect(res.success).toBe(true)
        }

        const quota = checkUserRedesignQuota(userId)
        expect(quota.isAllowed).toBe(false)
        expect(quota.remainingDaily).toBe(0)

        // 4th call should be blocked by rate limit
        const blockedRes = await analyzeRoomRedesign({ userId })
        expect(blockedRes.success).toBe(false)
        expect(blockedRes.error?.code).toBe('RATE_LIMIT_EXCEEDED')
    })
})
