/**
 * Phone Auth & Utility Unit Tests
 */
import { describe, it, expect, vi } from 'vitest'
import {
    formatToE164,
    isValidColombianPhone,
    formatPhoneDisplay
} from '@services/utils/phoneUtils'
import {
    verifySMSCode,
    type ConfirmationResult
} from '@services/firebase/authService'

describe('Phone Utilities (phoneUtils)', () => {
    describe('formatToE164', () => {
        it('formats 10-digit Colombian mobile number to E.164', () => {
            expect(formatToE164('3204842897')).toBe('+573204842897')
        })

        it('handles spaces and hyphens in phone numbers', () => {
            expect(formatToE164('320 484 2897')).toBe('+573204842897')
            expect(formatToE164('320-484-2897')).toBe('+573204842897')
            expect(formatToE164('  320 484 2897  ')).toBe('+573204842897')
        })

        it('preserves existing E.164 formatted numbers', () => {
            expect(formatToE164('+573204842897')).toBe('+573204842897')
            expect(formatToE164('+16505551234')).toBe('+16505551234')
        })

        it('handles 12-digit number with 57 prefix without plus', () => {
            expect(formatToE164('573204842897')).toBe('+573204842897')
        })

        it('returns empty string for empty input', () => {
            expect(formatToE164('')).toBe('')
        })
    })

    describe('isValidColombianPhone', () => {
        it('validates 10-digit Colombian mobile starting with 3', () => {
            expect(isValidColombianPhone('3204842897')).toBe(true)
            expect(isValidColombianPhone('+573204842897')).toBe(true)
            expect(isValidColombianPhone('3001234567')).toBe(true)
            expect(isValidColombianPhone('3159876543')).toBe(true)
        })

        it('rejects non-Colombian or invalid formats', () => {
            expect(isValidColombianPhone('1234567')).toBe(false)
            expect(isValidColombianPhone('2345678901')).toBe(false) // Landline / doesn't start with 3
            expect(isValidColombianPhone('')).toBe(false)
        })
    })

    describe('formatPhoneDisplay', () => {
        it('formats +57 phone numbers with readable spacing', () => {
            expect(formatPhoneDisplay('+573204842897')).toBe('+57 320 484 2897')
            expect(formatPhoneDisplay('3204842897')).toBe('+57 320 484 2897')
        })

        it('returns empty string for empty input', () => {
            expect(formatPhoneDisplay('')).toBe('')
        })
    })
})

describe('Phone Auth Service (Firebase Auth Layer)', () => {
    it('returns error when verifying OTP code with invalid length', async () => {
        const mockConfirmationResult = {
            confirm: vi.fn(),
            verificationId: 'test-id',
        } as unknown as ConfirmationResult

        const response = await verifySMSCode(mockConfirmationResult, '123')
        expect(response.success).toBe(false)
        if (!response.success) {
            expect(response.error.code).toBe('AUTH_INVALID_CODE')
        }
    })

    it('successfully confirms 6-digit OTP code and returns AuthUser', async () => {
        const mockUser = {
            uid: 'phone-user-123',
            email: null,
            phoneNumber: '+573204842897',
            displayName: 'Usuario Prueba',
            photoURL: null,
            emailVerified: true,
        }

        const mockConfirmationResult = {
            confirm: vi.fn().mockResolvedValue({ user: mockUser }),
            verificationId: 'test-verification-id',
        } as unknown as ConfirmationResult

        const response = await verifySMSCode(mockConfirmationResult, '250051', 'Usuario Prueba')
        expect(response.success).toBe(true)
        if (response.success) {
            expect(response.data.uid).toBe('phone-user-123')
            expect(response.data.phoneNumber).toBe('+573204842897')
        }
    })

    it('handles confirmation errors gracefully with friendly messages', async () => {
        const mockConfirmationResult = {
            confirm: vi.fn().mockRejectedValue({ code: 'auth/invalid-verification-code' }),
            verificationId: 'test-verification-id',
        } as unknown as ConfirmationResult

        const response = await verifySMSCode(mockConfirmationResult, '999999')
        expect(response.success).toBe(false)
        if (!response.success) {
            expect(response.error.code).toBe('AUTH_INVALID_CODE')
            expect(response.error.message).toContain('incorrecto')
        }
    })
})
