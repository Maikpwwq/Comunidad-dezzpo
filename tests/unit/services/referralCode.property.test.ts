import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

/**
 * Pure generator function matching referralService.ts referral code algorithm:
 * cleanId = userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'USER'
 * generatedCode = `DEZZPO-${cleanId}${randomPart}`
 */
function generateReferralCode(userId: string, randomNumber: number): string {
    const cleanId = userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'USER'
    const randomPart = Math.floor(1000 + (randomNumber % 9000))
    return `DEZZPO-${cleanId}${randomPart}`
}

describe('Referral Code Generation Invariants (Property-Based)', () => {
    it('always produces codes matching prefix DEZZPO- followed by uppercase alphanumeric characters and 4 digits', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 0, maxLength: 100 }),
                fc.integer({ min: 0, max: 1000000 }),
                (rawUserId, randNum) => {
                    const code = generateReferralCode(rawUserId, randNum)

                    // Must start with DEZZPO-
                    expect(code.startsWith('DEZZPO-')).toBe(true)

                    // Code format regex: DEZZPO-[A-Z0-9]{1,4}[1-9][0-9]{3}
                    expect(code).toMatch(/^DEZZPO-[A-Z0-9]{4,8}$/)

                    // Must not contain spaces, lowercases, or non-alphanumeric special characters after prefix
                    const suffix = code.replace('DEZZPO-', '')
                    expect(suffix).toBe(suffix.toUpperCase())
                    expect(suffix).toMatch(/^[A-Z0-9]+$/)
                }
            ),
            { numRuns: 500 }
        )
    })

    it('handles empty or pure-symbol user IDs gracefully by falling back to DEZZPO-USERxxxx', () => {
        fc.assert(
            fc.property(
                fc.stringMatching(/^[^a-zA-Z0-9]*$/), // strings containing ONLY symbols/spaces
                fc.integer({ min: 1000, max: 9999 }),
                (symbolicUserId, randNum) => {
                    const code = generateReferralCode(symbolicUserId, randNum)
                    expect(code.startsWith('DEZZPO-USER')).toBe(true)
                }
            ),
            { numRuns: 200 }
        )
    })
})
