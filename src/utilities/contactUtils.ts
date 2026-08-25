/**
 * Contact Utilities
 *
 * Migration helpers and accessors for the multi-channel contact system.
 * Converts legacy flat userMail/userPhone into structured arrays.
 */

import type { ContactEmail, ContactPhone } from '@services/types'

// =============================================================================
// Migration
// =============================================================================

export interface LegacyUserFields {
    userMail?: string | null | undefined
    userPhone?: string | null | undefined
    userTel?: string | null | undefined
    emails?: ContactEmail[] | undefined
    phones?: ContactPhone[] | undefined
    [key: string]: unknown
}

/**
 * Silently migrate legacy flat contact fields into the new array format.
 * Returns normalized `emails` and `phones` arrays.
 * Does NOT mutate the original object.
 */
export function migrateContactFields(doc: LegacyUserFields): {
    emails: ContactEmail[]
    phones: ContactPhone[]
} {
    // Emails — use existing array or migrate from userMail
    let emails: ContactEmail[] = []
    if (doc.emails && doc.emails.length > 0) {
        emails = doc.emails
    } else if (doc.userMail) {
        emails = [
            {
                address: doc.userMail,
                isPrimary: true,
                verified: false,
            },
        ]
    }

    // Phones — use existing array or migrate from userPhone / userTel
    let phones: ContactPhone[] = []
    if (doc.phones && doc.phones.length > 0) {
        phones = doc.phones
    } else {
        const legacyPhone = doc.userPhone || doc.userTel
        if (legacyPhone) {
            phones = [
                {
                    number: legacyPhone,
                    isPrimary: true,
                    type: 'personal',
                },
            ]
        }
    }

    return { emails, phones }
}

// =============================================================================
// Accessors
// =============================================================================

/**
 * Get the primary email address from a contacts array.
 * Falls back to the first entry if none is marked primary.
 */
export function getPrimaryEmail(emails?: ContactEmail[]): string | null {
    if (!emails || emails.length === 0) return null
    const primary = emails.find((e) => e.isPrimary)
    return primary?.address ?? emails[0]?.address ?? null
}

/**
 * Get the primary phone number from a contacts array.
 * Falls back to the first entry if none is marked primary.
 */
export function getPrimaryPhone(phones?: ContactPhone[]): string | null {
    if (!phones || phones.length === 0) return null
    const primary = phones.find((p) => p.isPrimary)
    return primary?.number ?? phones[0]?.number ?? null
}

// =============================================================================
// Factories
// =============================================================================

/** Create a blank email entry (non-primary by default). */
export function createEmptyEmail(): ContactEmail {
    return { address: '', isPrimary: false, verified: false }
}

/** Create a blank phone entry (non-primary by default). */
export function createEmptyPhone(): ContactPhone {
    return { number: '', isPrimary: false, type: 'personal' }
}
