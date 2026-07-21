/**
 * Referral Service Unit Tests
 *
 * Tests for referral code generation, sign-up tracking, points calculation, and rewards redemption.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getOrCreateReferralCode,
    trackReferralRegistration,
    redeemReward,
} from '@services/referralService'

import * as firestoreModule from 'firebase/firestore'

// Mock Firebase availability & Firestore methods
vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: () => true,
    firestore: {},
}))

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/firestore')>()
    return {
        ...actual,
        collection: vi.fn(() => ({ type: 'collection' })),
        doc: vi.fn((_db, ...paths) => ({ type: 'doc', path: paths.join('/') })),
        getDoc: vi.fn(),
        getDocs: vi.fn(),
        addDoc: vi.fn(() => Promise.resolve({ id: 'ref-doc-123' })),
        updateDoc: vi.fn(() => Promise.resolve()),
        query: vi.fn((col) => col),
        where: vi.fn(),
        orderBy: vi.fn(),
    }
})

describe('referralService', () => {
    const mockUserId = 'user-abc-123'
    const mockRefCode = 'DEZZPO-ABC123'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getOrCreateReferralCode', () => {
        it('returns existing code if present on user document', async () => {
            vi.mocked(firestoreModule.getDoc).mockResolvedValueOnce({
                exists: () => true,
                data: () => ({ referralCode: 'DEZZPO-EXISTING' }),
            } as any)

            const code = await getOrCreateReferralCode(mockUserId)
            expect(code).toBe('DEZZPO-EXISTING')
        })

        it('generates and saves a new referral code if not present', async () => {
            // Comerciante lookup returns not found, Propietario lookup returns user without code
            vi.mocked(firestoreModule.getDoc)
                .mockResolvedValueOnce({ exists: () => false } as any)
                .mockResolvedValueOnce({
                    exists: () => true,
                    data: () => ({ userId: mockUserId }),
                } as any)

            const code = await getOrCreateReferralCode(mockUserId)
            expect(code).toMatch(/^DEZZPO-/)
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ referralCode: code })
            )
        })

        it('returns empty string if userId is empty', async () => {
            const code = await getOrCreateReferralCode('')
            expect(code).toBe('')
        })
    })

    describe('trackReferralRegistration', () => {
        it('awards +50 points to referrer on new sign-up', async () => {
            // Mock finding referrer by referralCode
            vi.mocked(firestoreModule.getDocs)
                .mockResolvedValueOnce({
                    empty: false,
                    docs: [
                        {
                            ref: { id: 'referrer-1' },
                            data: () => ({
                                userId: 'referrer-1',
                                userName: 'Carlos Referente',
                                referralStats: { totalInvited: 2, activeReferrals: 0, pointsBalance: 100, totalPointsEarned: 100 },
                            }),
                        },
                    ],
                } as any)

            // Mock finding new user doc to update referredBy
            vi.mocked(firestoreModule.getDoc).mockResolvedValueOnce({
                exists: () => true,
                data: () => ({ userId: 'new-user-999' }),
            } as any)

            const success = await trackReferralRegistration('new-user-999', 'Ana Invitada', 1, mockRefCode)

            expect(success).toBe(true)
            expect(firestoreModule.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    referrerId: 'referrer-1',
                    referredUserId: 'new-user-999',
                    pointsEarned: 50,
                    status: 'pending',
                })
            )

            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    referralStats: {
                        totalInvited: 3,
                        activeReferrals: 0,
                        pointsBalance: 150,
                        totalPointsEarned: 150,
                    },
                })
            )
        })

        it('prevents self-referral', async () => {
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                empty: false,
                docs: [
                    {
                        ref: { id: mockUserId },
                        data: () => ({ userId: mockUserId }),
                    },
                ],
            } as any)

            const success = await trackReferralRegistration(mockUserId, 'Self User', 1, mockRefCode)
            expect(success).toBe(false)
        })
    })

    describe('redeemReward', () => {
        it('deducts points and generates a coupon code when balance is sufficient', async () => {
            vi.mocked(firestoreModule.getDoc).mockResolvedValueOnce({
                exists: () => true,
                data: () => ({
                    userId: mockUserId,
                    referralStats: { totalInvited: 10, activeReferrals: 2, pointsBalance: 600, totalPointsEarned: 600 },
                }),
            } as any)

            const res = await redeemReward(mockUserId, 'discount_membership')

            expect(res.success).toBe(true)
            expect(res.couponCode).toMatch(/^DEZZPO-DISCO-/)
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                { 'referralStats.pointsBalance': 100 }
            )
        })

        it('fails redemption if user has insufficient points balance', async () => {
            vi.mocked(firestoreModule.getDoc).mockResolvedValueOnce({
                exists: () => true,
                data: () => ({
                    userId: mockUserId,
                    referralStats: { totalInvited: 1, activeReferrals: 0, pointsBalance: 50, totalPointsEarned: 50 },
                }),
            } as any)

            const res = await redeemReward(mockUserId, 'discount_membership')

            expect(res.success).toBe(false)
            expect(res.message).toContain('Puntos insuficientes')
        })
    })
})
