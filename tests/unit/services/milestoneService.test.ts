import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    validateMilestonesPercentages,
    calculateMilestoneProgress,
    createContractMilestones,
    type ContractMilestone,
} from '@/services/contracts/milestoneService'
import * as firebaseModule from '@/services/firebase'

vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: vi.fn(),
    firestore: {},
}))

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn().mockResolvedValue({ id: 'milestone-new-1' }),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
}))

describe('milestoneService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('validateMilestonesPercentages', () => {
        it('returns true when sum equals 100%', () => {
            const milestones = [
                { percentage: 30 },
                { percentage: 40 },
                { percentage: 30 },
            ]
            expect(validateMilestonesPercentages(milestones)).toBe(true)
        })

        it('returns false when sum is less than 100%', () => {
            const milestones = [{ percentage: 30 }, { percentage: 40 }]
            expect(validateMilestonesPercentages(milestones)).toBe(false)
        })

        it('returns false when sum exceeds 100%', () => {
            const milestones = [{ percentage: 60 }, { percentage: 50 }]
            expect(validateMilestonesPercentages(milestones)).toBe(false)
        })

        it('returns false when empty or contains zero/negative values', () => {
            expect(validateMilestonesPercentages([])).toBe(false)
            expect(validateMilestonesPercentages([{ percentage: 100 }, { percentage: 0 }])).toBe(false)
        })
    })

    describe('calculateMilestoneProgress', () => {
        it('calculates 0% when no milestones are approved', () => {
            const milestones: ContractMilestone[] = [
                {
                    milestoneId: 'm1',
                    contractId: 'c1',
                    order: 1,
                    title: 'Hito 1',
                    percentage: 30,
                    amountCop: 300000,
                    status: 'in_progress',
                    createdAt: '2026-11-13T00:00:00Z',
                    updatedAt: '2026-11-13T00:00:00Z',
                },
                {
                    milestoneId: 'm2',
                    contractId: 'c1',
                    order: 2,
                    title: 'Hito 2',
                    percentage: 70,
                    amountCop: 700000,
                    status: 'pending',
                    createdAt: '2026-11-13T00:00:00Z',
                    updatedAt: '2026-11-13T00:00:00Z',
                },
            ]

            const progress = calculateMilestoneProgress(milestones)
            expect(progress.completedCount).toBe(0)
            expect(progress.totalCount).toBe(2)
            expect(progress.progressPercentage).toBe(0)
            expect(progress.totalApprovedAmountCop).toBe(0)
        })

        it('calculates correct percentage and approved amounts for completed milestones', () => {
            const milestones: ContractMilestone[] = [
                {
                    milestoneId: 'm1',
                    contractId: 'c1',
                    order: 1,
                    title: 'Hito 1',
                    percentage: 30,
                    amountCop: 300000,
                    status: 'approved',
                    createdAt: '2026-11-13T00:00:00Z',
                    updatedAt: '2026-11-13T00:00:00Z',
                },
                {
                    milestoneId: 'm2',
                    contractId: 'c1',
                    order: 2,
                    title: 'Hito 2',
                    percentage: 70,
                    amountCop: 700000,
                    status: 'pending',
                    createdAt: '2026-11-13T00:00:00Z',
                    updatedAt: '2026-11-13T00:00:00Z',
                },
            ]

            const progress = calculateMilestoneProgress(milestones)
            expect(progress.completedCount).toBe(1)
            expect(progress.totalCount).toBe(2)
            expect(progress.progressPercentage).toBe(30)
            expect(progress.totalApprovedAmountCop).toBe(300000)
        })
    })

    describe('createContractMilestones', () => {
        it('rejects milestone creation when percentages do not equal 100%', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(true)

            const result = await createContractMilestones('c1', 1000000, [
                { title: 'Demolición', percentage: 20 },
                { title: 'Enchape', percentage: 50 },
            ])

            expect(result.success).toBe(false)
            expect(result.error?.code).toBe('VALIDATION_ERROR')
        })

        it('creates milestones successfully when valid', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(true)

            const result = await createContractMilestones('c1', 1000000, [
                { title: 'Hito 1: Obra Negra', percentage: 40 },
                { title: 'Hito 2: Obra Blanca', percentage: 60 },
            ])

            expect(result.success).toBe(true)
            expect(result.data?.length).toBe(2)
            expect(result.data?.[0]?.amountCop).toBe(400000)
            expect(result.data?.[1]?.amountCop).toBe(600000)
        })
    })
})

