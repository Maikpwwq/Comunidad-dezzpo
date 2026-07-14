import { Context } from 'hono'
import { adminFirestore, adminMessaging } from '@services/firebase/admin'

export async function fanoutNotificationHandler(c: Context) {
    try {
        const body = await c.req.json()
        const { draftId, serviceCategory, locationZone } = body

        if (!draftId || !locationZone) {
            return c.json({ error: 'Missing draftId or locationZone' }, 400)
        }

        console.log(`[Fanout] Triggered for Draft: ${draftId}, Zone: ${locationZone}, Category: ${serviceCategory}`)

        // 1. Query Comerciantes who cover this zone and are available
        const querySnapshot = await adminFirestore
            .collection('usersComerciantesCalificados')
            .where('userZonasCobertura', 'array-contains', locationZone)
            .where('isAvailableNow', '==', true)
            .get()

        const tokens: string[] = []
        querySnapshot.forEach((doc: any) => {
            const data = doc.data()
            if (data.fcmTokens && Array.isArray(data.fcmTokens)) {
                tokens.push(...data.fcmTokens)
            }
        })

        if (tokens.length === 0) {
            console.log(`[Fanout] No available merchants with tokens found for zone: ${locationZone}`)
            return c.json({ success: true, sent: 0, message: 'No available merchants' })
        }

        // 2. Send multicast message
        const message = {
            notification: {
                title: '¡Nuevo Trabajo Urgente!',
                body: `Se requiere ${serviceCategory || 'un servicio'} en tu zona. ¡Sé el primero en responder!`,
            },
            data: {
                draftId,
                click_action: `FLUTTER_NOTIFICATION_CLICK`,
                url: `/cotizar/ver/${draftId}`
            },
            tokens,
        }

        const response = await adminMessaging.sendMulticast(message)
        
        console.log(`[Fanout] Sent to ${tokens.length} devices. Success: ${response.successCount}, Failed: ${response.failureCount}`)
        
        // Clean up failed tokens if needed (e.g. invalid tokens)
        
        return c.json({
            success: true,
            sent: response.successCount,
            failed: response.failureCount
        })

    } catch (error: any) {
        console.error('[Fanout] Error sending push notifications:', error)
        return c.json({ error: 'Failed to fanout notifications', details: error?.message }, 500)
    }
}
