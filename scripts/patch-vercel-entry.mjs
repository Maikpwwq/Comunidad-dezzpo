import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const entryPath = resolve('dist/server/entry.mjs')

let content = readFileSync(entryPath, 'utf-8')

// Find the chunk filename imported in entry.mjs
// e.g. import "./chunks/chunk-0ZirLw5g2.js";
const match = content.match(/import\s+['"](\.\/chunks\/chunk-[^'"]+\.js)['"]/)

if (!match) {
  console.error('[patch-vercel-entry] ❌ Could not find chunk import in entry.mjs!')
  process.exit(1)
}

const chunkPath = match[1]
console.log(`[patch-vercel-entry] Found server chunk: ${chunkPath}`)

// Write the patched entry.mjs that exports the hono/vercel handler
const patchedContent = `import { t as server } from "${chunkPath}";
import { handle } from 'hono/vercel';

// Re-export the Vercel serverless handler directly
export default handle(server);
`

writeFileSync(entryPath, patchedContent, 'utf-8')
console.log('[patch-vercel-entry] ✅ Patched entry.mjs to export Hono Vercel handler!')
