import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { compress } from 'hono/compress'
import { apply, serve } from '@photonjs/hono'

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
  // If you had an Express middleware for Firebase Auth, translate it here:
  app.use('/api/*', async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      // Logic for firebase-admin verification goes here
    }
    await next()
  })

  // 3. Vike & Extension Integration
  // This automatically handles SSR and Vike-specific routing
  apply(app)

  // 4. API Route Implementation
  app.get('/api/v1/status', (c) => c.json({ 
    status: 'online', 
    framework: 'vike-photon' 
  }))

  // 5. Unified Server Start
  const port = process.env.PORT || 3000
  return serve(app, {
    port: Number(port),
    onReady() {
      console.log(`🚀 Server ready at http://localhost:${port}`)
    },
  })
}

export default startServer()
