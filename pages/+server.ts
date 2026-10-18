import dotenv from 'dotenv'
try {
  dotenv.config()
} catch (e) {
  // Ignore missing .env on Vercel
}
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'
import { chatHandler } from '../server/api/chat.ts'
import { paymentSignatureHandler } from '../server/api/payment/signature.ts'
import { paymentConfirmationHandler } from '../server/api/payment/confirmation.ts'
import { emailNotificationHandler } from '../server/api/notifications/email.ts'
import { fanoutNotificationHandler } from '../server/api/notifications/fanout.ts'
import { trustScoreHandler } from '../server/api/trust-score.ts'
import { reviewRequestsHandler } from '../server/api/review-requests.ts'
import { metaWebhookGetHandler, metaWebhookPostHandler } from '../server/api/meta/webhook.ts'
import { metaDataDeletionHandler } from '../server/api/meta/data-deletion.ts'
import {
  createPreRegistrationHandler,
  checkEarlyHandler,
  moderatePreRegistrationHandler,
  withdrawPreRegistrationHandler,
  getMySubmissionsHandler,
} from '../server/api/preRegistration/handlers.ts'
import { adminSearchAnalyticsHandler } from '../server/api/admin/searches.ts'

const app = new Hono()

// Ensure all request URLs are fully absolute for @universal-middleware compatibility
app.use('*', async (c, next) => {
  const url = c.req.url
  if (url.startsWith('/') || !url.startsWith('http')) {
    const host = c.req.header('host') || 'localhost'
    const proto = c.req.header('x-forwarded-proto') || 'https'
    const absoluteUrl = `${proto}://${host}${url.startsWith('/') ? url : '/' + url}`
    
    Object.defineProperty(c.req.raw, 'url', {
      value: absoluteUrl,
      writable: true,
      configurable: true
    })
  }
  await next()
})

app.use('*', logger())
app.use(compress())
app.use('/api/*', cors())

app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    // Firebase Admin verification can be wired here when needed.
  }
  await next()
})

// ── API sub-app ──────────────────────────────────────────────────────────────
// @vikejs/hono@0.4.1+ requires vike(app) before direct route registrations.
// Using app.route() to mount a sub-app bypasses this assertion while keeping
// API routes matched before Vike's SSR catch-all.
const api = new Hono()

api.get('/status', (c) =>
  c.json({
    status: 'online',
    framework: 'vike+hono',
  }),
)

api.post('/chat', async (c) => {
  try {
    return await chatHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/chat] Route error:', message)
    return c.json({ error: message || 'Chat route failed' }, 500)
  }
})

api.post('/payment/signature', async (c) => {
  try {
    return await paymentSignatureHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/payment/signature] Route error:', message)
    return c.json({ error: message || 'Payment signature failed' }, 500)
  }
})

api.post('/payment/confirmation', async (c) => {
  try {
    return await paymentConfirmationHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/payment/confirmation] Route error:', message)
    return c.json({ error: message || 'Payment confirmation failed' }, 500)
  }
})

api.post('/notifications/email', async (c) => {
  try {
    return await emailNotificationHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/notifications/email] Route error:', message)
    return c.json({ error: message || 'Email notification failed' }, 500)
  }
})

api.post('/notifications/fanout', async (c) => {
  try {
    return await fanoutNotificationHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/notifications/fanout] Route error:', message)
    return c.json({ error: message || 'Fanout notification failed' }, 500)
  }
})

api.post('/cron/trust-score', async (c) => {
  try {
    return await trustScoreHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/cron/trust-score] Route error:', message)
    return c.json({ error: message || 'Trust score cron failed' }, 500)
  }
})

api.post('/cron/review-requests', async (c) => {
  try {
    return await reviewRequestsHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/cron/review-requests] Route error:', message)
    return c.json({ error: message || 'Review requests cron failed' }, 500)
  }
})

// Meta Graph API Webhooks & Data Deletion
api.get('/meta/webhook', async (c) => {
  return await metaWebhookGetHandler(c)
})

api.post('/meta/webhook', async (c) => {
  return await metaWebhookPostHandler(c)
})

api.post('/meta/data-deletion', async (c) => {
  return await metaDataDeletionHandler(c)
})

// Pre-Registration routes (Community recommendations & radar moderation)
api.post('/pre-registrations', async (c) => {
  return await createPreRegistrationHandler(c)
})

api.get('/pre-registrations/check-early', async (c) => {
  return await checkEarlyHandler(c)
})

api.post('/pre-registrations/:id/moderate', async (c) => {
  return await moderatePreRegistrationHandler(c)
})

api.post('/pre-registrations/:id/withdraw', async (c) => {
  return await withdrawPreRegistrationHandler(c)
})

api.get('/pre-registrations/my-submissions', async (c) => {
  return await getMySubmissionsHandler(c)
})

// Admin Search Analytics (R1, R2, R3, R5, R6, R7)
api.get('/admin/analytics/searches', async (c) => {
  return await adminSearchAnalyticsHandler(c)
})

// Mount API sub-app at /api/v1 BEFORE vike(app)
app.route('/api/v1', api)

// Vike SSR catch-all (must come after API sub-app mount)
vike(app)

const port = Number(process.env.PORT) || 3000

export default {
  fetch: app.fetch,
  prod: {
    port,
    onReady() {
      console.log(`🚀 Server ready at http://localhost:${port}`)
    },
  },
} as Server & { fetch: typeof app.fetch }

export { app }

