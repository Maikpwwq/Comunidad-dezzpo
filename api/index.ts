import { handle } from 'hono/vercel'
// Import from the Vite-built entry — this file contains:
// 1. The full Hono app with all API routes
// 2. The Vike SSR middleware
// 3. The page manifest (setGlobalContext_prodBuildEntry)
// The post-build script (scripts/patch-vercel-entry.mjs) patches it to export { app }.
import { app } from '../dist/server/entry.mjs'

// Vercel Serverless Function entry point
export default handle(app)
