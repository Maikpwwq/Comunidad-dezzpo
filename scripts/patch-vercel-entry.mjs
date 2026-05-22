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

// Let's verify that the chunk exports the 't' object which is our _server_default
const chunkFullPath = resolve('dist/server', chunkPath)
const chunkContent = readFileSync(chunkFullPath, 'utf-8')
if (!chunkContent.includes('export {') || !chunkContent.includes(' t }') && !chunkContent.includes('as t')) {
  console.warn('[patch-vercel-entry] ⚠️ Warning: Chunk does not seem to export "t" as expected.')
}

// Write the new entry.mjs that exports the Vercel handler
const patchedContent = `import { t as server } from "${chunkPath}";
import { handle } from 'hono/vercel';

// Re-export the Vercel serverless handler directly
export default handle(server);
`

writeFileSync(entryPath, patchedContent, 'utf-8')
console.log('[patch-vercel-entry] ✅ Patched entry.mjs to export Vercel handler!')
