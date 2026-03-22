# AI Agent Constraint Engine

> **CRITICAL**: This file functions as the **System of Record** for all architectural and coding standards. You must adhere to these constraints without exception.

## 1. Strict Architecture Laws

### ⚡ PROVIDER & AUTH CONSTRAINTS

* **Firebase Auth Hydration:** All `/app/*` routes must account for the "Initializing" state. **Forbidden:** Hard-redirecting to `/login` before `onAuthStateChanged` has resolved.
* **Sendbird Initialization:** The Messaging Provider **must not** initialize for anonymous guests. Wrap all Sendbird UI logic (e.g., `Comentarios.tsx`) in an `isAuth` check (`if (!userID)`) to prevent `null` user crashes and saboteur spam.
* **Sendbird Channel Orchestration:** Always use `@services/sendbird/sendbird.service.ts` (`getOrCreateDraftChannel`, `getOrCreateDirectChannel`) to generate or retrieve programmatic Group/Open channels. **Forbidden:** Direct instantiation of the Sendbird Core SDK (`sb.groupChannel.createChannel`) from UI components.
* **Hybrid Access Logic:** Specific `/app/` routes are designated as **Hybrid** (Guest + Auth).
  *   *Whitelisted:* `portal-servicios`, `suscripciones`, `directorio-requerimientos`, `perfil`, `ver-requerimiento`.
  *   *Constraint:* Navigation components (`Sidebar`, `NavBar`) must toggle visibility based on `user.role` or `null` state.

  *   *Constraint:* Navigation components (`Sidebar`, `NavBar`) must toggle visibility based on `user.role` or `null` state.
  *   **SSR Safety:** All components in hybrid routes MUST be SSR-safe.
      *   **Forbidden:** Module-level instantiation of React components (e.g., in data files).
      *   **Forbidden:** Direct usage of `firebase.auth()` in component render paths (use `useUserStore`).

### 🧬 DYNAMIC DATA REQUIREMENTS

* **Profile Hydration:** For `/app/perfil/[id]`, the `id` must be extracted from the Vike `pageContext`.
* **Fetching State:** Implement mandatory loading skeletons for profile data to prevent UI "jerkiness" during Firestore fetches.

### Path Aliases are Mandatory
**NEVER** use relative imports for cross-module dependencies.
**ALWAYS** use the configured path aliases:

- `@features/*` -> Feature internals (e.g., `@features/auth`)
- `@components/*` -> Shared UI components
- `@hooks/*` -> Shared logic
- `@services/*` -> Data layer
- `@stores/*` -> State management
- `@config/*` -> Global configuration

```typescript
// ✅ CORRECT
import { useAuth } from '@hooks/useAuth'

// ❌ FORBIDDEN
import { useAuth } from '../../../hooks/useAuth'
```

### No Legacy Patterns
- **RXJS IS BANNED**: Do not use RxJS Subjects. Use Zustand.
- **NO .jsx FILES**: All new code must be `.tsx` or `.ts`.
- **NO Legacy Wrappers**: Do not use old HOCs or `PageShell` wrappers inside features.

## 2. State Management Rules (Zustand)

### Atomic Selectors
**ALWAYS** use atomic selectors to prevent unnecessary re-renders. **NEVER** return the entire state object.

```typescript
// ✅ CORRECT: Atomic
const displayName = useUserStore((state) => state.displayName)

// ❌ FORBIDDEN: Full State
const { displayName } = useUserStore() 
```

### No Prop Drilling
If data is needed by a deep child, use the store hook directly in that child.

## 3. Type Safety Standards

### Zero `any` Policy
The use of `any` is strictly prohibited. Use `unknown` with type guards or generic constraints.

### Service Response Pattern
All service methods **MUST** return a `ServiceResponse<T>`.

```typescript
export type ServiceResponse<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ServiceErrorInfo }
```

## 4. Context Boundaries

### Marketing Context (`pages/(marketing)`)
- **Focus**: SSR, SEO, Performance.
- **Constraints**: 
  - Prerender enabled (`prerender: true`).
  - Minimal client-side JavaScript.
  - No auth guards blocking render.

### App Context (`pages/(app)`)
- **Focus**: Client-side interactivity, Authentication, User Data.
- **Constraints**:
  - CSR / SPA behavior.
  - strict `+guard.ts` protection.
  - Heavy use of Zustand stores.

### Admin Context (`pages/(admin)`)
- **Focus**: Platform governance, data sovereignty, trust & safety.
- **Constraints**:
  - **Admin Guard**: `useAdminGuard` hook checks `getIdTokenResult().claims.admin === true`. Non-admins are redirected to `/`.
  - **Isolated Bundle**: Admin layout is separate from the main app layout. No Sendbird, no user sidebar.
  - **Firestore Admin Predicate**: `isAdmin()` in Firestore rules grants read/update on user collections.
  - **Never expose admin logic in main app bundle**: Admin service (`@services/admin`) must only be imported within `(admin)/*` pages.

## 5. Visual Guide

