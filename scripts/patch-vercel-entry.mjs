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

// Dynamically detect the export name from the chunk
// Rolldown minifies it: export { _server_default as t }
// The name ('t') can vary across build environments (local vs Vercel)
const chunkFullPath = resolve('dist/server', chunkPath)
const chunkContent = readFileSync(chunkFullPath, 'utf-8')
const exportMatch = chunkContent.match(/export\s*\{\s*_server_default\s+as\s+(\w+)\s*\}/)

if (!exportMatch) {
  console.error('[patch-vercel-entry] ❌ Could not find _server_default export in chunk!')
  console.error('[patch-vercel-entry] Chunk tail:', chunkContent.slice(-200))
  process.exit(1)
}

const exportName = exportMatch[1]
console.log(`[patch-vercel-entry] Detected server export name: ${exportName}`)

// Write the patched entry.mjs that exports a custom, zero-dependency translation adapter
const patchedContent = `import { ${exportName} as server } from "${chunkPath}";

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
      // Avoid duplicating content-encoding if handled by compression middleware
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
