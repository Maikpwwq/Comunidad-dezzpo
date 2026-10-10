/**
 * Rate Limiting & User Quotas for Pre-Registrations (`rateLimit.ts`)
 *
 * Enforces:
 * 1. Rolling 24-hour submission quota (max 5 per user).
 * 2. Active concurrent pending quota (max 5 pending per user).
 */

import { adminFirestore } from '@/services/firebase/admin'
import {
    MAX_PENDING_PER_USER,
    MAX_SUBMISSIONS_PER_24H,
} from '@config/preRegistration.config'

export interface RateLimitCheckResult {
    readonly allowed: boolean
    readonly reason?: 'daily_limit_exceeded' | 'pending_limit_exceeded'
    readonly message?: string
}

/**
 * Checks if the user is within permitted recommendation limits.
 */
export async function checkUserPreRegistrationLimits(
    userId: string,
): Promise<RateLimitCheckResult> {
    if (!adminFirestore) {
        return { allowed: true }
    }

    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

    try {
        const preRegCol = adminFirestore.collection('preRegistrations')

        // 1. Check concurrent pending items
        const pendingSnap = await preRegCol
            .where('submittedBy', '==', userId)
            .where('status', '==', 'pendiente')
            .get()

        if (pendingSnap.size >= MAX_PENDING_PER_USER) {
            return {
                allowed: false,
                reason: 'pending_limit_exceeded',
                message:
                    'Tienes varias recomendaciones pendientes de revisión. Por favor espera a que sean moderadas antes de enviar más.',
            }
        }

        // 2. Check 24-hour submission volume
        const dailySnap = await preRegCol
            .where('submittedBy', '==', userId)
            .where('createdAt', '>=', twentyFourHoursAgo)
            .get()

        if (dailySnap.size >= MAX_SUBMISSIONS_PER_24H) {
            return {
                allowed: false,
                reason: 'daily_limit_exceeded',
                message:
                    'Ya enviaste varias recomendaciones hoy. Mañana podrás enviar más.',
            }
        }

        return { allowed: true }
    } catch {
        // Fail open if query error
        return { allowed: true }
    }
}
