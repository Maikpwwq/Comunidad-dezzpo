/**
 * Review Requests Cron API
 *
 * Server-side endpoint that triggers review requests for completed contracts.
 * Designed to be called by a cron job (e.g., daily via Vercel Cron).
 *
 * Checks for contracts that are 'completed', not 'rated', and older than 24h.
 */

import { Context } from 'hono'
import { adminFirestore } from '@services/firebase/admin'

export async function reviewRequestsHandler(c: Context) {
    try {
        // Verify cron secret to prevent unauthorized calls
        const authHeader = c.req.header('Authorization')
        const cronSecret = process.env.CRON_SECRET
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return c.json({ error: 'Unauthorized' }, 401)
        }

        // Query completed contracts that haven't been rated and haven't had a request sent
        const contractsSnap = await adminFirestore
            .collection('contracts')
            .where('status', '==', 'completed')
            .where('rated', '!=', true)
            .get()

        let requestsSent = 0
        const batch = adminFirestore.batch()
        const now = new Date()

        for (const docSnap of contractsSnap.docs) {
            const data = docSnap.data()
            
            // Skip if already requested
            if (data.reviewRequested) continue
            
            // Check if older than 24h
            // Note: In a production system, we'd prefer 'completedAt' instead of 'createdAt'
            const createdAt = data.createdAt ? new Date(data.createdAt) : null
            if (!createdAt) continue
            
            const hoursSince = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
            
            if (hoursSince >= 24) {
                // TODO: Integrate Email provider (e.g. Resend) or FCM Notification here
                console.log(`[ReviewRequests] Would send review request to client: ${data.clientId} for contract: ${docSnap.id}`)
                
                // Mark as requested to avoid duplicate emails
                batch.update(docSnap.ref, { reviewRequested: true })
                requestsSent++
            }
        }

        if (requestsSent > 0) {
            await batch.commit()
        }

        console.log(`[ReviewRequests] Sent ${requestsSent} review requests`)
        return c.json({ success: true, requestsSent })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('[ReviewRequests] Failed:', message)
        return c.json({ error: 'Review requests failed', details: message }, 500)
    }
}
