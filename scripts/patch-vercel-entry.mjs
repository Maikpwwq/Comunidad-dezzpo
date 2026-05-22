/**
 * Post-build script: Patches dist/server/entry.mjs to:
 * 1. Export the Hono `app` instance
 * 2. Export a default Vercel handler via hono/vercel's handle()
 *
 * This lets api/index.ts simply re-export from entry.mjs,
 * keeping ONE Hono app + ONE Vike middleware + ONE page manifest.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const entryPath = resolve('dist/server/entry.mjs')

let content = readFileSync(entryPath, 'utf-8')

// Replace the final `export {};` with proper exports
const needle = 'export {};'
const lastIndex = content.lastIndexOf(needle)

if (lastIndex === -1) {
  console.warn('[patch-vercel-entry] Could not find "export {};" in entry.mjs — skipping patch')
  process.exit(0)
}

const patch = `
// --- Vercel Serverless Function patch (scripts/patch-vercel-entry.mjs) ---
import { handle as __handle } from 'hono/vercel';
var __vercelHandler = __handle(app);
export { app, __vercelHandler as default };
`

content = content.slice(0, lastIndex) + patch + content.slice(lastIndex + needle.length)

writeFileSync(entryPath, content, 'utf-8')
console.log('[patch-vercel-entry] ✅ Patched entry.mjs: export { app, default (vercel handler) }')
