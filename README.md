# Comunidad Dezzpo

Professional network for real estate maintenance, remodeling, and finishes. We connect qualified professionals with users through a trusted marketplace.

**Coding agents:** start from the repo root [`AGENTS.md`](./AGENTS.md); nested [`pages/(marketing)/AGENTS.md`](./pages/(marketing)/AGENTS.md), [`pages/(app)/AGENTS.md`](./pages/(app)/AGENTS.md), and [`pages/admin/AGENTS.md`](./pages/admin/AGENTS.md) add route-group rules. MUI + Emotion + Vike SSR: [`docs/mui-emotion-ssr-vike.md`](./docs/mui-emotion-ssr-vike.md). Server (+server, Vercel, Vite): [`docs/server-stack-vike.md`](./docs/server-stack-vike.md). Testing Architecture: [`docs/testing-architecture.md`](./docs/testing-architecture.md).

## Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Framework** | [Vike v0.4.x](https://vike.dev/) | SSR/SSG with filesystem routing |
| **UI** | React 19 + MUI v6 | `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid` v7 |
| **Styling** | Emotion 11 + SCSS Modules | `@emotion/react`, `@emotion/styled`, `@emotion/server` for SSR |
| **State** | Zustand 5 | Atomic selectors, `userStore`, `chatStore` |
| **Auth** | Firebase Auth | Google SSO + Email/Password |
| **Database** | Firebase Firestore | User collections, contracts, drafts, quotations |
| **Storage** | Firebase Storage | Profile images, documents, portfolios |
| **Server** | Hono + `@vikejs/hono` | `pages/+server.ts` ([Vike +server](https://vike.dev/server)) |
| **AI/RAG** | Gemini 2.5 Flash | `@ai-sdk/google` via AI SDK + Supabase pgvector |
| **Messaging** | Sendbird Chat v4 + UIKit v3 | Real-time messaging, channel orchestration |
| **Payments** | ePayco | Colombian payment gateway, server-side signatures |
| **Build** | Vite 8 + SWC | `@vitejs/plugin-react-swc` |
| **TypeScript** | v6.x | Zero `any` policy, `ServiceResponse<T>` pattern |
| **Testing** | Vitest + Playwright | 3-Layer Testing Pyramid (`tests/` directory) |
| **Deployment** | Vercel | Serverless Functions, custom Node→Web adapter |
| **Package Manager** | pnpm 10 | **Mandatory** — never use npm or npx |

### 🛠️ External Providers

| Provider | Purpose | Initialization Dependency |
|----------|---------|---------------------------|
| **Firebase Auth** | Identity & Session | Global `AuthProvider` |
| **Google Auth** | SSO Provider | Firebase Client SDK |
| **Sendbird** | Real-time Messaging | Authenticated UID (Auth-only). Orchestration via `@services/sendbird/sendbird.service.ts` |
| **ePayco** | Payment Processing | Server-side signature generation via `/api/v1/payment/signature` |
| **Supabase** | Vector DB (pgvector) | RAG chatbot embeddings + document matching |

### 🚦 Routing & Access Control

The project uses a **Tiered Access Model**:

1. **Public (Marketing):** Unrestricted access — SSR/SSG prerendered.
2. **Hybrid (App Guest):** Accessible by anyone with App Shell. UI adapts to auth state.
   - `/app/portal-servicios`
   - `/app/directorio-requerimientos`
   - `/app/ver-requerimiento/[id]`
   - `/app/suscripciones`
   - `/app/perfil/[id]` (Public View)
3. **Strict (App Auth):** Requires valid session (e.g., `/app/mensajes`, `/app/ajustes`).
4. **Admin (Custom Claims):** Requires `claims.admin === true` via Firebase custom claims.
   - `/admin/dashboard` — KPI Command Center + Monetization Analytics
   - `/admin/usuarios` — User Management (DataGrid)
   - `/admin/verificacion` — Identity Verification Queue
   - `/admin/certificaciones` — Certification Requests Evaluation Queue
   - `/admin/contratos` — Contract Management
   - `/admin/requerimientos` — Requirements Overview
   - `/admin/referidos` — Referral Program Auditing & Metrics
   - `/admin/notificaciones` — Platform-Wide Broadcast Workbench

## Project Structure

```
comunidad-dezzpo/
├── pages/
│   ├── +config.ts                            # Global Vike v1 config
│   ├── +Layout.tsx                           # Root layout wrapper
│   ├── +onRenderHtml.tsx                     # SSR + Emotion critical CSS → <head>
│   ├── +onRenderClient.tsx                   # CSR/hydration + Emotion CacheProvider
│   ├── +server.ts                            # Hono + @vikejs/hono (API then vike(app))
│   ├── PageShell.tsx                         # ThemeProvider, CssBaseline, auth, page context
│   │
│   ├── (marketing)/                          # Route Group: Marketing (SSR/SSG)
│   │   ├── +Layout.tsx                       # Marketing layout (header/footer)
│   │   ├── +Page.tsx                         # Homepage with QuickMatch search
│   │   ├── @service/@zone/                   # Dynamic /{service-slug}/{zone} routes
│   │   ├── nosotros/                         # About us
│   │   ├── contactenos/                      # Contact
│   │   ├── asi-trabajamos/                   # How it works
│   │   ├── comunidad-comerciantes/           # For Professionals
│   │   ├── comunidad-propietarios/           # For Property Owners
│   │   ├── presupuestos/                     # Request services
│   │   ├── ayuda-pqrs/                       # Help center & FAQ (AI chatbot)
│   │   ├── legal/                            # Legal documents
│   │   ├── blog/                             # Blog
│   │   ├── comerciante/@slug/                # Public merchant profiles
│   │   ├── profesionales-servicios/          # Directory landing
│   │   ├── nuevo-proyecto/                   # New project wizard
│   │   ├── calificaciones/                   # Ratings page
│   │   ├── apendice-costos/                  # Cost appendix
│   │   ├── patrocinadores/                   # Sponsors
│   │   ├── prensa/                           # Press
│   │   └── dev/typography/                   # Design system reference
│   │
│   ├── (auth)/                               # Route Group: Authentication
│   │   ├── +Layout.tsx                       # Auth layout (centered card)
│   │   ├── ingreso/+Page.tsx                 # Login
│   │   ├── registro/+Page.tsx                # Registration
│   │   └── restaurar-contrasena/+Page.tsx    # Password reset flow
│   │
│   ├── (app)/                                # Route Group: App Shell
│   │   ├── +Layout.tsx                       # App Shell (Sidebar + Navbar + ChatWidget)
│   │   ├── +guard.ts                         # Auth guard (with hybrid whitelist)
│   │   ├── portal-servicios/                 # [HYBRID] Service marketplace
│   │   ├── directorio-requerimientos/        # [HYBRID] Requirements directory
│   │   ├── ver-requerimiento/@draftId/       # [HYBRID] View requirement
│   │   ├── suscripciones/                    # [HYBRID] Subscriptions
│   │   ├── perfil/@id/                       # [HYBRID] User profiles
│   │   ├── mensajes/                         # Sendbird Chat
│   │   ├── cotizar/                          # Quote flow
│   │   ├── editar-requerimiento/@draftId/    # Edit requirement
│   │   ├── ajustes/                          # Settings
│   │   ├── contratacion/                     # Contract + payment
│   │   ├── contratar/                        # Contract creation
│   │   ├── formas-pago/                      # Payment methods (role-adaptive)
│   │   ├── calificaciones/                   # Contract-gated ratings
│   │   ├── historial-servicios/              # Service history & status
│   │   ├── certificaciones/                  # Certifications
│   │   ├── biblioteca/                       # Library
│   │   ├── notificaciones/                   # Notifications
│   │   ├── proyecto/                         # Projects
│   │   ├── requerimiento/                    # Requirements
│   │   ├── asesorias/                        # Advisory Q&A
│   │   ├── invitar-amigos/                   # Referral Program Dashboard (gamified)
│   │   ├── mis-inmuebles/                    # Multi-property management (Propietarios)
│   │   ├── cambiar-clave/                    # Password change
│   │   └── configuracion-privacidad/         # Privacy settings
│   │
│   ├── admin/                                # Admin Control Tower
│   │   ├── +Layout.tsx                       # Admin guard + sidebar
│   │   ├── dashboard/+Page.tsx               # KPI cards + Recharts + Monetization
│   │   ├── usuarios/+Page.tsx                # MUI DataGrid + live classification editor
│   │   ├── verificacion/+Page.tsx            # Identity verification queue
│   │   ├── certificaciones/+Page.tsx         # Certification requests queue
│   │   ├── referidos/+Page.tsx               # Referral program audit & metrics
│   │   ├── notificaciones/+Page.tsx           # Mass broadcast workbench
│   │   ├── blog/+Page.tsx                    # Blog & Content management workbench
│   │   ├── contratos/                        # Contract management
│   │   └── requerimientos/                   # Requirements overview
│   │
│   └── _error/                               # Error page
│
├── server/
│   └── api/
│       ├── chat.ts                           # RAG chatbot (Gemini + Supabase)
│       ├── payment/
│       │   ├── signature.ts                  # ePayco signature generation
│       │   └── confirmation.ts               # ePayco payment confirmation
│       └── notifications/
│           └── email.ts                      # Email notifications
│
├── src/
│   ├── assets/
│   │   └── data/
│   │       ├── ListadoCategorias.tsx          # Service categories constant
│   │       ├── ListadoZonas.ts               # Centralized geographic zones
│   │       └── CategoryIcons.tsx             # Category icon mappings
│   │
│   ├── components/                           # Shared UI Components
│   │   ├── common/                           # Common elements
│   │   ├── layout/                           # Layout components
│   │   ├── molecules/                        # Composed components
│   │   └── dev/                              # Dev-only components
│   │
│   ├── features/                             # Feature Modules
│   │   ├── admin/                            # Admin dashboard components
│   │   ├── auth/                             # Auth flows
│   │   ├── chat/                             # AI ChatWidget
│   │   ├── marketing/                        # Marketing components (QuickMatch, etc.)
│   │   ├── messaging/                        # Sendbird messaging
│   │   ├── profile/                          # User profiles
│   │   ├── projects/                         # Project management
│   │   └── quotes/                           # Quotation system
│   │
│   ├── services/                             # Data Layer
│   │   ├── admin/                            # Admin-only service (stats, users, verification)
│   │   ├── contracts/                        # Contract CRUD
│   │   ├── drafts/                           # Draft requirements
│   │   ├── firebase/                         # Firebase client SDK init
│   │   ├── quotations/                       # Quotation management
│   │   ├── search/                           # Search service
│   │   ├── sendbird/                         # Channel orchestration
│   │   ├── users/                            # User profiles
│   │   ├── referralService.ts                # Referral code gen, attribution, points, rewards
│   │   └── utils/                            # Service utilities
│   │
│   ├── hooks/                                # Shared Hooks
│   │   ├── useAuth.ts                        # Auth state hook
│   │   ├── useAdminGuard.ts                  # Firebase custom claims check
│   │   ├── useFirestoreQuery.ts              # Generic Firestore query hook
│   │   ├── useGoogleMaps.ts                  # Google Maps integration
│   │   ├── useLocalStorage.ts                # localStorage hook
│   │   ├── useShareAction.ts                 # Share/copy action
│   │   ├── useReferralTracker.ts             # Captures ?ref= URL params globally
│   │   └── usePageContext.tsx                # Vike page context
│   │
│   ├── stores/                               # Zustand Stores
│   │   ├── userStore.ts                      # User auth/profile state
│   │   └── chatStore.ts                      # ChatWidget open/close state
│   │
│   ├── emotion/                              # Emotion cache factory
│   ├── config/                               # App configuration (pricing, referrals, theme)
│   ├── providers/                            # React providers
│   ├── styles/                               # Global SCSS styles
│   ├── types/                                # Shared TypeScript types
│   ├── utilities/                            # Utility functions
│   └── fonts/                                # Local fonts
│
├── scripts/
│   ├── generate-sitemap.ts                   # Sitemap generator (uses @assets/data/ListadoZonas)
│   ├── patch-vercel-entry.mjs                # Post-build: patches dist/server/entry.mjs
│   ├── seed.ts                               # Firecrawl scraper → Supabase embeddings
│   ├── seed-knowledge.ts                     # Knowledge .md → Supabase embeddings
│   ├── setAdminClaim.ts                      # One-time admin setup
│   ├── migrate-comerciante-slugs.ts          # Slug migration utility
│   └── supabase-schema.sql                   # Vector DB schema
│
├── knowledge/                                # RAG chatbot knowledge base
│   └── dezzpo-core.md                        # Editable business info (## = chunk)
│
├── docs/
│   ├── mui-emotion-ssr-vike.md               # MUI + Emotion SSR deep-dive
│   ├── server-stack-vike.md                  # Server architecture reference
│   └── testing-architecture.md              # Testing pyramid & conventions
│
├── tests/                                    # Automated test pyramid
│   ├── setup.ts                              # Vitest global setup (RTL + Zustand mock factory)
│   ├── unit/                                 # Layer 1: Isolated unit tests
│   │   ├── stores/                           # Zustand store tests
│   │   ├── services/                         # Service layer tests (payment, referral)
│   │   └── features/                         # Component tests (SearchBar, NuevoProyecto)
│   ├── integration/                          # Layer 2: Cross-boundary integration tests
│   │   ├── auth/                             # Guard whitelist & redirect tests
│   │   ├── projects/                         # Form lifecycle tests
│   │   └── search/                           # QuickMatch fallback tests
│   └── e2e/                                  # Layer 3: Playwright browser tests
│       ├── pom/                              # Page Object Models (AuthPage)
│       ├── auth/                             # Login, registration, password reset
│       ├── projects/                         # New project creation flow
│       ├── search/                           # Homepage search flow
│       └── happy-paths/                      # Critical route smoke tests
│
├── vite.config.ts
├── vitest.config.ts                          # Vitest config (jsdom, coverage thresholds)
├── playwright.config.ts                      # Playwright config (browsers, dev server)
├── tsconfig.json
└── package.json
```

## Workflow

### Development

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server on :3000
```

### Build & Deploy

```bash
pnpm build      # Build for production (vike build + patch-vercel-entry + generate-sitemap)
pnpm preview    # Preview build locally
git push        # Auto-deploys to Vercel
```

If the Vite build runs out of memory on large bundles:

```bash
NODE_OPTIONS=--max-old-space-size=8192 pnpm build
```

### Testing

See [docs/testing-architecture.md](./docs/testing-architecture.md) for the complete architecture guide and threat matrix.

```bash
# Unit + Integration + Property Tests (Vitest + Fast-Check)
pnpm test                         # Run unit, property, and component tests
pnpm test:coverage                # Run with V8 coverage report (80% threshold)
pnpm test:watch                   # Vitest watch mode

# Security Rules Integration (Firebase Local Emulator Suite)
pnpm test:emulators               # Runs firestore.rules.test.ts and storage.rules.test.ts against emulators

# E2E & Accessibility (Playwright + axe-core)
pnpm test:e2e                     # Run Playwright multi-browser E2E suite
pnpm test:e2e:ui                  # Interactive Playwright UI mode
pnpm exec playwright test tests/e2e/a11y/ # Run WCAG 2.1 AA accessibility audit

# Mutation Testing (StrykerJS)
pnpm test:stryker                 # Run mutation testing on src/services/**/*.ts

# CI/CD Quality Gate
pnpm lint:gate                    # Zero ESLint warnings gate
```

### Type Checking

```bash
pnpm typecheck  # tsc --noEmit (covers pages/, src/, server/, scripts/)
```

### MUI, Emotion, and SSR (Vike)

- **Single theme surface**: `pages/PageShell.tsx` wraps the tree with `ThemeProvider`, `CssBaseline`, `PageContextProvider`, and `UserAuthProvider`. App and admin layouts should not add a second `ThemeProvider` or duplicate auth providers.
- **Emotion cache**: `src/emotion/createEmotionCache.ts` defines a stable cache key (`mui`) and `prepend: true`. The server creates a per-request cache; the client uses `getClientEmotionCache()` so hydration matches the server markup.
- **Critical CSS**: `pages/+onRenderHtml.tsx` wraps the SSR tree in Emotion's `CacheProvider`, uses `createEmotionServer` + `extractCriticalToChunks` / `constructStyleTagsFromChunks`, and injects the resulting `<style>` tags in `<head>` **after** the Bootstrap CDN link so MUI `sx` / component styles win where both apply.
- **Client**: `pages/+onRenderClient.tsx` wraps the same structure with `CacheProvider` using the client singleton cache.
- **Vite SSR**: `vite.config.ts` → `ssr.noExternal` (when `NODE_ENV === 'production'`) bundles packages that Node cannot load cleanly as externals (including **MUI**, **Emotion**, Sendbird UIKit, `firebase`, `date-fns`, `zustand`, etc.). Without MUI/Emotion in this list, Vercel SSR can fail with ESM directory-import errors under `@mui/utils`. Other deps stay listed for CJS interop or Vite transforms.
- **Dependency alignment**: `package.json` → `pnpm.overrides` pins `@mui/system` to **6.5.0** so it stays aligned with MUI v6 while using `@mui/x-data-grid` v7 (avoids duplicate incompatible `@mui/system` versions in the lockfile).

Full checklist and diagrams: [`docs/mui-emotion-ssr-vike.md`](./docs/mui-emotion-ssr-vike.md).

**MUI v9**: A major bump requires a dedicated migration (Grid v2, system props on `sx`, icons/slots, Data Grid v9). This repo intentionally stays on MUI v6 + Data Grid v7 until that work is scheduled.

## RAG Chatbot Architecture

The app includes an AI-powered chatbot ("Asistente Dezzpo") for context-aware Q&A.

### Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **LLM** | Gemini 2.5 Flash | `@ai-sdk/google` via AI SDK |
| **Embeddings** | gemini-embedding-001 | 3072d → truncated to 768d (Matryoshka) |
| **Vector DB** | Supabase pgvector | `dezzpo_documents` table, HNSW index |
| **Server** | Hono API route | `POST /api/v1/chat` (generateText) |
| **Frontend** | Native fetch + ReadableStream | `ChatWidget.tsx` → Zustand |

### How It Works

1. User sends message → `ChatWidget` POSTs to `/api/v1/chat`
2. Server embeds query with `gemini-embedding-001` (768d)
3. Supabase RPC `match_dezzpo_documents` finds relevant chunks (pathname-filtered + global)
4. System prompt + context injected → Gemini 2.5 Flash generates response
5. Response returned as plain text to widget

### Knowledge Seeding

```bash
# Seed from knowledge files (knowledge/*.md → Supabase)
pnpm dlx tsx scripts/seed-knowledge.ts

# Seed from web scraping (Firecrawl → Supabase)
pnpm dlx tsx scripts/seed.ts
```

### Knowledge System

- **`knowledge/dezzpo-core.md`**: Editable business knowledge. Each `##` section = 1 chunk.
- **`scripts/seed-knowledge.ts`**: Reads `knowledge/*.md`, embeds, inserts to Supabase.
- **`scripts/seed.ts`**: Firecrawl scrapes site, chunks, embeds, inserts to Supabase.
- Knowledge entries are tagged `source: 'knowledge/*'` and can be re-seeded independently.

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
4. **Confirmation** (`/api/v1/payment/confirmation`): Server-side webhook receives ePayco payment result.
5. **Wallet** (`/app/formas-pago`): Role-adaptive view — Propietarios see pending payments, Comerciantes see earnings summary.

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

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/payment/signature` | POST | Server-side ePayco signature generation (MD5 hash with private key) |
| `/api/v1/payment/confirmation` | POST | ePayco payment confirmation webhook |
| `/api/v1/notifications/email` | POST | Email notification service |

## Geographic Coverage

All geographic zones are centralized in [`src/assets/data/ListadoZonas.ts`](./src/assets/data/ListadoZonas.ts).

**Coverage**: All 20 localities of Bogotá + adjacent metropolitan municipalities:
- **Bogotá regions**: Bogotá (catch-all), Norte, Sur, Centro, Occidente
- **Localities**: Suba, Usaquén, Chapinero, Teusaquillo, Kennedy, Engativá, Fontibón, Barrios Unidos, Bosa, Puente Aranda, Los Mártires, Santa Fe, San Cristóbal, Usme, Tunjuelito, Antonio Nariño, La Candelaria, Rafael Uribe Uribe, Ciudad Bolívar, Sumapaz
- **Metropolitan**: Soacha, Chía, Cajicá, Zipaquirá, Cota, Funza, Mosquera, Madrid, Facatativá, La Calera, Sopó

**Consumers**: `generate-sitemap.ts`, `QuickMatch.tsx`, `+onBeforePrerenderStart.ts`, `+data.ts`, `adminService.ts`

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `VITE_APP_FIREBASE_*` | Client + Server | Firebase configuration |
| `VITE_APP_SUPABASE_PROJECT_URL` | Server | Supabase project URL |
| `VITE_APP_SUPABASE_SECRET_KEY` | Server | Supabase service role key |
| `VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY` | Server | Gemini API key |
| `VITE_APP_FIRECRAWL_API_KEY` | Server | Firecrawl API key (for seed.ts) |
| `VITE_APP_EPAYCO_PUBLIC_KEY` | Client + Server | ePayco checkout initialization |
| `VITE_APP_EPAYCO_PRIVATE_KEY` | Server ONLY | ePayco signature generation |
| `VITE_APP_PAYCO_TEST` | Server | ePayco test mode (`true`/`false`) |
| `VITE_APP_SENDBIRD_APP_ID` | Client | Sendbird application ID |

## Migration Status

| Module | Status | Notes |
|--------|--------|-------|
| **Auth** | ✅ Migrated | Uses `@features/auth`, `useAuth` hook, strictly typed |
| **Profile** | ✅ Migrated | Uses `@features/profile`, `userService`, Zustand store |
| **Quotes** | ✅ Migrated | Uses `@features/quotes`, `quotationService`, `draftService` |
| **CSS Standardization** | ✅ Migrated | Enforced `kebab-case`, SCSS Modules |
| **Admin Control Tower** | ✅ Implemented | `useAdminGuard`, KPI dashboard (Recharts), User DataGrid, Verification queue |
| **Monetization Analytics** | ✅ Implemented | Funnel metrics, geographic density, revenue stats, trust badges |
| **Geographic Centralization** | ✅ Implemented | `ListadoZonas.ts` single source of truth for all zones |
| **React 19 & TS 6.0** | ✅ Migrated | No `forwardRef`, no unnecessary `useMemo`, relative path targets |
| **Contracts & Payments** | ✅ Implemented | ePayco integration, server-side signatures, contract lifecycle |
| **RAG Chatbot** | ✅ Implemented | Gemini 2.5 Flash + Supabase pgvector, knowledge seeding |
| **Referral Program** | ✅ Implemented | Code generation, sign-up attribution, points/rewards, admin audit |
| **Ecosystem Testing** | ✅ Implemented | 100% Local Emulator isolation, Vitest/Fast-Check property tests, Firestore/Storage rules tests, Playwright E2E POMs, StrykerJS mutation, axe-core a11y, GitHub Actions CI/CD |

## Service Standards

All new services must strictly adhere to the `ServiceResponse<T>` pattern:

```typescript
export type ServiceResponse<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ServiceErrorInfo };
```

## CSS & Typography Guide

### Naming Convention

Use `kebab-case` for all SCSS classes. `camelCase` is forbidden.

### Typography System

Located in `src/styles/components/_typography.scss`.

| Class | Size | Use Case |
|-------|------|----------|
| `.type-hero-title` | 60px → 32px | Hero/landing titles |
| `.type-section-title` | 36px → 24px | Section headers |
| `.type-card-title` | 24px → 18px | Card titles |
| `.type-body-lg` | 18px → 16px | Lead paragraphs |
| `.type-body` | 16px → 14px | Standard content |
| `.type-caption` | 14px → 12px | Captions/metadata |

### Dev Reference

View live typography samples at `/dev/typography`.

## Vite, Vike Server, and Vercel

- **Vite 8** is the build tool (`vite`, `@vitejs/plugin-react-swc`). Follow [Vite migration](https://vite.dev/guide/migration) when upgrading.
- **Vike** uses **`pages/+server.ts`**: Hono app, custom API routes registered **before** `vike(app)`, then `export default { fetch: app.fetch, prod?: { port, onReady } } satisfies Server` per [Vike +server](https://vike.dev/server).
- **Vercel**: Custom Node→Web adapter via `scripts/patch-vercel-entry.mjs`. Do **not** use `hono/vercel` `handle()`.
- **Build pipeline**: `pnpm build` runs `vike build && node scripts/patch-vercel-entry.mjs && pnpm exec tsx scripts/generate-sitemap.ts`.
- **Static assets**: `vercel.json` sets `"outputDirectory": "dist/client"` so CSS/JS/images are served from Vercel's CDN.

Full reference: [`docs/server-stack-vike.md`](./docs/server-stack-vike.md).

## Server Architecture Notes

- **API routes MUST be defined BEFORE `vike(app)`** in `pages/+server.ts`. The Vike middleware is a catch-all; anything registered after it never runs.
- **Static imports only** for API handlers — dynamic imports fail on Vercel's bundled output.
- **`dotenv/config`** is imported at the top of `pages/+server.ts` for local env loading.
- **Registered API routes:**
  - `POST /api/v1/chat` — RAG chatbot (Gemini + Supabase pgvector)
  - `POST /api/v1/payment/signature` — ePayco payment signature generation
  - `POST /api/v1/payment/confirmation` — ePayco payment confirmation
  - `POST /api/v1/notifications/email` — Email notifications

## Legal

Developed by **Dezzpo Inc.** | [Website](https://www.dezzpo.com/)