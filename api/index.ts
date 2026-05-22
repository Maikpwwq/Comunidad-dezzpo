// Diagnostic wrapper for Vercel Serverless Function
import { handle } from 'hono/vercel'

let cachedHandler: any = null
let initError: any = null

async function getHandler() {
  if (cachedHandler) return cachedHandler
  if (initError) throw initError

  try {
    console.log('Diagnostic: Starting dynamic import of entry.mjs...')
    await import('../dist/server/entry.mjs')
    console.log('Diagnostic: entry.mjs imported successfully.')

    console.log('Diagnostic: Starting import of pages/+server.js...')
    const serverModule = await import('../pages/+server.js')
    console.log('Diagnostic: pages/+server.js imported successfully.')

    const app = serverModule.app
    if (!app) {
      throw new Error('Hono app instance not found in pages/+server.js exports')
    }

    cachedHandler = handle(app)
    return cachedHandler
  } catch (err: any) {
    console.error('Diagnostic: Initialization error caught:', err)
    initError = {
      message: err?.message || String(err),
      stack: err?.stack || 'No stack trace available',
      name: err?.name || 'Error'
    }
    throw err
  }
}

export default async function (req: any, res: any) {
  try {
    const handler = await getHandler()
    return handler(req, res)
  } catch (err: any) {
    const errorDetails = initError || {
      message: err?.message || String(err),
      stack: err?.stack || 'No stack trace',
      name: err?.name || 'Runtime Error'
    }

    // Return a detailed error page to the browser
    return new Response(
      JSON.stringify({
        status: 500,
        error: 'FUNCTION_INITIALIZATION_FAILED',
        message: errorDetails.message,
        name: errorDetails.name,
        stack: errorDetails.stack,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL: process.env.VERCEL
        }
      }, null, 2),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
