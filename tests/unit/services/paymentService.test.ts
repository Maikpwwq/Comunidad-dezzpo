/**
 * Payment Service Unit Tests
 *
 * Tests for CRUD operations in `users/{userId}/paymentMethods`.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getPaymentMethods,
    savePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
} from '@services/paymentService'
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
        getDocs: vi.fn(),
        addDoc: vi.fn(),
        deleteDoc: vi.fn(),
        updateDoc: vi.fn(),
        query: vi.fn((col) => col),
        orderBy: vi.fn(),
    }
})

describe('paymentService', () => {
    const mockUserId = 'user-test-123'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getPaymentMethods', () => {
        it('returns payment methods from firestore snapshot', async () => {
            const mockDocs = [
                {
                    id: 'method-1',
                    data: () => ({
                        userId: mockUserId,
                        type: 'card',
                        brand: 'Visa',
                        last4: '4242',
                        isDefault: true,
                        createdAt: '2026-07-21T00:00:00Z',
                    }),
                },
                {
                    id: 'method-2',
                    data: () => ({
                        userId: mockUserId,
                        type: 'pse',
                        bankName: 'Bancolombia',
                        isDefault: false,
                        createdAt: '2026-07-20T00:00:00Z',
                    }),
                },
            ]

            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                docs: mockDocs,
            } as any)

            const methods = await getPaymentMethods(mockUserId)

            expect(methods).toHaveLength(2)
            expect(methods[0]?.id).toBe('method-1')
            expect(methods[0]?.brand).toBe('Visa')
            expect(methods[1]?.bankName).toBe('Bancolombia')
        })

        it('returns empty array when userId is missing', async () => {
            const methods = await getPaymentMethods('')
            expect(methods).toEqual([])
        })
    })

    describe('savePaymentMethod', () => {
        it('saves a card method successfully', async () => {
            vi.mocked(firestoreModule.addDoc).mockResolvedValueOnce({ id: 'new-card-id' } as any)

            const result = await savePaymentMethod({
                userId: mockUserId,
                type: 'card',
                token: 'tok_test_123',
                brand: 'Visa',
                last4: '4242',
                expMonth: '12',
                expYear: '2028',
                cardholderName: 'Juan Pérez',
                isDefault: false,
            })

            expect(result).toBe('new-card-id')
            expect(firestoreModule.addDoc).toHaveBeenCalledTimes(1)
        })

        it('unsets previous defaults when saving a method marked as default', async () => {
            // Mock getDocs for existing methods check
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                docs: [
                    {
                        id: 'existing-default',
                        data: () => ({ isDefault: true }),
                    },
                ],
            } as any)

            vi.mocked(firestoreModule.addDoc).mockResolvedValueOnce({ id: 'new-default-id' } as any)

            const result = await savePaymentMethod({
                userId: mockUserId,
                type: 'pse',
                bankCode: '1007',
                bankName: 'Bancolombia',
                isDefault: true,
            })

            expect(result).toBe('new-default-id')
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.objectContaining({ path: `users/${mockUserId}/paymentMethods/existing-default` }),
                { isDefault: false }
            )
        })
    })

    describe('deletePaymentMethod', () => {
        it('deletes the specified payment method document', async () => {
            vi.mocked(firestoreModule.deleteDoc).mockResolvedValueOnce(undefined)

            const success = await deletePaymentMethod(mockUserId, 'method-to-delete')

            expect(success).toBe(true)
            expect(firestoreModule.deleteDoc).toHaveBeenCalledTimes(1)
        })

        it('returns false if arguments are missing', async () => {
            const success = await deletePaymentMethod('', 'method-1')
            expect(success).toBe(false)
        })
    })

    describe('setDefaultPaymentMethod', () => {
        it('sets target method as default and unsets others', async () => {
            vi.mocked(firestoreModule.getDocs).mockResolvedValueOnce({
                docs: [
                    { id: 'method-1', data: () => ({ isDefault: true }) },
                    { id: 'method-2', data: () => ({ isDefault: false }) },
                ],
            } as any)

            const success = await setDefaultPaymentMethod(mockUserId, 'method-2')

            expect(success).toBe(true)
            // Should set method-2 to true and method-1 to false
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.objectContaining({ path: `users/${mockUserId}/paymentMethods/method-2` }),
                { isDefault: true }
            )
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.objectContaining({ path: `users/${mockUserId}/paymentMethods/method-1` }),
                { isDefault: false }
            )
        })
    })
})
