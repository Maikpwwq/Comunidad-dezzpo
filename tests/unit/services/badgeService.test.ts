import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deriveMerchantPerformanceMetrics, syncComercianteBadges } from '@/services/reputation/badgeService'
import * as contractService from '@/services/contracts/contractService'
import * as firebaseModule from '@/services/firebase'

vi.mock('@services/contracts/contractService', () => ({
    getContractsByProvider: vi.fn(),
}))

vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: vi.fn(),
    firestore: {},
}))

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
}))

describe('badgeService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('deriveMerchantPerformanceMetrics', () => {
        it('correctly maps contracts and merchant data to metrics', async () => {
            vi.mocked(contractService.getContractsByProvider).mockResolvedValue([
                { status: 'completed' } as any,
                { status: 'completed' } as any,
                { status: 'completed' } as any,
                { status: 'disputed' } as any,
            ])

            const merchantDoc = {
                isVerifiedProvider: true,
                membershipStatus: 'active',
                rating: 4.8,
                hasCertification: true,
            }

            const metrics = await deriveMerchantPerformanceMetrics('merchant-123', merchantDoc)

            expect(metrics.totalCompletedContracts).toBe(3)
            expect(metrics.disputedContractsCount).toBe(1)
            expect(metrics.onTimeCompletedContracts).toBe(2)
            expect(metrics.hasVerifiedIdentity).toBe(true)
            expect(metrics.isAnnualMember).toBe(true)
            expect(metrics.hasTechnicalCertification).toBe(true)
            expect(metrics.averageReviewRating).toBe(4.8)
        })

        it('handles default empty state gracefully', async () => {
            vi.mocked(contractService.getContractsByProvider).mockResolvedValue([])

            const metrics = await deriveMerchantPerformanceMetrics('merchant-empty', {})

            expect(metrics.totalCompletedContracts).toBe(0)
            expect(metrics.disputedContractsCount).toBe(0)
            expect(metrics.hasVerifiedIdentity).toBe(false)
            expect(metrics.isAnnualMember).toBe(false)
            expect(metrics.hasTechnicalCertification).toBe(false)
        })
    })

    describe('syncComercianteBadges', () => {
        it('returns UNAVAILABLE error when firebase is not available', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(false)

            const result = await syncComercianteBadges('merchant-123')

            expect(result.success).toBe(false)
            expect(result.error?.code).toBe('INTERNAL_ERROR')
        })
    })
})

