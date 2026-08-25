/**
 * Unit Tests for findUserByPhone & Firestore Sanitization
 */
import { describe, it, expect } from 'vitest'
import { getPhoneVariants } from '@services/users/findUserByPhone'
import { sanitizeForFirestore } from '@services/utils/firestoreUtils'

describe('Phone Number Search Variants (getPhoneVariants)', () => {
    it('generates correct E.164 and local variants for 10-digit Colombian phone', () => {
        const variants = getPhoneVariants('3204842897')
        expect(variants).toContain('+573204842897')
        expect(variants).toContain('3204842897')
        expect(variants).toContain('573204842897')
    })

    it('generates variants when starting with +57', () => {
        const variants = getPhoneVariants('+573204842897')
        expect(variants).toContain('+573204842897')
        expect(variants).toContain('3204842897')
        expect(variants).toContain('573204842897')
    })

    it('handles phone numbers with spaces, dashes, or parentheses', () => {
        const variants = getPhoneVariants('+57 (320) 484-2897')
        expect(variants).toContain('+573204842897')
        expect(variants).toContain('3204842897')
    })

    it('returns empty array for empty string', () => {
        expect(getPhoneVariants('')).toEqual([])
    })
})

describe('Firestore Data Sanitization (sanitizeForFirestore)', () => {
    it('removes top-level undefined properties', () => {
        const input = {
            userId: 'user-123',
            userMail: 'test@dezzpo.com',
            userPhone: undefined,
            userName: 'Test User',
        }

        const sanitized = sanitizeForFirestore(input)
        expect(sanitized).toEqual({
            userId: 'user-123',
            userMail: 'test@dezzpo.com',
            userName: 'Test User',
        })
        expect('userPhone' in (sanitized as Record<string, unknown>)).toBe(false)
    })

    it('preserves null values (Firestore supports null)', () => {
        const input = {
            userId: 'user-123',
            userMail: null,
            userPhone: null,
        }

        const sanitized = sanitizeForFirestore(input)
        expect(sanitized).toEqual({
            userId: 'user-123',
            userMail: null,
            userPhone: null,
        })
    })

    it('recursively removes nested undefined values inside objects and arrays', () => {
        const input = {
            id: 'item-1',
            details: {
                title: 'Clean Item',
                extra: undefined,
            },
            tags: ['tag1', undefined, 'tag2'],
            locations: [
                { name: 'Sede 1', lat: 4.6097, lng: undefined },
            ],
        }

        const sanitized = sanitizeForFirestore(input)
        expect(sanitized).toEqual({
            id: 'item-1',
            details: {
                title: 'Clean Item',
            },
            tags: ['tag1', undefined, 'tag2'],
            locations: [
                { name: 'Sede 1', lat: 4.6097 },
            ],
        })
    })

    it('handles primitive values correctly', () => {
        expect(sanitizeForFirestore('hello')).toBe('hello')
        expect(sanitizeForFirestore(123)).toBe(123)
        expect(sanitizeForFirestore(true)).toBe(true)
        expect(sanitizeForFirestore(null)).toBe(null)
        expect(sanitizeForFirestore(undefined)).toBe(undefined)
    })
})
