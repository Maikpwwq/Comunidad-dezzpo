/**
 * Client Service for Admin Search Analytics (`analyticsService.ts`)
 *
 * Implements:
 * - Secure communication with server endpoint /api/v1/admin/analytics/searches
 * - Firebase ID Token retrieval for admin authentication
 * - ServiceResponse<T> pattern adherence (Section 3 of AGENTS.md)
 */

import { auth } from '@/services/firebase'
import type { PeriodId, SearchBreakdown } from './types'
import type { ServiceResponse } from '@/types/services.d'

/**
 * Fetches the aggregated search breakdown from the server for the requested period.
 */
export async function getAdminSearchBreakdown(
    period: PeriodId = '30d',
): Promise<ServiceResponse<SearchBreakdown>> {
    try {
        let idToken = ''
        if (auth && auth.currentUser) {
            idToken = await auth.currentUser.getIdToken()
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }
        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`
        }

        const res = await fetch(`/api/v1/admin/analytics/searches?period=${period}`, {
            method: 'GET',
            headers,
        })

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ error: 'Error de servidor' }))
            const message = errorBody?.error || `Error HTTP ${res.status}`
            return {
                success: false,
                data: null,
                error: {
                    code: res.status === 401 || res.status === 403 ? 'FIRESTORE_PERMISSION_DENIED' : 'INTERNAL_ERROR',
                    message,
                },
            }
        }

        const data: SearchBreakdown = await res.json()
        return {
            success: true,
            data,
            error: null,
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return {
            success: false,
            data: null,
            error: {
                code: 'INTERNAL_ERROR',
                message,
            },
        }
    }
}
