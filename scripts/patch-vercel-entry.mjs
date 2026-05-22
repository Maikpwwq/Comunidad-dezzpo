/**
 * Post-build script: Patches dist/server/entry.mjs to export the Hono `app`
 * so that api/index.ts (Vercel Serverless Function) can import and wrap it.
 *
 * Vike's build bundles the entire +server.ts into entry.mjs including the
 * Hono app and all page manifests, but it ends with `export {};`.
 * This script replaces that empty export with `export { app };`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const entryPath = resolve('dist/server/entry.mjs')

let content = readFileSync(entryPath, 'utf-8')

// Replace the final `export {};` with `export { app };`
const needle = 'export {};'
const lastIndex = content.lastIndexOf(needle)

if (lastIndex === -1) {
  console.warn('[patch-vercel-entry] Could not find "export {};" in entry.mjs — skipping patch')
  process.exit(0)
}

content = content.slice(0, lastIndex) + 'export { app };' + content.slice(lastIndex + needle.length)

writeFileSync(entryPath, content, 'utf-8')
console.log('[patch-vercel-entry] ✅ Patched entry.mjs to export { app }')
