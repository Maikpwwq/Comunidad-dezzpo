import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'
import { chatHandler } from '../server/api/chat.ts'
import { paymentSignatureHandler } from '../server/api/payment/signature.ts'

const app = new Hono()

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
