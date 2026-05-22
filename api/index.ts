// @ts-nocheck
// Vercel Serverless Function entry point
//
// Strategy:
// 1. Import dist/server/entry.mjs for SIDE EFFECTS — this executes
//    setGlobalContext_prodBuildEntry() which loads the Vike page manifest.
//    Without this, renderPage() would crash because it can't find pages.
// 2. Import the source +server.ts to get the actual Hono `app` instance.
//    This creates a second Hono app (the one from entry.mjs is discarded),
//    but renderPage() works because the page manifest was already loaded
//    into globalThis.__VIKE__ by step 1.
// 3. Wrap with hono/vercel's handle() adapter for Vercel compatibility.

import '../dist/server/entry.mjs'
import { handle } from 'hono/vercel'
import { app } from '../pages/+server.js'

export default handle(app)
