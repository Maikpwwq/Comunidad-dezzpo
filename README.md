# Comunidad Dezzpo

Professional network for real estate maintenance, remodeling, and finishes. We connect qualified professionals with users through a trusted marketplace.

**Coding agents:** start from the repo root [`AGENTS.md`](./AGENTS.md); nested [`pages/(marketing)/AGENTS.md`](./pages/(marketing)/AGENTS.md), [`pages/(app)/AGENTS.md`](./pages/(app)/AGENTS.md), and [`pages/admin/AGENTS.md`](./pages/admin/AGENTS.md) add route-group rules. MUI + Emotion + Vike SSR: [`docs/mui-emotion-ssr-vike.md`](./docs/mui-emotion-ssr-vike.md). Server (+server, Vercel, Vite): [`docs/server-stack-vike.md`](./docs/server-stack-vike.md).

## Tech Stack

- **Framework**: [Vike v0.4.x](https://vike.dev/) (SSR/SSG)
- **UI**: React 19 + [MUI v6](https://mui.com/) (`@mui/material`, `@mui/icons-material`) + [@mui/x-data-grid](https://mui.com/x/react-data-grid/) v7 + **Emotion** (`@emotion/react`, `@emotion/styled`, `@emotion/server`, `@emotion/cache`) for SSR-friendly styling
- **State**: Zustand (replacing Context/RxJS)
- **Auth**: Firebase Auth (Google + Email)
- **Server**: Hono with `@vikejs/hono` (`pages/+server.ts`; see [Vike +server](https://vike.dev/server))
- **AI/RAG**: Gemini 2.5 Flash + Supabase pgvector + AI SDK

### 🛠️ EXTERNAL PROVIDERS


| Provider          | Purpose             | Initialization Dependency                                                                                                                                               |
| ----------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Firebase Auth** | Identity & Session  | Global `AuthProvider`                                                                                                                                                   |
| **Google Auth**   | SSO Provider        | Firebase Client SDK                                                                                                                                                     |
| **Sendbird**      | Real-time Messaging | Authenticated UID (Auth-only). Programmatic orchestration via `@services/sendbird/sendbird.service.ts`. Synchronizes Firebase profiles (Avatar/Nickname) automatically. |


### 🚦 ROUTING & ACCESS CONTROL

The project utilizes a **Tiered Access Model**:

1. **Public (Marketing):** Unrestricted access.
2. **Hybrid (App Guest):** Accessible by anyone w/ App Shell. UI adapts to auth state.
  - `/app/portal-servicios`
    - `/app/directorio-requerimientos`
    - `/app/ver-requerimiento/[id]`
    - `/app/suscripciones` 
    - `/app/perfil/[id]` (Public View)
3. **Strict (App Auth):** Requires valid session (e.g., `/app/messages`, `/app/settings`).
4. **Admin (Custom Claims):** Requires `claims.admin === true` via Firebase custom claims.
  - `/admin/dashboard` — KPI Command Center
    - `/admin/usuarios` — User Management (DataGrid)
    - `/admin/verificacion` — Identity Verification Queue

- **Frontend**: React + TypeScript
- **Server**: Hono with Vike `pages/+server.ts` and `@vikejs/hono`
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend/Services**: Firebase (Auth, Firestore, Storage)
- **AI/RAG Chatbot**: Gemini 2.5 Flash (via @ai-sdk/google) + Supabase pgvector
- **Deployment**: Vercel (Serverless Functions)

## Project Structure

```
comunidad-dezzpo/
├── +server.ts                               # Hono + @vikejs/hono (repo root; see Vike +server)
├── server/
│   └── api/                                 # RAG chat + ePayco signature (imported by +server.ts)
├── pages/                                    # Vike root pages directory
│   ├── +config.ts                            # Global Vike v1 config
│   ├── +Layout.tsx                           # Root layout wrapper
│   ├── +onRenderClient.tsx                   # Client renderer (Emotion CacheProvider)
│   ├── +onRenderHtml.tsx                     # HTML renderer (Emotion critical CSS → <head>)
│   ├── +Head.tsx                             # Shared <head> meta
│   │
│   ├── (marketing)/                          # Route Group: Marketing Pages (SSR/SSG)
│   │   ├── +Layout.tsx                       # Marketing layout (header/footer)
│   │   └── ...                               # Public pages
│   │
│   ├── (auth)/                               # Route Group: Authentication
│   │   ├── +Layout.tsx                       # Auth layout (centered card)
│   │   ├── ingreso/+Page.tsx                 # Login
│   │   ├── registro/+Page.tsx                # Registration
│   │   └── restaurar-contrasena/+Page.tsx    # Password reset flow
│   │
│   ├── admin/                                # Protected Admin Dashboard
│   │   ├── +Layout.tsx                       # Admin guard + sidebar layout
│   │   ├── dashboard/+Page.tsx               # KPI Command Center
│   │   ├── usuarios/+Page.tsx                # User Management (DataGrid)
│   │   ├── verificacion/+Page.tsx            # Identity Verification Queue
│   │   └── apendice-costos/+Page.tsx         # Cost Appendix Management
```

### 📂 PROJECT STRUCTURE

- `@src/styles/`: [**STRICT**] Centralized SCSS (kebab-case). Global typography and variables.
- `@src/emotion/`: Emotion cache factory (`createEmotionCache.ts`) shared by Vike `+onRenderHtml` / `+onRenderClient` for MUI SSR and hydration.
- `@src/features/`: Complex, business-logic-heavy modules (e.g., quotes, dashboard).
- `@src/components/`: Pure, reusable UI components (Buttons, Inputs, Layouts).
- `@src/services/`: API and Firebase service layers.
- `@src/stores/`: Global state management (Zustand).
- `pages/`: Vike filesystem routing.

### 🧭 DIRECTORY MAP

```text
/
├── pages/                            # Vike Routing (Filesystem-based)
│   ├── (app)/                        # Route Group: Authenticated App
│   │   ├── +Layout.tsx               # App Shell (Sidebar + Navbar)
│   │   ├── +guard.ts                 # Auth Guard Configuration
│   │   ├── portal-servicios/         # [HYBRID] Service marketplace
│   │   ├── perfil/                   # [HYBRID] User profiles
│   │   │   ├── +Page.tsx             # Profile component
│   │   │   └── +route.ts             # Dynamic route param logic
│   │   │   ├── +Page.tsx                     # User's own profile
│   │   │   ├── @id/+Page.tsx                 # Vanity URL profile
│   │   │   └── +route.ts                     # Route resolver
│   │   │
│   │   ├── ajustes/
│   │   │   ├── +Page.tsx                     # Settings grid
│   │   │   └── @id/+Page.tsx                 # [OPTIONAL] Admin edit
│   │   │
│   │   ├── cotizar/                          # Quote/Budget flow
│   │   │   ├── +Page.tsx
│   │   │   ├── editar/@id/+Page.tsx
│   │   │   └── ver/@id/+Page.tsx
│   │   │
│   │   ├── requerimiento/                    # Requirements components/utils
│   │   ├── editar-requerimiento/@draftId/    # Edit Requirement
│   │   ├── ver-requerimiento/@draftId/       # View Requirement
│   │   │
│   │   ├── mensajes/+Page.tsx                # Sendbird Chat integration
│   │   ├── notificaciones/+Page.tsx
│   │   ├── portal-servicios/+Page.tsx
│   │   ├── directorio-requerimientos/+Page.tsx
│   │   ├── historial-servicios/+Page.tsx     # [NEW] Service history & status
│   │   ├── biblioteca/+Page.tsx
│   │   ├── calificaciones/+Page.tsx          # [NEW] Contract-gated ratings
│   │   ├── certificaciones/+Page.tsx
│   │   ├── contratacion/+Page.tsx
│   │   ├── contratar/+Page.tsx               # [NEW] Contract creation
│   │   ├── proyecto/+Page.tsx
│   │   ├── suscripciones/+Page.tsx
│   │   ├── formas-pago/+Page.tsx             # [NEW] Payment methods (ePayco)
│   │   ├── invitar-amigos/+Page.tsx
│   │   ├── cambiar-clave/+Page.tsx
│   │   ├── configuracion-privacidad/+Page.tsx # [NEW] Privacy toggles
│   │   └── asesorias/+Page.tsx               # [NEW] Advisory Q&A
│   │   │
│   │   └── _error/+Page.tsx                  # Error page
│   │
│   ├── src/
│   │   ├── components/                       # Atomic Design
│   │   │   ├── atoms/                        # Basic UI elements
│   │   │   ├── molecules/                    # Combined atoms
│   │   │   ├── organisms/                    # Complex components
│   │   │   └── templates/                    # Page templates
│   │   │
│   │   ├── features/                         # Feature modules
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── budget/
│   │   │   ├── chat/
│   │   │   └── requirements/
│   │   │
│   │   ├── services/                         # Service Layer
│   │   │   ├── firebase/
│   │   │   ├── firestore/
│   │   │   └── sendbird/
│   │   │
│   │   ├── hooks/                            # Custom hooks
│   │   ├── stores/                           # [REFACTOR] RxJS state
│   │   ├── types/                            # [NEW] Shared TypeScript types
│   │   ├── assets/                           # [KEEP] Static assets
│   │   ├── fonts/                            # [KEEP] Local fonts
│   │   └── styles/                           # [NEW] Global styles
│   │
│   ├── server/                               # [KEEP] Express server
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
```

## Workflow

### Development

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server on :3000
```

### Build & Deploy

```bash
pnpm build      # Build for production
pnpm preview    # Preview build locally
git push        # Auto-deploys to Vercel
```

If the Vite build runs out of memory on large bundles, use a higher heap (example):

```bash
NODE_OPTIONS=--max-old-space-size=8192 pnpm build
```

### MUI, Emotion, and SSR (Vike)

- **Single theme surface**: `pages/PageShell.tsx` wraps the tree with `ThemeProvider`, `CssBaseline`, `PageContextProvider`, and `UserAuthProvider`. App and admin layouts should not add a second `ThemeProvider` or duplicate auth providers.
- **Emotion cache**: `src/emotion/createEmotionCache.ts` defines a stable cache key (`mui`) and `prepend: true`. The server creates a per-request cache; the client uses `getClientEmotionCache()` so hydration matches the server markup.
- **Critical CSS**: `pages/+onRenderHtml.tsx` wraps the SSR tree in Emotion’s `CacheProvider`, uses `createEmotionServer` + `extractCriticalToChunks` / `constructStyleTagsFromChunks`, and injects the resulting `<style>` tags in `<head>` **after** the Bootstrap CDN link so MUI `sx` / component styles win where both apply.
- **Client**: `pages/+onRenderClient.tsx` wraps the same structure with `CacheProvider` using the client singleton cache.
- **Vite SSR**: `vite.config.ts` → `ssr.noExternal` (when `NODE_ENV === 'production'`) bundles packages that Node cannot load cleanly as externals (including **MUI**, **Emotion**, Sendbird UIKit, `firebase`, `date-fns`, `zustand`, etc.). Without MUI/Emotion in this list, Vercel SSR can fail with ESM directory-import errors under `@mui/utils`. Other deps stay listed for CJS interop or Vite transforms.
- **Dependency alignment**: `package.json` → `pnpm.overrides` pins `@mui/system` to **6.5.0** so it stays aligned with MUI v6 while using `@mui/x-data-grid` v7 (avoids duplicate incompatible `@mui/system` versions in the lockfile).

Full checklist and diagrams: `[docs/mui-emotion-ssr-vike.md](./docs/mui-emotion-ssr-vike.md)`.

**MUI v9**: A major bump requires a dedicated migration (Grid v2, system props on `sx`, icons/slots, Data Grid v9). This repo intentionally stays on MUI v6 + Data Grid v7 until that work is scheduled.

### RAG Chatbot — Knowledge Seeding

```bash
# Seed from web scraping (Firecrawl → Supabase)
pnpm dlx tsx scripts/seed.ts

# Seed from knowledge files (knowledge/*.md → Supabase)
pnpm dlx tsx scripts/seed-knowledge.ts
```

## RAG Chatbot Architecture

The app includes an AI-powered chatbot ("Asistente Dezzpo") for context-aware Q&A.

### Stack


| Layer          | Technology                    | Details                                |
| -------------- | ----------------------------- | -------------------------------------- |
| **LLM**        | Gemini 2.5 Flash              | `@ai-sdk/google` via AI SDK            |
| **Embeddings** | gemini-embedding-001          | 3072d → truncated to 768d (Matryoshka) |
| **Vector DB**  | Supabase pgvector             | `dezzpo_documents` table, HNSW index   |
| **Server**     | Hono API route                | `POST /api/v1/chat` (generateText)     |
| **Frontend**   | Native fetch + ReadableStream | `ChatWidget.tsx` → Zustand             |


### How It Works

1. User sends message → `ChatWidget` POSTs to `/api/v1/chat`
2. Server embeds query with `gemini-embedding-001` (768d)
3. Supabase RPC `match_dezzpo_documents` finds relevant chunks (pathname-filtered + global)
4. System prompt + context injected → Gemini 2.5 Flash generates response
5. Response returned as plain text to widget

### Knowledge System

- `**knowledge/dezzpo-core.md`**: Editable business knowledge. Each `##` section = 1 chunk.
- `**scripts/seed-knowledge.ts**`: Reads `knowledge/*.md`, embeds, inserts to Supabase.
- `**scripts/seed.ts**`: Firecrawl scrapes site, chunks, embeds, inserts to Supabase.
- Knowledge entries are tagged `source: 'knowledge/*'` and can be re-seeded independently.

### Environment Variables (Required)


| Variable                                | Purpose                                     |
| --------------------------------------- | ------------------------------------------- |
| `VITE_APP_SUPABASE_PROJECT_URL`         | Supabase project URL                        |
| `VITE_APP_SUPABASE_SECRET_KEY`          | Supabase service role key                   |
| `VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key                              |
| `VITE_APP_FIRECRAWL_API_KEY`            | Firecrawl API key (for seed.ts)             |
| `VITE_APP_EPAYCO_PUBLIC_KEY`            | ePayco public key (checkout)                |
| `VITE_APP_EPAYCO_PRIVATE_KEY`           | ePayco private key (server-side signatures) |
| `VITE_APP_PAYCO_TEST`                   | ePayco test mode (`true`/`false`)           |


## Smart Contract & Payment Flow

The marketplace connects Propietarios (clients) and Comerciantes (providers) through a contract-based payment system using **ePayco** (Colombian payment gateway).

### Contract Lifecycle

```
pending_payment → active (after payment) → completed → disputed
```

### Flow

1. **Negotiation** (`/app/ver-requerimiento/@draftId`): Propietario reviews quotations and edits the agreed amount.
2. **Contract Creation** (`/app/contratar`): Creates a Firestore `contracts` document with `status: 'pending_payment'`.
3. **Payment** (`/app/contratacion?contractId=XYZ`): Fetches contract summary, calls server-side `/api/v1/payment/signature` for ePayco cryptographic signature, opens ePayco Standard Checkout.
4. **Wallet** (`/app/formas-pago`): Role-adaptive view — Propietarios see pending payments, Comerciantes see earnings summary.

### Contract Schema

```typescript
interface ContractFirestoreDocument {
    contractId?: string
    draftId: string
    clientId: string
    providerId: string
    quotationId: string
    status: 'pending_payment' | 'active' | 'completed' | 'disputed'
    createdAt: string
    agreedAmount: number
    objectDescription?: string
    rated?: boolean
}
```

### Payment API


| Route                       | Method | Purpose                                                             |
| --------------------------- | ------ | ------------------------------------------------------------------- |
| `/api/v1/payment/signature` | POST   | Server-side ePayco signature generation (MD5 hash with private key) |


### ePayco Integration

- **SDK**: Loaded from CDN (`checkout.epayco.co/checkout.js`)
- **Signature**: `md5(custId^privateKey^invoice^amount^currency)` — generated server-side only
- **Test Mode**: Controlled by `VITE_APP_PAYCO_TEST` env var

## Migration Status


| Module                  | Status        | Notes                                                                                 |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------- |
| **Auth**                | ✅ Migrated    | Uses `@features/auth`, `useAuth` hook, strictly typed                                 |
| **Profile**             | ✅ Migrated    | Uses `@features/profile`, `userService`, Zustand store                                |
| **Quotes**              | ✅ Migrated    | Uses `@features/quotes`, `quotationService`, `draftService`                           |
| **CSS Standardization** | ✅ Migrated    | Enforced `kebab-case`, asset class mapping in place                                   |
| **Admin Control Tower** | ✅ Implemented | `useAdminGuard`, KPI dashboard (Recharts), User DataGrid, Identity verification queue |
| **React 19 & TS 6.0**   | ✅ Migrated    | Fully upgraded to React 19, cleaned up all useMemo/forwardRef hooks, and resolved all TS 6.0 deprecations |


## Service Standards

All new services must strictly adhere to the `ServiceResponse<T>` pattern to ensure robust error handling and type safety.

```typescript
// Standard Response Pattern
export type ServiceResponse<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ServiceErrorInfo };

// Example Usage
async function getProfile(id: string): Promise<ServiceResponse<UserProfile>> {
  // ... implementation
}
```

## CSS & Typography Guide

### Naming Convention

Use `kebab-case` for all SCSS classes. `camelCase` is forbidden.

```tsx
// ✅ Correct
<div className={styles['main-container']} />

// ❌ Forbidden
<div className="mainContainer" />
```

### Typography System

Located in `src/styles/components/_typography.scss`.


| Class                 | Size        | Use Case            |
| --------------------- | ----------- | ------------------- |
| `.type-hero-title`    | 60px → 32px | Hero/landing titles |
| `.type-section-title` | 36px → 24px | Section headers     |
| `.type-card-title`    | 24px → 18px | Card titles         |
| `.type-body-lg`       | 18px → 16px | Lead paragraphs     |
| `.type-body`          | 16px → 14px | Standard content    |
| `.type-caption`       | 14px → 12px | Captions/metadata   |


**Fluid Typography Mixin:**

```scss
@include fluid-type(16px, 24px); // Scales 16px→24px between mobile/desktop
```

### Text Variants


| Class                 | Style                |
| --------------------- | -------------------- |
| `.text-bold`          | `font-weight: 700`   |
| `.text-italic`        | `font-style: italic` |
| `.text-underline`     | Underlined text      |
| `.text-strikethrough` | Line-through         |


### Contrast Classes


| Class             | Use Case                               |
| ----------------- | -------------------------------------- |
| `.text-on-light`  | Dark text on white/cream backgrounds   |
| `.text-on-dark`   | White text on dark backgrounds         |
| `.opacidad-negro` | Dark overlay box for image backgrounds |


### Button System

Located in `src/styles/components/_buttons.scss`.


| Class                    | Style                 | Use Case                       |
| ------------------------ | --------------------- | ------------------------------ |
| `.btn-primary-gradient`  | Teal-to-blue gradient | Main CTAs (Siguiente, Guardar) |
| `.btn-secondary-outline` | Transparent + border  | Secondary (Volver, Cancelar)   |
| `.btn-icon-action`       | Solid teal + icon     | PUBLICAR, CHAT EN VIVO         |
| `.btn-floating-action`   | Purple + shadow       | Asísteme sticky bar            |


### Dev Reference

View live typography samples at `/dev/typography`.

## Vite, Vike server, and Vercel

- **Vite 8** is the build tool (`vite`, `@vitejs/plugin-react-swc`). Follow [Vite migration](https://vite.dev/guide/migration) when upgrading.
- **Vike** uses **`pages/+server.ts`**: Hono app, custom API routes registered **before** `vike(app)`, then `export default { fetch: app.fetch, prod?: { port, onReady } } satisfies Server` per [Vike +server](https://vike.dev/server) and [Migration from vike-photon](https://vike.dev/migration/server). Use **`@vikejs/hono`** only (not `vike-photon` / `@photonjs/*`).
- **Vercel**: **`vite-plugin-vercel`** — `import { vercel } from 'vite-plugin-vercel/vite'` and register `vercel()` after `vike({})` (and after `@vitejs/plugin-react-swc`) in `vite.config.ts` per [Deploy > Vercel](https://vike.dev/vercel).
- **Scripts**: `pnpm dev` runs **`vite`** (Vike dev server + HMR for `pages/+server.ts`). Production bundle: `pnpm build`; run the built SSR app locally: `pnpm prod` (`vike build && vike preview`).
- **Typecheck**: `pages/+server.ts` is covered by `tsconfig.json` → `include` (`pages/**/*.ts`).

Full reference: [`docs/server-stack-vike.md`](./docs/server-stack-vike.md).

## Server Architecture Notes

- **API routes MUST be defined BEFORE `vike(app)`** in `pages/+server.ts`. The Vike middleware is a catch-all; anything registered after it never runs.
- **Static imports only** for API handlers — dynamic imports fail on Vercel's bundled output.
- **`dotenv/config`** is imported at the top of `pages/+server.ts` for local env loading.
- **`VITE_APP_*` env vars** are bridged to standard names in `server/api/chat.ts`.
- **Registered API routes:**
  - `POST /api/v1/chat` — RAG chatbot (Gemini + Supabase pgvector)
  - `POST /api/v1/payment/signature` — ePayco payment signature generation

## Legal

Developed by **Dezzpo Inc.** | [Website](https://www.dezzpo.com/)