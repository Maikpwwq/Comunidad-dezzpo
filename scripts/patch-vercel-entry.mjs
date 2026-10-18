import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

/**
 * Post-build: patches dist/server/entry.mjs for Vercel Serverless Functions.
 *
 * Vike 0.4.268+ with Universal Deploy generates:
 *   - index.mjs  → Node.js standalone entry (dynamically imports the server chunk)
 *   - entry.mjs  → route definitions only (export {})
 *   - chunks/chunk-XXX.js → contains the actual server with fetch()
 *
 * This script finds the server chunk (the one exporting a default with fetch()),
 * and writes a Vercel-compatible adapter into entry.mjs.
 */

const distServer = resolve('dist/server')
const entryPath = resolve(distServer, 'entry.mjs')
const indexPath = resolve(distServer, 'index.mjs')
const chunksDir = resolve(distServer, 'chunks')

/**
 * Strategy 1: Parse index.mjs for the dynamic import of the server chunk.
 * e.g. await import("./chunks/chunk-JTJl1_8O.js")
 */
function findServerChunkFromIndex() {
  try {
    const indexContent = readFileSync(indexPath, 'utf-8')
    // Match: await import("./chunks/chunk-XXX.js")
    const match = indexContent.match(/await\s+import\(\s*["'](\.\/chunks\/chunk-[^"']+\.js)["']\s*\)/)
    if (match) {
      return match[1]
    }
  } catch {
    // index.mjs may not exist in older builds
  }
  return null
}

/**
 * Strategy 2: Scan all chunks for the one that exports a default with fetch().
 * Pattern: export { something as default }  AND  fetch: app.fetch  OR  async fetch(request
 */
function findServerChunkByScanning() {
  const files = readdirSync(chunksDir).filter(f => f.startsWith('chunk-') && f.endsWith('.js'))

  for (const file of files) {
    const content = readFileSync(join(chunksDir, file), 'utf-8')
    // Must export a default
    const hasDefaultExport = /export\s*\{[^}]*\bas\s+default\s*\}/.test(content)
    // Must contain a fetch function (from +server.ts)
    const hasFetch = /\.fetch\b/.test(content) && /app\.fetch/.test(content)

    if (hasDefaultExport && hasFetch) {
      return `./chunks/${file}`
    }
  }
  return null
}

// --- Main ---

let serverChunkPath = findServerChunkFromIndex()
let source = 'index.mjs'

if (!serverChunkPath) {
  serverChunkPath = findServerChunkByScanning()
  source = 'chunk scan'
}

if (!serverChunkPath) {
  console.error('[patch-vercel-entry] ❌ Could not locate the server chunk with fetch()!')
  console.error('[patch-vercel-entry] Neither index.mjs parsing nor chunk scanning found a match.')
  process.exit(1)
}

console.log(`[patch-vercel-entry] Found server chunk via ${source}: ${serverChunkPath}`)

// Verify the chunk exports default
const chunkFullPath = resolve(distServer, serverChunkPath)
const chunkContent = readFileSync(chunkFullPath, 'utf-8')

// Detect export name: export { virtual_ud_catch_all_default as default }
// or: export { _server_default as default }
// or: export { someVar as default }
const exportMatch = chunkContent.match(/export\s*\{\s*(\w+)\s+as\s+default\s*\}/)

if (!exportMatch) {
  console.error('[patch-vercel-entry] ❌ Server chunk does not export a default!')
  console.error('[patch-vercel-entry] Chunk tail:', chunkContent.slice(-300))
  process.exit(1)
}

const exportName = exportMatch[1]
console.log(`[patch-vercel-entry] Detected server export name: ${exportName}`)

// Also import the entry chunk (route definitions) so Vike's global context is initialized
const entryContent = readFileSync(entryPath, 'utf-8')
const entryChunkMatch = entryContent.match(/import\s+["'](\.\/chunks\/chunk-[^"']+\.js)["']/)
const entryChunkImport = entryChunkMatch ? `import "${entryChunkMatch[1]}";\n` : ''

// Write the patched entry.mjs with a Vercel-compatible Node.js adapter
const patchedContent = `${entryChunkImport}import { ${exportName} as server } from "${serverChunkPath}";

// Custom translation adapter from Node.js (req, res) to Web Standard Request/Response
export default async function handler(req, res) {
  try {
    const method = req.method || 'GET';
    const host = req.headers['host'] || 'localhost';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const url = \`\${proto}://\${host}\${req.url}\`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }

    let body = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      body = req;
    }

    const request = new Request(url, {
      method,
      headers,
      body,
      duplex: 'half'
    });

    const response = await server.fetch(request);

    // Set response headers and status code
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      // Avoid duplicating transfer-encoding if handled by compression middleware
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });

    // Write body to response stream
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    console.error('[Vercel Adapter] Request failed:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal Server Error');
  }
}
`

writeFileSync(entryPath, patchedContent, 'utf-8')
console.log(`[patch-vercel-entry] ✅ Patched entry.mjs (export: ${exportName})`)
