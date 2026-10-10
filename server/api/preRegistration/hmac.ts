/**
 * HMAC Uniqueness Derivation (`hmac.ts`)
 *
 * Derives cryptographic hashes for candidate contact details using a server-side secret.
 * This guarantees atomic uniqueness reservations in Firestore without storing plain-text
 * personally identifiable information (PII) in document IDs or reservation collections,
 * eliminating account enumeration vulnerabilities.
 */

import { createHmac } from 'node:crypto'

const HMAC_SECRET =
    process.env.PRE_REGISTRATION_HMAC_SECRET ||
    process.env.VITE_APP_PRE_REGISTRATION_HMAC_SECRET ||
    'dezzpo-pre-registration-salt-2026-secure-key'

/**
 * Computes an HMAC-SHA256 hex string from an input string.
 */
export function computeHmac(value: string): string {
    return createHmac('sha256', HMAC_SECRET).update(value).digest('hex')
}

/**
 * Creates deterministic reservation IDs for Firestore locks.
 */
export function createReservationKey(
    type: 'phone' | 'email' | 'name',
    normalizedValue: string,
): string {
    const hash = computeHmac(`${type}:${normalizedValue.trim()}`)
    return `res_${type}_${hash}`
}
