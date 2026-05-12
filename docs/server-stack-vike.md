# Server stack: Vike + Hono + Vercel + Vite

Single reference for how this repo runs the **HTTP server**, integrates **Vike SSR**, and deploys to **Vercel**. Pair with [`mui-emotion-ssr-vike.md`](./mui-emotion-ssr-vike.md) for UI SSR.

## What replaced vike-photon

| Removed | Replaced with |
|--------|----------------|
| `vike-photon` + `extends: [vikePhoton]` + `photon: { server }` in `pages/+config.ts` | Vike **native** [`+server`](https://vike.dev/server) at **repo root** `+server.ts` |
| `@photonjs/hono` (`apply` / `serve`) | [`@vikejs/hono`](https://vike.dev/server): `import vike from '@vikejs/hono'` then `vike(app)` |
| `@photonjs/vercel` | [`vite-plugin-vercel`](https://vike.dev/vercel): `vercel()` in `vite.config.ts` |

Official guide: [Migration to +server](https://vike.dev/migration/server).

## File map

| Path | Role |
|------|------|
| `+server.ts` | **Server entry** (project root). Creates `Hono`, mounts middleware and **API routes before** `vike(app)`, exports `{ fetch: app.fetch, prod: { port, onReady } }` (`Server` from `vike/types`). |
| `server/api/chat.ts` | `POST /api/v1/chat` — RAG (Gemini + Supabase). Imported from `+server.ts` via `./server/api/chat.ts`. |
| `server/api/payment/signature.ts` | `POST /api/v1/payment/signature` — ePayco MD5 signature (server-only private key). |
| `pages/+config.ts` | Global Vike page config only — **no** `vike-photon` extend, **no** `photon` block. |
| `vite.config.ts` | `react()`, `vike({})`, `vercel()`; production `ssr.noExternal` for MUI/Emotion and other SSR-unfriendly packages. |
| `tsconfig.json` | `include` lists `+server.ts` so `pnpm typecheck` covers the entry file. |

Handlers and helpers stay under `server/`; only the **entry** lives at the root, per the migration doc.

## Vite config (Vercel + SSR)

- Plugins: **`vike()`** then **`vercel()`** — see [Vike > Vercel](https://vike.dev/vercel).
- **`ssr.noExternal`**: in production, MUI, Emotion, Data Grid, Sendbird, `firebase`, `date-fns`, `zustand`, etc. are bundled for SSR so Node does not hit ESM directory-import issues (see MUI SSR doc).
- **Vite 8**: follow [Vite migration](https://vite.dev/guide/migration) when bumping majors; `build.rollupOptions.output.manualChunks` may eventually move to Rolldown’s `codeSplitting` (tracked separately).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | `vite` — dev server + HMR (including `+server.ts`). |
| `pnpm build` | Production client + server bundles and Vercel output. |
| `pnpm preview` | `vite preview` — preview production build locally. |
| `pnpm prod` | `vike build && node ./dist/server/index.mjs` — run built Node server locally. |

## API route ordering (critical)

Register **every** Hono route that must run as real HTTP handlers **before** `vike(app)`. After `vike(app)`, the Vike middleware acts as a **catch-all** for SSR; routes registered later will not run.

## Agent context

Root [`AGENTS.md`](../AGENTS.md) and this file are the system of record for server and deploy constraints.
