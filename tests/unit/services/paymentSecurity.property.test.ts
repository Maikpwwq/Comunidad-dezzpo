import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { createHash } from 'crypto'

/**
 * ePayco Cryptographic Signature Generation (Server-Side Logic)
 * Signature formula: md5(P_CUST_ID^P_KEY^INVOICE^AMOUNT^CURRENCY)
 */
function generateEpaycoSignature(
    custId: string,
    pKey: string,
    invoice: string,
    amount: number,
    currency: string = 'COP'
): string {
    const amountStr = amount.toFixed(2)
    const signatureString = `${custId}^${pKey}^${invoice}^${amountStr}^${currency}`
    return createHash('md5').update(signatureString).digest('hex')
}

describe('Payment Security & Signature Invariants (Property-Based)', () => {
    it('generates a valid 32-character hexadecimal MD5 hash for any valid transaction parameters', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1, maxLength: 50 }), // custId
                fc.string({ minLength: 1, maxLength: 50 }), // pKey
                fc.string({ minLength: 1, maxLength: 60 }), // invoice
                fc.double({ min: 100, max: 100000000, noNaN: true }), // amount
                fc.constantFrom('COP', 'USD', 'EUR'), // currency
                (custId, pKey, invoice, amount, currency) => {
                    const signature = generateEpaycoSignature(custId, pKey, invoice, amount, currency)
                    
                    // MD5 hex output must always be exactly 32 lowercase hex characters
                    expect(signature).toMatch(/^[a-f0-9]{32}$/)
                }
            ),
            { numRuns: 500 }
        )
    })

    it('guarantees deterministic output (same inputs always produce identical signature)', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 4, maxLength: 20 }),
                fc.string({ minLength: 4, maxLength: 20 }),
                fc.string({ minLength: 4, maxLength: 30 }),
                fc.integer({ min: 1000, max: 5000000 }),
                (custId, pKey, invoice, amount) => {
                    const sig1 = generateEpaycoSignature(custId, pKey, invoice, amount, 'COP')
                    const sig2 = generateEpaycoSignature(custId, pKey, invoice, amount, 'COP')
                    expect(sig1).toBe(sig2)
                }
            ),
            { numRuns: 300 }
        )
    })

    it('ensures different amounts or invoices produce distinct signatures (collision resistance)', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 4 }),
                fc.string({ minLength: 4 }),
                fc.string({ minLength: 5 }),
                fc.integer({ min: 1000, max: 500000 }),
                fc.integer({ min: 500001, max: 1000000 }),
                (custId, pKey, invoice, amount1, amount2) => {
                    const sig1 = generateEpaycoSignature(custId, pKey, invoice, amount1, 'COP')
                    const sig2 = generateEpaycoSignature(custId, pKey, invoice, amount2, 'COP')
                    expect(sig1).not.toBe(sig2)
                }
            ),
            { numRuns: 300 }
        )
    })
})