### File Structure
### File Structure
```
comunidad-dezzpo/
├── pages/
│   ├── +config.ts                            # Global Vike v1 config
│   ├── +Layout.tsx                           # Root layout wrapper
│   │
│   ├── (marketing)/                          # Route Group: Marketing (SSR/SSG)
│   │   ├── +Layout.tsx
│   │   └── ... (Public pages)
│   │
│   ├── (auth)/                               # Route Group: Authentication
│   │   ├── +Layout.tsx
│   │   └── ... (Login, Register)
│   │
│   ├── (app)/                                # Route Group: Protected App (CSR)
│   │   ├── +Layout.tsx                       # App Shell (Sidebar + Navbar)
│   │   ├── +guard.ts                         # Auth guard
│   │   └── ... (Dashboard, Profile, Quotes)
│   │
│   ├── (admin)/                              # Route Group: Admin Control Tower
│   │   ├── +Layout.tsx                       # Admin guard + sidebar
│   │   ├── agents.md                         # Admin-specific constraints
│   │   ├── dashboard/+Page.tsx               # KPI cards + Recharts
│   │   ├── usuarios/+Page.tsx                # MUI DataGrid + drawer
│   │   └── verificacion/+Page.tsx            # Identity verification queue
│   │
├── src/
│   ├── components/                           # Atomic Design components
│   ├── features/                             # Feature modules
│   ├── services/                             # Data layer
│   │   ├── admin/                            # Admin-only service
│   │   │   ├── adminService.ts               # Stats, users, verification queries
│   │   │   └── index.ts
│   │   ├── firebase/
│   │   └── users/
│   ├── hooks/                                # Shared hooks
│   │   ├── useAuth.ts
│   │   └── useAdminGuard.ts                  # Firebase custom claims check
│   ├── stores/                               # Zustand stores
│   └── styles/                               # Global styles
│
├── scripts/
│   ├── seed.ts                           # Firecrawl scraper → Supabase embeddings
│   ├── seed-knowledge.ts                 # Knowledge .md → Supabase embeddings
│   └── setAdminClaim.ts                  # One-time admin setup
│
├── knowledge/                            # RAG chatbot knowledge base
│   └── dezzpo-core.md                    # Editable business info (## = chunk)
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 6. Sub-Agent Orchestration
This file acts as the primary orchestrator. For specific domain constraints, refer to:
- **Marketing Pages**: [pages/(marketing)/agents.md](pages/(marketing)/agents.md)
- **App/Dashboard**: [pages/(app)/agents.md](pages/(app)/agents.md)
- **Admin Panel**: [pages/(admin)/agents.md](pages/(admin)/agents.md)

## 7. RAG Chatbot Constraints

### Server Routing (CRITICAL)
- **API routes MUST be registered BEFORE `apply(app)`** in `server/index.ts`.
- Vike's `apply()` is a catch-all SSR handler. Routes defined AFTER it are never reached.
- **Static imports only** for API handlers — dynamic `import()` fails on Vercel's bundled output.

### Chat API (`server/api/chat.ts`)
- Uses `generateText()` (not `streamText`) for Vercel/Hono compatibility.
- Model: `gemini-2.5-flash` (free tier: 5 RPM, 20 RPD). Check rate limits before changing.
- Embeddings: `gemini-embedding-001` → truncated from 3072d to 768d (Matryoshka-safe).
- Env bridging: `VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY` → `GOOGLE_GENERATIVE_AI_API_KEY`.
- Supabase RPC: `match_dezzpo_documents` with pathname filtering + global fallback.

### Knowledge System
- **`knowledge/dezzpo-core.md`**: User-editable. Each `##` section = 1 vector chunk.
- **`scripts/seed-knowledge.ts`**: Reads `knowledge/*.md`, embeds, upserts to Supabase.
- Only replaces entries tagged `source: 'knowledge/*'` — Firecrawl data is preserved.
- Rate limit: 35s delay between embedding batches (Gemini free tier: 100 RPM).

### ChatWidget (`src/features/chat/ChatWidget.tsx`)
- Global mount in `pages/(app)/+Layout.tsx`.
- State via `useChatStore` (Zustand): `isOpen`, `currentPathname`, `toggleChat()`, `setOpen()`.
- Uses native `fetch` + `ReadableStream` (not `useChat` — AI SDK v6 incompatible).
- Sends `currentPathname` for context-aware retrieval.
- Any page can trigger the chatbot via: `useChatStore.getState().setOpen(true)`.

## 8. Smart Contract & Payment Constraints

### Contract Lifecycle (STRICT)
```
pending_payment → active → completed → disputed
```
- Contracts are **always** created with `status: 'pending_payment'`.
- Transition to `active` happens **only** after successful ePayco payment confirmation.
- **Never** set `status: 'active'` directly on contract creation.

### Payment Security (CRITICAL)
- **Private keys MUST stay server-side**: `VITE_APP_EPAYCO_PRIVATE_KEY` is consumed only in `server/api/payment/signature.ts`.
- **Signature generation**: `md5(custId^privateKey^invoice^amount^currency)` — NEVER on the client.
- **ePayco SDK**: Loaded from CDN, configured with public key only.
- The payment signature route (`POST /api/v1/payment/signature`) MUST be registered BEFORE `apply(app)` in `server/index.ts`.

