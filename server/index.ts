import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { apply, serve } from '@photonjs/hono'
import { chatHandler } from './api/chat.ts'

/**
 * Refined Hono Server for Comunidad Dezzpo
 * Replaces Express with Photon-optimized middleware
 */
function startServer() {
  const app = new Hono()

  // 1. Standard Middlewares (Hono equivalents)
  app.use('*', logger())
  app.use(compress())
  app.use('/api/*', cors())

  // 2. Custom Firebase Admin Middleware (Example Translation)
  app.use('/api/*', async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      // Logic for firebase-admin verification goes here
    }
    await next()
  })

  // ── API Routes (MUST be before apply() / Vike catch-all) ───────────────

  // Health check
  app.get('/api/v1/status', (c) => c.json({ 
    status: 'online', 
    framework: 'vike-photon' 
  }))

  // RAG Chat API (Gemini + Supabase pgvector)
  app.post('/api/v1/chat', async (c) => {
    try {
      return await chatHandler(c)
    } catch (err: any) {
      console.error('[/api/v1/chat] Route error:', err?.message || err)
      return c.json({ error: err?.message || 'Chat route failed' }, 500)
    }
  })

  // ── Vike SSR (catch-all — must be LAST) ────────────────────────────────
  apply(app)

  // Server Start
  const port = process.env.PORT || 3000
  return serve(app, {
    port: Number(port),
    onReady() {
      console.log(`🚀 Server ready at http://localhost:${port}`)
    },
  })
}

export default startServer()
