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

// Write the new entry.mjs that exports the Web Standard fetch handler directly
const patchedContent = `import { t as server } from "${chunkPath}";

// Web Standard fetch handler for Vercel Serverless Function
export default async function(request, context) {
  // Pass to Hono's standard Web fetch method
  return server.fetch(request, {}, context);
}
`

writeFileSync(entryPath, patchedContent, 'utf-8')
console.log('[patch-vercel-entry] ✅ Patched entry.mjs to export Web Standard fetch handler!')
