/**
 * Unit Tests for Multi-Provider Linking & Unlinking (Phase 2)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getLinkedProviders,
    linkPhoneProvider,
    unlinkProvider,
    type ConfirmationResult,
} from '@services/firebase/authService'
import * as firebaseAuth from 'firebase/auth'

// Mock Firebase client
vi.mock('@services/firebase/client', () => ({
    isFirebaseAvailable: () => true,
    auth: {
        currentUser: {
            uid: 'test-user-123',
            providerData: [
                {
                    providerId: 'google.com',
                    displayName: 'Test User',
                    email: 'test@dezzpo.com',
                    phoneNumber: null,
                    photoURL: null,
                },
            ],
        },
    },
}))

vi.mock('firebase/auth', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/auth')>()
    return {
        ...actual,
        unlink: vi.fn((_user, _providerId) => Promise.resolve({
            uid: 'test-user-123',
            email: 'test@dezzpo.com',
            phoneNumber: '+573204842897',
            displayName: 'Test User',
            photoURL: null,
            emailVerified: true,
        })),
        linkWithCredential: vi.fn((_user, _cred) => Promise.resolve({
            user: {
                uid: 'test-user-123',
                email: 'test@dezzpo.com',
                phoneNumber: '+573204842897',
                displayName: 'Test User',
                photoURL: null,
                emailVerified: true,
            },
        })),
        PhoneAuthProvider: {
            credential: vi.fn((id, code) => ({ verificationId: id, code })),
        },
    }
})

describe('Auth Providers Management (Phase 2)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getLinkedProviders', () => {
        it('returns active providers list from auth.currentUser', () => {
            const providers = getLinkedProviders()
            expect(Array.isArray(providers)).toBe(true)
            expect(providers.length).toBe(1)
            expect(providers[0]?.providerId).toBe('google.com')
            expect(providers[0]?.email).toBe('test@dezzpo.com')
        })
    })

    describe('linkPhoneProvider', () => {
        it('validates 6-digit OTP code before proceeding', async () => {
            const mockConfirmationResult = {
                confirm: vi.fn(),
                verificationId: 'v-123',
            } as unknown as ConfirmationResult

            const response = await linkPhoneProvider(mockConfirmationResult, '1234')
            expect(response.success).toBe(false)
            if (!response.success) {
                expect(response.error.code).toBe('AUTH_INVALID_CODE')
                expect(response.error.message).toContain('6 dígitos')
            }
        })

        it('successfully links phone credential with 6-digit OTP code', async () => {
            const mockConfirmationResult = {
                confirm: vi.fn(),
                verificationId: 'v-123',
            } as unknown as ConfirmationResult

            const response = await linkPhoneProvider(mockConfirmationResult, '250051')
            expect(response.success).toBe(true)
            if (response.success) {
                expect(response.data.phoneNumber).toBe('+573204842897')
            }
        })
    })

    describe('unlinkProvider', () => {
        it('blocks unlinking if only 1 provider exists', async () => {
            const response = await unlinkProvider('google.com')
            expect(response.success).toBe(false)
            if (!response.success) {
                expect(response.error.code).toBe('AUTH_CANNOT_UNLINK_LAST_PROVIDER')
                expect(response.error.message).toContain('único método de acceso')
            }
        })
    })
})
