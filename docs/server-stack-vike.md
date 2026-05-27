# Server stack: Vike + Hono + Vercel + Vite

Single reference for how this repo runs the **HTTP server**, integrates **Vike SSR**, and deploys to **Vercel**. Pair with [`mui-emotion-ssr-vike.md`](./mui-emotion-ssr-vike.md) for UI SSR.

## What replaced vike-photon

| Removed | Replaced with |
|--------|----------------|
| `vike-photon` + `extends: [vikePhoton]` + `photon: { server }` in `pages/+config.ts` | Vike **native** [`+server`](https://vike.dev/server) at **`+server.ts`** |
| `@photonjs/hono` (`apply` / `serve`) | [`@vikejs/hono`](https://vike.dev/server): `import vike from '@vikejs/hono'` then `vike(app)` |
| `@photonjs/vercel` | Custom `api/index.ts` + `scripts/patch-vercel-entry.mjs` (see below) |

Official guide: [Migration to +server](https://vike.dev/migration/server).

## File map

| Path | Role |
|------|------|
| `pages/+server.ts` | **Server entry**. Creates `Hono`, mounts middleware and **API routes before** `vike(app)`, exports `{ fetch: app.fetch, prod: { port, onReady } }` (`Server` from `vike/types`). |
| `server/api/chat.ts` | `POST /api/v1/chat` — RAG (Gemini + Supabase). Imported from `+server.ts`. |
| `server/api/payment/signature.ts` | `POST /api/v1/payment/signature` — ePayco MD5 signature (server-only private key). |
| `api/index.ts` | **Vercel serverless entry point**. Re-exports the patched `dist/server/entry.mjs`. |
| `scripts/patch-vercel-entry.mjs` | **Post-build script**. Patches `dist/server/entry.mjs` with a custom Node→Web adapter. |
| `vercel.json` | Vercel config: `outputDirectory`, rewrites, function config. |
| `pages/+config.ts` | Global Vike page config only — **no** `vike-photon` extend, **no** `photon` block. |
| `vite.config.ts` | `@vitejs/plugin-react`, `vike({})`; production `ssr.noExternal` for MUI/Emotion. |

---

## Vercel Deployment Architecture (CRITICAL)

### The Problem: Vike V1 + Vercel Node.js Runtime

Vike V1 compiles `pages/+server.ts` into `dist/server/entry.mjs`. This compiled entry:
1. Only imports a hashed chunk file (e.g., `./chunks/chunk-XcuZkRfL2.js`)
2. Does **NOT** export a handler that Vercel can invoke
3. The `app` (Hono instance) is private inside the chunk — not directly accessible

Vercel's Node.js Serverless runtime invokes functions with the **legacy Node.js signature**: `(req: IncomingMessage, res: ServerResponse) => void`. But Hono's `app.fetch()` expects a **Web Standard** `Request` object.

### Why `hono/vercel` Does NOT Work

Hono's built-in `hono/vercel` adapter (`handle`) is literally:
```javascript
var handle = (app) => (req) => app.fetch(req);
```

This assumes `req` is a Web Standard `Request` (Edge runtime). On Vercel's **Node.js** runtime, `req` is actually Node's `IncomingMessage`, which has:
- `.headers` as a plain object (no `.get()` method)
- `.url` as a relative path (e.g., `/` not `https://domain.com/`)

This causes two cascading errors:
- `TypeError: this.raw.headers.get is not a function` — Hono tries `req.headers.get()`
- `TypeError: Invalid URL` — `@universal-middleware/core` does `new URL(request.url)` with a relative path

### The Solution: Custom Node→Web Adapter

**`scripts/patch-vercel-entry.mjs`** runs after `vike build` and rewrites `dist/server/entry.mjs` with a zero-dependency adapter:

```javascript
export default async function handler(req, res) {
  // 1. Construct absolute URL from Node headers
  const url = `${req.headers['x-forwarded-proto']}://${req.headers['host']}${req.url}`;

  // 2. Convert Node headers → Web Headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) { ... }

  // 3. Create Web Standard Request (Node 18+ global)
  const request = new Request(url, { method, headers, body, duplex: 'half' });

  // 4. Call Hono's fetch
  const response = await server.fetch(request);

  // 5. Stream Web Response → Node res
  res.statusCode = response.status;
  response.headers.forEach((v, k) => res.setHeader(k, v));
  // ... stream body ...
  res.end();
}
```

### Static Assets: `outputDirectory`

`vercel.json` sets `"outputDirectory": "dist/client"`. Vercel serves files from this directory via its **CDN** (CSS, JS, images, fonts). The catch-all rewrite `/(.*) → /api` only triggers when no static file matches.

```
Request Flow:
  Browser → Vercel CDN → dist/client/assets/*.css ✅ (served directly)
  Browser → Vercel CDN → /app/dashboard → api/index.ts → SSR
```

### Request Flow Diagram

```
┌─────────────────────────────────────────────┐
│                 Vercel Edge                  │
│                                              │
│  Static file?  ──YES──→  dist/client/ (CDN)  │
│       │                                      │
│      NO                                      │
│       │                                      │
│  rewrite /(.*) → /api                        │
└───────┬──────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────┐
│  api/index.ts (Vercel Serverless Function)   │
│  └── re-exports dist/server/entry.mjs        │
│       └── Custom Node→Web Adapter            │
│            ├── Node req → Web Request        │
│            ├── server.fetch(request)          │
│            └── Web Response → Node res       │
│                                              │
│  server = Vike-compiled Hono app             │
│  ├── URL normalization middleware            │
│  ├── logger, compress, cors                  │
│  ├── API routes (/api/v1/*)                  │
│  └── vike(app) — SSR catch-all               │
└──────────────────────────────────────────────┘
```

---

## vercel.json Reference

```json
{
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/client",
  "rewrites": [
    { "source": "/(.*)", "destination": "/api" }
  ],
  "functions": {
    "api/index.ts": {
      "includeFiles": "dist/**"
    }
  }
}
```

| Key | Purpose |
|-----|---------|
| `framework: "vite"` | Tells Vercel to use Vite build toolchain |
| `buildCommand` | Runs `vike build` + patch script (see package.json) |
| `outputDirectory` | **CRITICAL**: Serves `dist/client/` as static CDN files |
| `rewrites` | Catch-all: routes without static files go to serverless function |
| `functions.includeFiles` | Bundles `dist/**` (server chunks) into the serverless function |

---

## Build Pipeline

```bash
pnpm build
# ↓ runs: vike build && node scripts/patch-vercel-entry.mjs
#
# Step 1: vike build
#   → dist/client/   (static assets: CSS, JS, images, HTML)
#   → dist/server/   (SSR: entry.mjs + chunks/)
#
# Step 2: patch-vercel-entry.mjs
#   → Reads dist/server/entry.mjs
#   → Finds the hashed chunk import
#   → Rewrites entry.mjs with custom Node→Web adapter
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | `vite` — dev server + HMR (including `pages/+server.ts`). |
| `pnpm build` | `vike build && node scripts/patch-vercel-entry.mjs` — production build + Vercel patch. |
| `pnpm preview` | `vite preview` — static client preview. |
| `pnpm prod` | `vike build && vike preview` — build then run production SSR app locally. |

---

## Approaches That FAILED (Historical Reference)

> [!WARNING]
> These approaches were tried and failed. Do not re-attempt them.

### ❌ `vite-plugin-vercel`
The `vercel()` plugin from `vite-plugin-vercel` or `@magne4000/vite-plugin-vercel-ssr` did not generate correct Vercel output for Vike V1. It produced `__vike.func/index.mjs` entries that Vercel couldn't invoke, and chunk paths didn't resolve.

### ❌ `hono/vercel` `handle()` adapter
As documented above, `handle(app)` passes the raw Node `req` to `app.fetch()`. On Vercel's Node.js runtime, `req` is `IncomingMessage`, not a Web `Request`. Causes `headers.get is not a function`.

### ❌ Importing `pages/+server.ts` directly in `api/index.ts`
Importing raw TypeScript source in `api/index.ts` fails because:
- Vercel's build doesn't transpile files outside `api/`
- Path aliases (`@features/*`, etc.) aren't resolved
- `Cannot find module` errors cascade

### ❌ Web Standard `export default (request) => Response` signature
Vercel's Node.js runtime ignores the return value of a default export. It expects `(req, res) => void`. Using `export default async (request) => { return new Response(...) }` shows the warning:
```
WARN: default export returned a Response.
The default-export signature is (req, res) => void — returns are ignored.
```

### ❌ `@hono/node-server/vercel`
Not installed in the project. Could work as an alternative, but the custom adapter is zero-dependency and gives full control.

---

## API route ordering (critical)

Register **every** Hono route that must run as real HTTP handlers **before** `vike(app)`. After `vike(app)`, the Vike middleware acts as a **catch-all** for SSR; routes registered later will not run.

## URL Normalization Middleware

`pages/+server.ts` includes a safety middleware that converts relative URLs to absolute URLs. This is a defense-in-depth measure in case the adapter or runtime passes partial URLs:

```typescript
app.use('*', async (c, next) => {
  const url = c.req.url
  if (url.startsWith('/') || !url.startsWith('http')) {
    const host = c.req.header('host') || 'localhost'
    const proto = c.req.header('x-forwarded-proto') || 'https'
    const absoluteUrl = `${proto}://${host}${url.startsWith('/') ? url : '/' + url}`
    Object.defineProperty(c.req.raw, 'url', {
      value: absoluteUrl, writable: true, configurable: true
    })
  }
  await next()
})
```

## Agent context

Root [`AGENTS.md`](../AGENTS.md) and this file are the system of record for server and deploy constraints.
