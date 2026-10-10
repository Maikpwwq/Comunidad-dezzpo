/**
 * Server Authentication Helper (`server/api/auth.ts`)
 *
 * Extracts and verifies Firebase Auth ID tokens from incoming Hono requests.
 * Resolves UID, email, and admin custom claims securely.
 */

import type { Context } from 'hono'
import { adminAuth } from '@/services/firebase/admin'

export interface AuthenticatedUser {
    readonly uid: string
    readonly email?: string
    readonly isAdmin: boolean
    readonly claims: Record<string, unknown>
}

/**
 * Extracts and verifies the Firebase ID token from the Authorization header.
 * Returns null if missing or invalid.
 */
export async function authenticateRequest(
    c: Context,
): Promise<AuthenticatedUser | null> {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7).trim()
    if (!token) {
        return null
    }

    // Support for test environments with mocked auth tokens
    if (process.env.NODE_ENV === 'test' && token.startsWith('test-token-')) {
        const parts = token.replace('test-token-', '').split('-')
        const uid = parts[0] || 'test-user-uid'
        const isAdmin = parts.includes('admin')
        return {
            uid,
            email: `${uid}@test.dezzpo.com`,
            isAdmin,
            claims: { admin: isAdmin },
        }
    }

    try {
        if (!adminAuth || typeof adminAuth.verifyIdToken !== 'function') {
            return null
        }

        const decoded = await adminAuth.verifyIdToken(token)
        return {
            uid: decoded.uid,
            email: decoded.email,
            isAdmin: decoded.admin === true,
            claims: decoded,
        }
    } catch {
        return null
    }
}
