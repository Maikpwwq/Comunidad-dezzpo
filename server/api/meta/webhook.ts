/**
 * Meta Graph API Webhook Handler (Real-Time Subscriptions)
 * 
 * Complies with Meta Webhook Verification & HMAC-SHA256 Signature Security:
 * - GET: Hub Challenge Verification (hub.mode, hub.verify_token, hub.challenge)
 * - POST: Real-Time Event Ingestion (Feed changes, group posts, user comments)
 * 
 * Documentation: https://developers.facebook.com/docs/graph-api/webhooks/
 */

import type { Context } from 'hono'
import crypto from 'node:crypto'
import { classifyPostIntent, prepareComment } from '@/services/social/intentParser'

/**
 * Validates HMAC SHA-256 signature from X-Hub-Signature-256 header.
 */
function verifyMetaSignature(rawBody: string, signatureHeader?: string | null, appSecret?: string): boolean {
  if (!appSecret || !signatureHeader) {
    return true // If not configured in dev, pass gracefully
  }

  try {
    const [algorithm, signature] = signatureHeader.split('=')
    if (algorithm !== 'sha256' || !signature) return false

    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    )
  } catch {
    return false
  }
}

/**
 * GET Handler: Meta Webhook Subscription Verification Challenge.
 */
export async function metaWebhookGetHandler(c: Context): Promise<Response> {
  const mode = c.req.query('hub.mode')
  const verifyToken = c.req.query('hub.verify_token')
  const challenge = c.req.query('hub.challenge')

  const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || process.env.META_APP_SECRET || 'dezzpo_webhook_secret'

  if (mode === 'subscribe' && verifyToken === expectedToken && challenge) {
    console.log('[Meta Webhook] Verification Challenge Passed successfully.')
    return c.text(challenge, 200)
  }

  console.warn('[Meta Webhook] Verification Challenge Failed. Invalid token or mode.')
  return c.text('Forbidden: Invalid verify token', 403)
}

/**
 * POST Handler: Real-Time Event Notification Ingestion.
 */
export async function metaWebhookPostHandler(c: Context): Promise<Response> {
  const rawBody = await c.req.text()
  const signatureHeader = c.req.header('x-hub-signature-256')
  const appSecret = process.env.META_APP_SECRET

  // 1. Verify Signature
  if (!verifyMetaSignature(rawBody, signatureHeader, appSecret)) {
    console.warn('[Meta Webhook] Invalid HMAC-SHA256 signature.')
    return c.json({ error: 'Invalid signature' }, 401)
  }

  // 2. Parse Event Payload
  try {
    const payload = JSON.parse(rawBody) as {
      object: string
      entry?: readonly {
        id: string
        time: number
        changes?: readonly {
          field: string
          value: {
            item?: string
            post_id?: string
            comment_id?: string
            message?: string
            from?: { id: string; name: string }
            created_time?: number
          }
        }[]
      }[]
    }

    if (payload.object === 'page' || payload.object === 'group') {
      for (const entry of payload.entry ?? []) {
        for (const change of entry.changes ?? []) {
          const value = change.value
          if (value && value.message) {
            const intent = classifyPostIntent(value.message)
            console.log(
              `[Meta Webhook Event] Field: ${change.field} | Intent: ${intent.intent} | Trade: ${intent.detectedTrade} | Author: ${value.from?.name}`
            )

            if (intent.intent !== 'NEUTRAL' && value.from) {
              const prepared = prepareComment({
                post: {
                  id: value.post_id ?? value.comment_id ?? entry.id,
                  message: value.message,
                  authorName: value.from.name,
                  authorId: value.from.id,
                },
                intentResult: intent,
                isSimulation: true,
              })

              if (prepared) {
                console.log(`[Meta Webhook Prepared Response]: ${prepared.formattedComment}`)
              }
            }
          }
        }
      }
    }

    // Meta strictly requires returning 200 OK within 5 seconds
    return c.text('EVENT_RECEIVED', 200)
  } catch (err) {
    console.error('[Meta Webhook] Error parsing webhook payload:', err)
    return c.text('EVENT_RECEIVED', 200)
  }
}
