/**
 * Property-Based Tests with fast-check — Phone Domain
 *
 * Verifies Invariants:
 * - I1: Total parser safety (never throws on any arbitrary input)
 * - I2: Idempotence of canonical E.164 normalization
 * - I3: Preservation of national digits (no silent truncation)
 * - I4: Canonical E.164 formatting constraints
 * - I7: Deep link safety (tel: and wa.me)
 * - I9: Single deterministic message prioritization
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
    parsePhone,
    formatPhone,
    toE164,
    toTelHref,
    toWhatsAppHref,
    getPhoneMessage,
} from '@services/phone'

describe('Phone Domain — Property-Based Testing (fast-check)', () => {
    // Invariant I1: Total safety — never throws on any arbitrary input
    it('Invariant I1: parsePhone never throws on arbitrary input (strings, objects, numbers, null)', () => {
        fc.assert(
            fc.property(
                fc.anything(),
                (arbitraryVal) => {
                    expect(() => parsePhone(arbitraryVal)).not.toThrow()
                    const result = parsePhone(arbitraryVal)
                    expect(result).toBeDefined()
                    expect(['vacio', 'valido', 'incompleto', 'invalido']).toContain(result.status)
                }
            ),
            { numRuns: 1000 }
        )
    })

    // Invariant I2: Idempotence of E.164
    it('Invariant I2: parsePhone is idempotent on canonical E.164 outputs', () => {
        // Arbitrary Colombian mobile generator
        const colombianMobileGen = fc.array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 9, maxLength: 9 })
            .map((digits) => `+573${digits.join('')}`)

        fc.assert(
            fc.property(colombianMobileGen, (e164Mobile) => {
                const firstPass = parsePhone(e164Mobile)
                expect(firstPass.status).toBe('valido')
                if (firstPass.status === 'valido') {
                    const secondPass = parsePhone(firstPass.e164)
                    expect(secondPass.status).toBe('valido')
                    if (secondPass.status === 'valido') {
                        expect(secondPass.e164).toBe(firstPass.e164)
                        expect(secondPass.kind).toBe(firstPass.kind)
                    }
                }
            }),
            { numRuns: 500 }
        )
    })

    // Invariant I3: Non-destructive / no silent truncation
    it('Invariant I3: formatPhone preserves all typed national digits without trimming', () => {
        const digitStringGen = fc.array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 1, maxLength: 18 })
            .map((digits) => digits.join(''))

        fc.assert(
            fc.property(digitStringGen, (digits) => {
                const formatted = formatPhone(`+57${digits}`)
                // Every single digit present in input must remain present in formatted output
                const formattedDigits = formatted.replace(/\D/g, '').replace(/^57/, '')
                expect(formattedDigits).toBe(digits)
            }),
            { numRuns: 500 }
        )
    })

    // Invariant I4: Canonical E.164 structure
    it('Invariant I4: valid toE164 outputs always adhere to standard E.164 structure (+[1-9][0-9]{6,14})', () => {
        fc.assert(
            fc.property(fc.string({ maxLength: 100 }), (rawString) => {
                const e164 = toE164(rawString)
                if (e164 !== null) {
                    expect(e164.startsWith('+')).toBe(true)
                    const digits = e164.slice(1)
                    expect(/^\d+$/.test(digits)).toBe(true)
                    expect(digits.length).toBeGreaterThanOrEqual(7)
                    expect(digits.length).toBeLessThanOrEqual(15)
                }
            }),
            { numRuns: 500 }
        )
    })

    // Invariant I7: Safe Deep Links
    it('Invariant I7: toTelHref and toWhatsAppHref produce safe URLs or null, immune to injection', () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 100 }),
                fc.string({ maxLength: 100 }),
                (phoneInput, messageInput) => {
                    const tel = toTelHref(phoneInput)
                    if (tel !== null) {
                        expect(tel.startsWith('tel:+')).toBe(true)
                        expect(tel).not.toContain('javascript:')
                        expect(tel).not.toContain(' ')
                    }

                    const wa = toWhatsAppHref(phoneInput, messageInput)
                    if (wa !== null) {
                        expect(wa.startsWith('https://wa.me/')).toBe(true)
                        expect(wa).not.toContain('+') // wa.me does not take plus sign
                        expect(wa).not.toContain('javascript:')
                    }
                }
            ),
            { numRuns: 500 }
        )
    })

    // Invariant I9: Single message at a time
    it('Invariant I9: getPhoneMessage returns either a non-empty string or null, never empty string', () => {
        fc.assert(
            fc.property(fc.anything(), fc.constantFrom('telefono' as const, 'whatsapp' as const), (input, variant) => {
                const parsed = parsePhone(input)
                const msg = getPhoneMessage(parsed, variant)
                if (msg !== null) {
                    expect(typeof msg).toBe('string')
                    expect(msg.trim().length).toBeGreaterThan(0)
                }
            }),
            { numRuns: 500 }
        )
    })
})