### Contract Service (`@services/contracts`)
| Function | Returns | Purpose |
|----------|---------|---------|
| `createContract({ data })` | `string \| null` | Creates contract (auto-ID), returns contractId |
| `getContract(contractId)` | `ContractFirestoreDocument \| null` | Fetch single contract |
| `updateContract({ contractId, data })` | `void` | Update status, rated flag, etc. |
| `getContractsByClient(clientId)` | `ContractFirestoreDocument[]` | Propietario's contracts |
| `getContractsByProvider(providerId)` | `ContractFirestoreDocument[]` | Comerciante's contracts |
| `getCompletedContracts(userId)` | `ContractFirestoreDocument[]` | Both roles, status=completed |

### Role-Adaptive Pages
- `/app/formas-pago`: Propietarios see pending payments + payment methods. Comerciantes see earnings summary + contract history.
- `/app/contratacion`: Only the `clientId` (Propietario) sees the PAGAR button.

### Environment Variables (Payment)
| Variable | Scope | Purpose |
|----------|-------|---------|
| `VITE_APP_EPAYCO_PUBLIC_KEY` | Client + Server | ePayco checkout initialization |
| `VITE_APP_EPAYCO_PRIVATE_KEY` | Server ONLY | Signature generation |
| `VITE_APP_PAYCO_TEST` | Server | Test mode flag (`true`/`false`) |

## 9. Learned Lessons

### Vike Configuration (2026-01-27)
- **Deprecation of `+config.h.ts`**: Vike now prefers `+config.ts`.
- **Forbidden Exports in `+Page.tsx`**: Vike V1 design strictly forbids side exports like `documentProps` in `+Page.tsx` files when using `clientRouting` to avoid bundling server-side logic in the client. Metadata strings must be defined in `+config.ts` (or `+config.h.ts` if legacy).
- **Migration Pattern**: When moving metadata from `+Page.tsx` to `+config.ts`, ensure `title` and `description` are valid config keys. This often requires defining them in the global `renderer/+config.ts` under the `meta` property.

### Build Stability
- **Firebase Usage**: Never import `getAuth()` or `getFirestore()` directly in global scope. Always use the initialized instances exported from `services/firebase/client.ts`. Direct usage causes "No Firebase App" errors during build/SSR because the app isn't initialized yet.                                                                     


### Vercel Deployment & Server Architecture (2026-01-27)
- **Framework**: **Hono** (via `vike-photon`).
- **Adapter**: `@photonjs/vercel` automates Vercel Serverless Function generation.
- **Constraints**:
  - **Do NOT use `vite-plugin-vercel`**: It conflicts with `vike-photon`.
  - **Server Entry**: Logic resides in `server/index.ts` using `@photonjs/hono`.
  - **Vite Version**: Must be v7+ for `vike-photon` compatibility.

## 8. Package Manager Policy (STRICT)
- **ALWAYS use `pnpm`**.
- **NEVER use `npm` or `npx`**.
- Use `pnpm dlx` instead of `npx`.
- Use `pnpm run <script>` for package scripts.


## 9. CSS & Typography Guide (STRICT)

### Naming Convention
- **Kebab-case only**: All SCSS classes must use `kebab-case`.
- **Forbidden**: `camelCase` classes are prohibited.

### Typography System
File: `src/styles/components/_typography.scss`

**Heading Classes:**
| Class | Fluid Size | Intent |
|-------|-----------|--------|
| `.type-hero-title` | 60px → 32px | Hero titles |
| `.type-section-title` | 36px → 24px | Section headers |
| `.type-card-title` | 24px → 18px | Card titles |

**Body Classes:**
| Class | Size | Intent |
|-------|------|--------|
| `.type-body-lg` | 18px → 16px | Lead paragraphs |
| `.type-body` | 16px → 14px | Standard content |
| `.type-caption` | 14px → 12px | Captions |

**Fluid Mixin Usage:**
```scss
@include fluid-type(16px, 24px); // Scales between mobile→desktop
```

### Text Variants
| Class | Effect |
|-------|--------|
| `.text-bold` | Bold weight (700) |
| `.text-italic` | Italic style |
| `.text-underline` | Underline decoration |
| `.text-strikethrough` | Line-through |

### Contrast Enforcement
| Class | Use When |
|-------|----------|
| `.text-on-light` | Text on white/cream backgrounds |
| `.text-on-dark` | Text on dark backgrounds |
| `.opacidad-negro` | Dark overlay on images |

### Button System
File: `src/styles/components/_buttons.scss`

| Class | Style | Intent |
|-------|-------|--------|
| `.btn-primary-gradient` | Teal gradient | Main CTAs |
| `.btn-secondary-outline` | Border only | Secondary actions |
| `.btn-icon-action` | Solid + icon | Form submits |

### Accessibility (WCAG 2.1)
- Line width: Use `.text-optimal-width` (max 65 characters)
- Focus states: Use `.focus-visible` for keyboard navigation
- Screen readers: Use `.sr-only` for hidden labels

### Dev Reference
Live samples: `/dev/typography`
