/**
 * Server Notifications for Pre-Registration Moderation (`notifications.ts`)
 *
 * Dispatches friendly notifications to the recommending user upon moderation outcomes.
 * Conforms to R10:
 * - Does not copy external third-party sensitive details.
 * - Resolves friendly rejection copy using closed labels, never internal notes.
 * - Does not contact the recommended candidate automatically.
 */

import { adminFirestore } from '@/services/firebase/admin'
import {
    NOTIFICATION_TEMPLATES,
    REJECTION_REASON_LABELS,
    type RejectionReasonCode,
} from '@config/preRegistration.config'

export async function sendModerationNotificationToAuthor(params: {
    readonly authorUid: string
    readonly candidateName: string
    readonly preRegistrationId: string
    readonly outcome: 'aprobada' | 'rechazada' | 'duplicada'
    readonly reasonCode?: RejectionReasonCode
}): Promise<void> {
    if (!adminFirestore) return

    const { authorUid, candidateName, preRegistrationId, outcome, reasonCode } =
        params

    let title = 'Actualización sobre tu recomendación'
    let body = ''

    if (outcome === 'aprobada') {
        title = '¡Recomendación aprobada!'
        body = NOTIFICATION_TEMPLATES.approved(candidateName)
    } else if (outcome === 'rechazada') {
        const friendlyReason =
            (reasonCode && REJECTION_REASON_LABELS[reasonCode]) ||
            'No cumple con los criterios de moderación'
        body = NOTIFICATION_TEMPLATES.rejected(candidateName, friendlyReason)
    } else if (outcome === 'duplicada') {
        body = NOTIFICATION_TEMPLATES.duplicate(candidateName)
    }

    try {
        const notifRef = adminFirestore.collection('notifications').doc()
        await notifRef.set({
            notificationId: notifRef.id,
            userId: authorUid,
            title,
            body,
            actionUrl: `/app/portal-servicios`,
            type: 'service',
            isRead: false,
            createdAt: new Date().toISOString(),
            metadata: {
                preRegistrationId,
                outcome,
            },
        })
    } catch {
        // Notification delivery is best-effort and non-blocking
    }
}
