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

// API routes MUST be registered before vike(app) (SSR catch-all).
app.get('/api/v1/status', (c) =>
  c.json({
    status: 'online',
    framework: 'vike+hono',
  }),
)

app.post('/api/v1/chat', async (c) => {
  try {
    return await chatHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/chat] Route error:', message)
    return c.json({ error: message || 'Chat route failed' }, 500)
  }
})

app.post('/api/v1/payment/signature', async (c) => {
  try {
    return await paymentSignatureHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/payment/signature] Route error:', message)
    return c.json({ error: message || 'Payment signature failed' }, 500)
  }
})

app.post('/api/v1/payment/confirmation', async (c) => {
  try {
    return await paymentConfirmationHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/payment/confirmation] Route error:', message)
    return c.json({ error: message || 'Payment confirmation failed' }, 500)
  }
})

app.post('/api/v1/notifications/email', async (c) => {
  try {
    return await emailNotificationHandler(c)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/v1/notifications/email] Route error:', message)
    return c.json({ error: message || 'Email notification failed' }, 500)
  }
})

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
