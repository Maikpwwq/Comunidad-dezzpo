# AI Agent Constraint Engine

> **CRITICAL**: This file functions as the **System of Record** for all architectural and coding standards. You must adhere to these constraints without exception.

## 1. Strict Architecture Laws

### ⚡ PROVIDER & AUTH CONSTRAINTS

* **Firebase Auth Hydration:** All `/app/*` routes must account for the "Initializing" state. **Forbidden:** Hard-redirecting to `/login` before `onAuthStateChanged` has resolved.
* **Sendbird Initialization:** The Messaging Provider **must not** initialize for anonymous guests. Wrap all Sendbird UI logic (e.g., `Comentarios.tsx`) in an `isAuth` check (`if (!userID)`) to prevent `null` user crashes and saboteur spam.
* **Sendbird Channel Orchestration:** Always use `@services/sendbird/sendbird.service.ts` (`getOrCreateDraftChannel`, `getOrCreateDirectChannel`) to generate or retrieve programmatic Group/Open channels. **Forbidden:** Direct instantiation of the Sendbird Core SDK (`sb.groupChannel.createChannel`) from UI components.
* **Hybrid Access Logic:** Specific `/app/` routes are designated as **Hybrid** (Guest + Auth).
  *   *Whitelisted:* `portal-servicios`, `suscripciones`, `directorio-requerimientos`, `perfil`, `ver-requerimiento`, `tiendas`.
  *   *Constraint:* Navigation components (`Sidebar`, `NavBar`) must toggle visibility based on `user.role` or `null` state.

  *   *Constraint:* Navigation components (`Sidebar`, `NavBar`) must toggle visibility based on `user.role` or `null` state.
  *   **SSR Safety:** All components in hybrid routes MUST be SSR-safe.
      *   **Forbidden:** Module-level instantiation of React components (e.g., in data files).
      *   **Forbidden:** Direct usage of `firebase.auth()` in component render paths (use `useUserStore`).
      *   **CJS Component Imports:** Libraries like `react-icomoon`, `react-swipeable-views`, `react-google-autocomplete` export CJS modules. When Vite bundles them via `ssr.noExternal`, `import Foo from 'lib'` may resolve to a namespace object `{ default: Fn, ... }` instead of the component function. Always use a runtime wrapper (see Section 9: CJS/ESM SSR Interop).

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
- **NO Legacy Wrappers**: Do not use old HOCs or duplicate root concerns inside features. The real `PageShell` at `pages/PageShell.tsx` is the only place for root `ThemeProvider`, `CssBaseline`, and `UserAuthProvider` (plus `PageContextProvider`).

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

### Admin Context (`pages/admin`)
- **Focus**: Platform governance, data sovereignty, trust & safety.
- **Constraints**:
  - **Admin Guard**: `useAdminGuard` hook checks `getIdTokenResult().claims.admin === true`. Non-admins are redirected to `/`.
  - **Isolated Bundle**: Admin layout is separate from the main app layout. No Sendbird, no user sidebar.
  - **Firestore Admin Predicate**: `isAdmin()` in Firestore rules grants read/update on user collections.
  - **Never expose admin logic in main app bundle**: Admin service (`@services/admin`) must only be imported within `pages/admin/*` routes.

## 5. Visual Guide

### File Structure
```
comunidad-dezzpo/
├── +server.ts                               # Hono + @vikejs/hono (repo root; API then vike(app))
├── server/
│   └── api/                                 # chat.ts, payment/signature.ts
├── pages/
│   ├── +config.ts                            # Global Vike v1 config
│   ├── +Layout.tsx                           # Root layout wrapper
│   ├── +onRenderHtml.tsx                     # SSR + Emotion critical CSS → <head>
│   ├── +onRenderClient.tsx                   # CSR/hydration + Emotion CacheProvider
│   ├── PageShell.tsx                         # ThemeProvider, CssBaseline, auth, page context
│   │
│   ├── (marketing)/                          # Route Group: Marketing (SSR/SSG)
│   │   ├── +Layout.tsx
│   │   └── ... (Public pages)
│   │
│   ├── (auth)/                               # Route Group: Authentication
│   │   ├── +Layout.tsx
│   │   └── ... (Login, Register)
│   │
│   ├── (app)/                                # Route Group: App shell + hybrid/auth routes
│   │   ├── +Layout.tsx                       # App Shell (Sidebar + Navbar)
│   │   ├── +guard.ts                         # Auth guard
│   │   └── ... (Dashboard, Profile, Quotes)
│   │
│   ├── admin/                                # Admin Control Tower
│   │   ├── +Layout.tsx                       # Admin guard + sidebar
│   │   ├── AGENTS.md                         # Admin-specific constraints
│   │   ├── dashboard/+Page.tsx               # KPI cards + Recharts + Monetization
│   │   ├── usuarios/+Page.tsx                # MUI DataGrid + live classification editor
│   │   ├── verificacion/+Page.tsx            # Identity verification queue
│   │   ├── certificaciones/+Page.tsx         # Certification requests queue
│   │   ├── referidos/+Page.tsx               # Referral audit & metrics
│   │   ├── notificaciones/+Page.tsx          # Mass broadcast workbench
│   │   └── blog/+Page.tsx                    # Blog & content management workbench
│   │
├── src/
│   ├── emotion/
│   │   └── createEmotionCache.ts             # Emotion cache key + client singleton
│   ├── components/                           # Atomic Design components
│   ├── features/                             # Feature modules
│   ├── config/                               # Centralized configuration
│   │   ├── userClassification.config.ts      # User ranking tiers, badges, criteria
│   │   ├── pricing.config.ts                 # Platform pricing constants
│   │   └── referrals.config.ts               # Referral reward catalog & point rules
│   ├── services/                             # Data layer
│   │   ├── admin/                            # Admin-only service
│   │   │   ├── adminService.ts               # Stats, users, classification, verification
│   │   │   └── index.ts                      # Barrel — all exports MUST be listed here
│   │   ├── blog/                             # Blog CRUD, seeding, slug generation
│   │   │   └── blogService.ts
│   │   ├── firebase/
│   │   └── users/
│   ├── hooks/                                # Shared hooks
│   │   ├── useAuth.ts
│   │   ├── useAdminGuard.ts                  # Firebase custom claims check
│   │   └── useReferralTracker.ts             # Captures ?ref= URL params globally
│   ├── stores/                               # Zustand stores
│   └── styles/                               # Global styles
│
├── scripts/
│   ├── patch-vercel-entry.mjs            # Post-build: patches dist/server/entry.mjs for Vercel
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
- **Marketing Pages**: [pages/(marketing)/AGENTS.md](pages/(marketing)/AGENTS.md)
- **App/Dashboard**: [pages/(app)/AGENTS.md](pages/(app)/AGENTS.md)
- **Admin Panel**: [pages/admin/AGENTS.md](pages/admin/AGENTS.md)
- **Server / Vercel / Vite**: [docs/server-stack-vike.md](docs/server-stack-vike.md)

## 7. RAG Chatbot Constraints

### Server Routing (CRITICAL)
- **API routes MUST be registered BEFORE `vike(app)`** in `pages/+server.ts`. Vike's handler is a catch-all; routes defined after it are never reached.
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
- Global mount in `pages/(app)/+Layout.tsx` (inside the app route group layout, under root `PageShell`).
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
- **Deposit Architecture**: Quotations and Contracts support `requireDeposit` and `depositAmount`. When `requireDeposit` is true, the initial contract `paymentStage` is `'deposit'`. The ePayco payload MUST charge the `depositAmount` instead of the full `agreedAmount`. The invoice ID must append `-{paymentStage}` (e.g., `DEZZPO-123-deposit`) to prevent transaction tracking collisions.

### Payment Security (CRITICAL)
- **Private keys MUST stay server-side**: `VITE_APP_EPAYCO_PRIVATE_KEY` is consumed only in `server/api/payment/signature.ts`.
- **Signature generation**: `md5(custId^privateKey^invoice^amount^currency)` — NEVER on the client.
- **ePayco SDK**: Loaded from CDN, configured with public key only.
- The payment signature route (`POST /api/v1/payment/signature`) MUST be registered BEFORE `vike(app)` in `pages/+server.ts`.

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

### Geographic Coverage & Centralization (ListadoZonas.ts)
- **Centralized Source**: All zones and their slug-to-label mappings MUST be imported from `@assets/data/ListadoZonas` (both the `zones` array and the `zoneNames` record).
- **No duplicates**: DO NOT hardcode lists of Bogotá localities or surrounding municipalities in local components, routes, or scripts.
- **Coverage**: Includes all 20 localities of Bogotá plus adjacent metropolitan municipalities (Soacha, Chía, Cajicá, Zipaquirá, Cota, Funza, Mosquera, Madrid, Facatativá, La Calera, Sopó).
- **Sitemap & Search Integration**: Both `generate-sitemap.ts` and `QuickMatch.tsx` consume the centralized constants directly, keeping marketing pages, search forms, and search engine optimization index lists completely in sync.

### Referral Program ("Voz a Voz") Constraints

#### Architecture
- **Centralized Config**: All reward catalog items and point constants live in `src/config/referrals.config.ts` (`REWARD_CATALOG`, `REFERRAL_POINT_RULES`). **Never** hardcode point values or reward definitions in components or services.
- **Service**: `src/services/referralService.ts` handles all Firestore operations — code generation, sign-up attribution, points awarding, reward redemption, and admin queries. Consumers import functions from `@services/referralService` and config from `@config/referrals.config`.
- **Tracker Hook**: `src/hooks/useReferralTracker.ts` detects `?ref=CODE` URL parameters and persists them to `sessionStorage` (key: `dezzpo_ref_code`). Mounted globally in `pages/PageShell.tsx`.
- **Attribution**: `src/services/users/userService.ts` → `setUser()` reads the `sessionStorage` ref code on new user creation and calls `trackReferralRegistration()` to link the referral.

#### Firestore Collections
| Collection | Purpose |
|-----------|---------|
| `referrals` | Audit trail of referral relationships (referrer ↔ referred, points, status) |
| `referralRedemptions` | Coupon codes generated from point redemptions |
| `usersPropietariosResidentes` / `usersComerciantesCalificados` | Extended with `referralCode`, `referralStats`, `referredBy` fields |

#### Point Rules (from `REFERRAL_POINT_RULES`)
| Event | Points |
|-------|--------|
| New user registers via referral code | +50 pts to referrer |
| Referred user completes first contract | +200 pts to referrer |

#### Self-Referral Prevention
- `trackReferralRegistration()` checks `referrerId === newUserId` and returns `false` if they match.

#### UI Routes
- **User Dashboard**: `/app/invitar-amigos` — gamified dashboard with code sharing (WhatsApp/Facebook/Email), KPIs, reward catalog, referral history table.
- **Admin Audit**: `/admin/referidos` — global metrics (total invitations, conversion rate, points distributed) and filterable audit table.

## 9. Learned Lessons

### Category Search, Selection Tray & Moderated Suggestions (`/app/ajustes` - 2026-08-18)
- **Searchable Category Selector**: Upgraded `ChipsCategories.tsx` with live accent/case-insensitive search (`normalizeSearchText`), keyword filtering, and dynamic category display.
- **Selection Summary Tray**: Displays selected categories (`X / 4`) at the top of the interface with one-click removal (`onDelete`) chips and max limit feedback.
- **Category Suggestion Engine**: If a user cannot find their specialty, a modal dialog captures `suggestedName`, `suggestedArea`, and `suggestedDescription`, persisting them to the `suggestedCategories` collection with author metadata (`userId`, `userName`, `userMail`, `status: 'pending'`).
- **Multi-Level Duplicate Checking**: `checkCategorySuggestionAvailability` evaluates proposed category names against the official 92-category catalog (`ListadoCategorias`) and pending/approved Firestore submissions with word overlap (>= 3 chars) and substring (>= 4 chars) matching. Exact catalog matches provide an instant *"Seleccionar en mi perfil"* CTA.
- **Firestore Security Rules**: Protected `/suggestedCategories/{suggestionId}` allowing authenticated authors to create and view their submissions, reserving updates and approvals to admins.

### Specialized Tiendas & Supplier Directory Taxonomy (2026-08-18)
- **Expanded Hardware & Retail Taxonomy**: Added 5 dedicated supplier categories to `ListadoCategoriasTiendas.ts`: `inoxidables` (stainless steel sheets/tubes/fittings), `mallas_metalicas` (chainlink/welded meshes/concertinas), `puertas` (wooden/metal/fire/security doors), `transmision_potencia` (bearings/pulleys/belts/chains/sprockets), and `depositos_materiales` (cement/aggregates/sand/bricks).
- **Taxonomy Segregation**:
  - Split `ornamentacion_hierro` into `ornamentacion` (artistic ironwork, railings, gates) and `perfiles_hierro` (structural iron, tubes, beams, sheets).
  - Split `muebles_modulares_tapiceria` into `muebles_closets` (cabinetry, modular furniture, closets) and `tapiceria` (upholstery fabrics, foams, leatherette, re-upholstery).
- **Shared Slug Utility**: Centralized URL slug generation in `@services/utils/slugify.ts` to eliminate duplicate definitions across blog and tienda services.

### Phone Authentication (SMS OTP) Architecture (`/registro` & `/ingreso` - 2026-08-21)
- **Primary Identifier**: Enables frictionless registration and login using only a mobile phone number via Firebase Phone Auth (`signInWithPhoneNumber` and `RecaptchaVerifier`), eliminating mandatory email and password entry.
- **SSR Safety**: `RecaptchaVerifier` is strictly instantiated client-side inside an invisible container `<div id="recaptcha-container"></div>` when `isFirebaseAvailable() && auth && typeof window !== 'undefined'`, with proper instance cleanup (`cleanupRecaptchaVerifier`) to prevent hydration mismatches and memory leaks in Vike SSR.
- **E.164 Normalization & Validation**: `@services/utils/phoneUtils.ts` provides `formatToE164`, `isValidColombianPhone`, and `formatPhoneDisplay` to guarantee standard phone formatting (+57 prefix for Colombian mobile numbers) with country code dropdown support.
- **2-Step Wizard Flow**:
  - Step 1: Role selection (Propietario vs Comerciante).
  - Step 2: Auth Method tabs (📱 *Teléfono Celular* vs ✉️ *Correo Electrónico*).
    - Phone: Step 2A captures Name/Brand + Phone number + Privacy Terms $\rightarrow$ triggers invisible reCAPTCHA $\rightarrow$ sends SMS OTP code.
    - Step 2B renders `OTPCodeInput.tsx` (6-digit numeric input with auto-advance, paste handler, 60s cooldown resend timer, and number edit shortcut) $\rightarrow$ verifies code $\rightarrow$ creates or hydrates user profile.
- **Firestore Profile Hydration**: Phone users are persisted with `userMail: null`, `userPhone: '+573XXXXXXXXX'`, and structured contact list `phones: [{ number: '+573XXXXXXXXX', isPrimary: true, type: 'personal' }]`. Global `UserAuthProvider` and Zustand `userStore` track `phoneNumber: string | null`.
- **Development & Test Mode**: Native support for Firebase Console pre-configured test numbers (e.g. `+57 320 4842897` / code `250051`).

### Specialized Engineering & Building Services Taxonomy (2026-08-18)
- **Niche-Specific Expansion**: Expanded `ListadoCategorias.tsx` (92 categories) and `CategoryIcons.tsx` with high-value technical services:
  - `Cálculos y Diseños de Ingeniería` (structural NSR-10, MEP, calculations), `Topografía y Agrimensura` (surveys, plot boundaries, subdivision), `Estudios de Suelos y Geotecnia` (soil test pits, geotechnical engineering), `Energía Solar y Fotovoltaica` (PV solar design & installation), `Puertas Automáticas y Motores` (vehicular gates, barriers, boom gates), `Fumigación y Control de Plagas` (sanitary pest control certification), `Peritajes y Avalúos` (certified appraisals & structural forensics), `Diseño 3D y Renders` (BIM/3D architectural renders).
- **Strategic Boundary Enforcement**: Deliberately rejected consumer electronics repair (cellphones/PCs/TVs) to protect Dezzpo's clear positioning as a specialized construction, habitat, property horizontal, and architectural maintenance platform.

### Multi-Provider Account Linking & Phone Identity Resolution (`findUserByPhone` - 2026-08-25)
- **Problem**: Firebase Auth creates independent `uid`s per sign-in method (Google vs Phone OTP vs Email/Password). When an existing user signs in via SMS OTP, Firebase creates a new `uid` with no Firestore document, resulting in a *"User not found"* error on `/app/perfil/[id]`.
- **Auto-Linking Strategy**: `findUserByPhone(phoneNumber, role)` resolves existing Firestore profiles matching any phone representation (E.164, local 10-digit, 12-digit, formatted display) across both collections (`usersComerciantesCalificados`, `usersPropietariosResidentes`).
- **Seamless Re-Routing**: When SMS OTP verification succeeds:
  1. If an existing profile is found, `handleAuthSuccess` accepts `overrideUid` to bind Zustand, `localStorage`, and navigation to the existing `existingUid` instead of the orphaned phone-auth UID.
  2. If registered with phone and the number already exists, the user is cleanly auto-linked and logged in without duplication.
  3. `UserAuthProvider` includes fallback rehydration via `findUserByPhone` if a session's Firestore profile is initially not found by raw `user.uid`.
- **Payload Sanitization (`sanitizeForFirestore`)**: Cloud Firestore SDK strictly rejects `undefined` values (`Unsupported field value: undefined`). All Firestore document writes (`setUser`, `updateUser`) pass payloads through `sanitizeForFirestore` to strip undefined properties while preserving valid `null` and empty arrays.

### TypeScript `exactOptionalPropertyTypes` & Firestore Serialization
- **Zero Incompatible `undefined` Assigns**: With `exactOptionalPropertyTypes: true` enabled in `tsconfig.json`, all optional interface properties receiving runtime `undefined` values (e.g. `raw || undefined`) MUST be explicitly typed with `| undefined` (e.g. `razonSocial?: string | undefined`).
- **Partial Updates**: `updateDoc` payload objects that accept partial inputs must avoid `Partial<T>` when `T` contains strict non-undefined properties, using `Record<string, unknown>` and `sanitizeForFirestore(data)` before persistence.

### Supplier & Hardware Store Directory System (`/app/tiendas` & `/admin/tiendas` - 2026-08-11)
- **Directory Architecture**: Dedicated module for sourcing materials, tools, equipment rental, and technical services filterable by 28 namespaced categories (`ListadoCategoriasTiendas.ts`). Accessible to Propietarios, Comerciantes, and Guests without role gating.
- **Directory Metadata & Per-Sede Contact**: Store documents support legal metadata (`razonSocial`, `nit`) at the tienda level, plus granular branch details (`detallesUbicacion` for physical landmarks, `nombreContacto`, `cargoContacto`) per `SedeLocation`. Surfaced across card view (`TiendaCard.tsx`), modal (`SedeDetailModal.tsx`), and admin management table (`/admin/tiendas`).
- **Colloquial Synonym Search**: `ListadoCategoriasTiendas.ts` defines trade term `synonyms[]` for all 28 categories (e.g. `plomería` → `tuberia_pvc_hidrosanitaria`, `esmalte`/`thinner` → `pinturas_insumos`). Both client-side `useMemo` and `tiendaService.ts` search evaluate terms against category synonyms, titles, and store metadata.
- **Service Layer & Firestore**: `@services/tiendas` (`tiendaService.ts`) handles CRUD, filtering by zone/category/query/status, and lazy auto-seeding of initial curated hardware stores transcribed from real business cards with complete contact and location metadata.
- **Interactive Maps & Live Places Fallback**: `TiendasMap.tsx` plots multi-branch (`SedeLocation`) markers using `@googlemaps/js-api-loader`. When a selected category has zero curated Dezzpo stores, it automatically triggers a live Google Places search via `google.maps.places.PlacesService` with an inline alert banner: *"Aún no tenemos tiendas verificadas por Dezzpo en esta categoría — mostrando resultados de Google Maps"*.
- **Multi-Sede Management**: `SedeManager.tsx` and `TiendaFormModal.tsx` allow users and admins to register suppliers with multiple physical branches, phone contacts, WhatsApp, business hours, and precise pin coordinates via `Ubicacion.tsx`.
- **Admin Control Tower**: `/admin/tiendas` provides a tabbed workbench for managing published stores, editing branch details, reviewing pending user submissions, and viewing location/WhatsApp summaries.


### DataGrid User Classification Columns (`/admin/usuarios` - 2026-07-25)
- **Visible Columns**: Added `Categoría` (`userCategorie`), `Clasificación` (`userClasification`), and `Grado` (`userGrade`) columns to the MUI DataGrid table in `/admin/usuarios`.
- **Badge Chips**: Rendered using `getBadgeDetails()` helper with color-coded background and text chips for instant visual auditing by administrators without opening user modals.

### Mandatory Legal Privacy Placement (2026-07-25)
- **Registration Flow (`/registro`)**: Added mandatory `Form.Check` checkbox for *Aviso de Privacidad y Autorización de Tratamiento de Datos Personales*. Account creation and Google Sign-in are gated until checked.
- **Privacy Settings (`/app/configuracion-privacidad`)**: Permanent legal links section added under privacy toggles linking to `/legal?doc=aviso-privacidad`, `/legal?doc=politica-tratamiento-datos`, and `/legal`.
- **Module Disclaimers**: Visible, non-intrusive legal footers added to *Mis Inmuebles*, *Formas de Pago*, *Certificaciones*, and *Nuevo Proyecto*.

### Ecosystem Testing Master Plan & Quality Architecture (2026-08-07)
- **Local Emulator Isolation**: Firebase Local Emulator Suite ports mapped in `firebase.json` (`auth`: 9099, `firestore`: 8080, `storage`: 9199). Zero production billable calls or data leakage during automated testing.
- **Security Rules Integration (`tests/integration/rules/`)**:
  - `firestore.rules.test.ts`: 14 test groups covering `quotations`, `contracts`, `usersPropietariosResidentes`, `usersComerciantesCalificados`, `inmuebles`, `paymentMethods`, `certificationRequests`, `inspectionRequests`, `referrals`, `referralRedemptions`, `notifications`, `drafts`, `subscriptions`, `blog_posts`, `asesorias`, `funnel_events`, `categoriasServicios`, and catch-all deny rule.
  - `storage.rules.test.ts`: 5 test groups covering public assets (`site/`, `html/`), user profile ownership (`profiles/{uid}/*`), identity verification privacy (`verifications/{uid}/*`), image MIME type validation, and catch-all deny.
- **Property-Based Fuzzing (`fast-check`)**: `tests/unit/services/paymentSecurity.property.test.ts` (ePayco HMAC MD5 signatures), `referralCode.property.test.ts`, `slugifyAndZones.property.test.ts`, and `userStore.property.test.ts` (Zustand state invariants).
- **Playwright E2E Multi-Role (`tests/e2e/`)**: POMs (`AuthPage`, `DashboardPage`, `ContractPage`), multi-role contract lifecycle flow, `adminSecurityGuard.spec.ts` (protecting 7 admin routes with non-admin redirect), and an anti-crash guard testing 11 critical authenticated routes.
- **Mutation & Accessibility**: `stryker.config.json` targeting `src/services/**/*.ts` with Vitest runner (50% break threshold). `tests/e2e/a11y/accessibility.spec.ts` executing `@axe-core/playwright` WCAG 2.1 AA audits.
- **GitHub Actions Pipelines (`.github/workflows/`)**: `ci.yml` (PR gate: lint → typecheck → vitest coverage → firebase rules emulators → production build) and `nightly.yml` (midnight UTC: parallel Playwright E2E on Chromium + Firefox, StrykerJS mutation, and axe-core a11y).

### Blog & Inbound Marketing System (2026-07-21)
- **Service Layer**: `@services/blog/blogService.ts` handles full CRUD (create, read, update, delete), slug generation, audience tagging (`propietarios`/`comerciantes`/`general`), and view-count metrics.
- **Admin Workbench**: `/admin/blog` provides a content management interface with rich-text editing, image upload, audience targeting, publish/draft toggle, and article metrics table.
- **Public Blog Hub**: `/blog` renders audience-segmented tabs, hero articles, and card grid. `/blog/@slug` renders individual articles with breadcrumbs and targeted CTAs.
- **Firestore Collection**: `blogPosts` — fields include `title`, `slug`, `content`, `audience`, `status`, `coverImage`, `author`, `viewCount`, `createdAt`, `updatedAt`.

### User Classification, Ranking & Badges System (2026-07-21)
- **Centralized Config**: `src/config/userClassification.config.ts` defines `COMERCIANTE_RANKINGS` and `PROPIETARIO_RANKINGS` with three axes each: `categoria` (membership tier), `clasificacion` (operational scale), and `gradacion` (experience grade).
- **Firestore Fields**: `userCategorie`, `userClasification`, `userGrade` stored as strings in both `usersComerciantesCalificados` and `usersPropietariosResidentes`.
- **Admin Editor**: `/admin/usuarios` modal includes live dropdown editors for all three classification fields per user.
- **Public Matrix**: `/clasificacion-usuarios` marketing page with tabbed `<UserRankingTable />` component showing tier criteria.
- **Badge Chips**: `UserCard.tsx` and `DraftCard.tsx` render colored classification chips via `getBadgeDetails()` helper.
- **Filter Bars**: `/app/portal-servicios` filters merchants by `COMERCIANTE_RANKINGS.clasificacion` tiers. `/app/directorio-requerimientos` filters requirements by `PROPIETARIO_RANKINGS.clasificacion` tiers.

### Category SearchBar & Parameterized Routes (2026-07-21)
- **Reusable SearchBar**: `src/components/layout/SearchBar.tsx` accepts `targetRoutePrefix` (defaults to `/app/portal-servicios`), `placeholder`, and `onCategorySelect` props. Navigates to `/{targetRoutePrefix}/{encodedCategory}` on selection.
- **Vike @searchInput Routes**: Both `/app/portal-servicios/@searchInput` and `/app/directorio-requerimientos/@searchInput` have `+config.ts` + `+Page.tsx` (re-exporting parent `+Page`) to enable SSR hydration, browser reload, and deep linking.
- **Category Filtering**: Page components read `pageContext.routeParams?.searchInput`, decode it, and filter lists by matching against `draftCategory`, `draftName`, `draftDescription`, or user service categories. An active search chip with clear button is displayed.

### Barrel Export Hygiene (2026-07-21)
- **Problem**: Adding a new exported function to a service module (e.g., `adminService.ts`) without also adding it to the barrel `index.ts` causes `[MISSING_EXPORT]` build failures on Vercel, even when the dev server works fine (Vite resolves deep imports differently).
- **Rule**: When adding any new `export` to a service module, **always** update the corresponding `index.ts` barrel file in the same commit. Run `pnpm build` locally to verify before pushing.

### Multi-Property Management ("Mis Inmuebles" - 2026-07-21)
- **Role Scoping**: `/app/mis-inmuebles` is exclusive to **Propietario** accounts (`rol === 1`). It is gated both at the route component level and within `PROPIETARIO_SIDEBAR`.
- **Address Separation**: The user's personal address in `Ajustes > Ubicación` (`userDirection`) is preserved as a personal contact/correspondence address. Serviced properties/buildings are stored in the subcollection `usersPropietariosResidentes/{uid}/inmuebles/{inmuebleId}`.
- **Atomic Preferred Property**: Setting a property as preferred (`isPreferida = true`) uses a Firestore `writeBatch` in `@services/inmuebles` to flip all other properties to `isPreferida = false`.
- **Deletion Guard**: A preferred property cannot be deleted if other properties exist in the user's list.
- **Form Integration**: Requirements posting (`/nuevo-proyecto`) and VIP inspection requests (`/app/suscripciones`) use the reusable `<PropertySelector />` from `@features/inmuebles`.


### Hybrid Notification System Architecture (2026-07-21)
- **Hybrid Responsibilities**: Structured system notifications, mass broadcast announcements (`recipientId = 'ALL'`), and unread badge counters are governed by Firestore (`/notifications` collection + `@services/notificationService`). Sendbird remains dedicated exclusively to 1-to-1 chats, negotiation channels, and live profile comments.
- **Real-Time Sync**: Component headers (`NotificationBar.tsx`) and the Notification Center (`/app/notificaciones`) subscribe to real-time updates via `subscribeUserNotifications()` using `onSnapshot`.
- **Admin Broadcast Workbench**: Administrators broadcast platform announcements from `/admin/notificaciones`, targeting all users or filtering by role (`1` for Propietarios, `2` for Comerciantes).



### Centralized Geographic Configuration (2026-07-06)
- **Centralization of Zones**: Migrated all zone listings (Bogotá localities + metropolitan municipalities) to `@assets/data/ListadoZonas.ts` to prevent duplication bugs and keep prerendering, sitemaps (`generate-sitemap.ts`), and marketing search forms (`QuickMatch.tsx`) perfectly aligned.
- **Sitemap Script Path Aliases**: To run the sitemap generator script using `tsx` with path aliases, the `scripts/**/*.ts` pattern must be included in `tsconfig.json`'s `include` array. This ensures the TypeScript compiler compiles script files in the root workspace and correctly resolves aliases like `@assets/data/ListadoZonas` without IDE or compiler errors.


### Vike Configuration (2026-01-27)
- **Deprecation of `+config.h.ts`**: Vike now prefers `+config.ts`.
- **Forbidden Exports in `+Page.tsx`**: Vike V1 design strictly forbids side exports like `documentProps` in `+Page.tsx` files when using `clientRouting` to avoid bundling server-side logic in the client. Metadata strings must be defined in `+config.ts` (or `+config.h.ts` if legacy).
- **Migration Pattern**: When moving metadata from `+Page.tsx` to `+config.ts`, ensure `title` and `description` are valid config keys. This often requires defining them in the global `renderer/+config.ts` under the `meta` property.

### Build Stability
- **Firebase Usage**: Never import `getAuth()` or `getFirestore()` directly in global scope. Always use the initialized instances exported from `services/firebase/client.ts`. Direct usage causes "No Firebase App" errors during build/SSR because the app isn't initialized yet.

### CJS/ESM SSR Interop (2026-05-22)
- **Problem:** When CJS React component libraries (`react-icomoon`, `react-swipeable-views`, `react-google-autocomplete`) are bundled via `ssr.noExternal`, Vite wraps their exports in an ESM namespace object. `import Foo from 'cjs-lib'` resolves to `{ default: FnComponent, ... }` (an object) instead of `FnComponent` (a function). React then throws `Element type is invalid: expected a string ... but got: object`.
- **Fix Pattern — Wrapper Component:**
  ```typescript
  import FooModule from 'cjs-lib'
  const Foo = (props: any) => {
      const Comp = (FooModule as any).default?.default
          || (FooModule as any).default || FooModule
      return <Comp {...props} />
  }
  ```
- **Fix Pattern — HOC Factory (for `autoPlay`/`bindKeyboard`):**
  ```typescript
  import SWModule from 'react-swipeable-views'
  import * as SWUtils from 'react-swipeable-views-utils'
  let _Cached: any = null
  function getWrapped() {
      if (_Cached) return _Cached
      const SV = (SWModule as any).default?.default || (SWModule as any).default || SWModule
      const utils = (SWUtils as any).default || SWUtils
      _Cached = utils.bindKeyboard(utils.autoPlay(SV))
      return _Cached
  }
  ```
- **Affected files:** `Footer.tsx`, `ContactItem.tsx`, `nosotros/+Page.tsx`, `CategoriasSlider.tsx`, `+Page.tsx` (homepage), `Ubicacion.tsx`.
- **Key rule:** When adding ANY new CJS React component library to `ssr.noExternal`, always verify SSR with `vike prerender`. If `got: object` errors appear, apply the wrapper pattern above.


### Vercel Deployment & Server Architecture (2026-05-22)
- **Framework**: **Hono** with **`@vikejs/hono`** and Vike **`pages/+server.ts`** (replaces deprecated `vike-photon`).
- **Custom Vercel Adapter**: `scripts/patch-vercel-entry.mjs` patches the Vike-compiled `dist/server/entry.mjs` after build. It generates a zero-dependency Node→Web Standard adapter that translates Vercel's `(req, res)` into a Web `Request`, calls `server.fetch()`, and streams the `Response` back. **Do NOT use `hono/vercel` `handle()`** — it assumes Edge runtime and crashes on Node.js with `headers.get is not a function`.
- **Build pipeline**: `pnpm build` runs `vike build && node scripts/patch-vercel-entry.mjs`.
- **Static assets**: `vercel.json` sets `"outputDirectory": "dist/client"` so CSS/JS/images are served from Vercel's CDN. The catch-all rewrite `/(.*) → /api` only handles dynamic SSR routes.
- **Serverless entry**: `api/index.mjs` re-exports `dist/server/entry.mjs` (the patched file). **Must be `.mjs`** — see TS7 lesson below.
- **Constraints**:
  - **Server entry**: `pages/+server.ts` — export `{ fetch: app.fetch, prod?: { port, onReady } }` per [Vike +server](https://vike.dev/server).
  - **API routes MUST be registered BEFORE `vike(app)`** so the Vike catch-all does not swallow them.
  - **URL normalization middleware** in `+server.ts` converts relative URLs to absolute as a safety net.
  - **Forbidden approaches**: Do NOT use `api/index.ts` (see TS7 lesson), do NOT use `hono/vercel` `handle()`, do NOT use `vite-plugin-vercel` `vercel()` plugin for output generation.
- **Full reference**: [docs/server-stack-vike.md](docs/server-stack-vike.md).

### MUI v6 + Emotion SSR (2026-05)
- **Stack**: `@mui/material` / `@mui/icons-material` v6, `@mui/x-data-grid` v7, Emotion 11, `@emotion/server` for critical CSS on SSR.
- **Do not duplicate providers**: `ThemeProvider`, `CssBaseline`, and `UserAuthProvider` live only in `pages/PageShell.tsx`. `(app)/+Layout.tsx` and `admin/+Layout.tsx` must not wrap the tree again with another theme or auth root.
- **Render hooks**: `+onRenderHtml.tsx` and `+onRenderClient.tsx` both wrap with Emotion `CacheProvider` using `src/emotion/createEmotionCache.ts` (stable key `mui`, `prepend: true`). Server extracts Emotion chunks and injects `<style>` tags in `<head>` after Bootstrap so MUI wins cascade conflicts where both apply.
- **Vite**: `vite.config.ts` → `ssr.noExternal` in production bundles MUI, Emotion, Data Grid, Sendbird, `date-fns`, `firebase`, `zustand`, etc., so SSR does not rely on raw Node resolution for those packages (required for Vercel; avoids `@mui/utils` directory-import errors). If SSR resolution breaks after upgrades, compare against [Vite SSR](https://vite.dev/config/ssr-options.html#ssr-noexternal) and [MUI server rendering](https://mui.com/material-ui/guides/server-rendering/).
- **Lockfile**: `pnpm.overrides` pins `@mui/system` to `6.5.0` alongside Data Grid v7. Do not remove without checking `pnpm why @mui/system`.
- **MUI v9**: Out of scope for drive-by bumps; requires a planned migration (Grid v2, `sx`-only system props, icons/slots, Data Grid v9).
- **Artifact**: Deep-dive and step-6 checklist — [docs/mui-emotion-ssr-vike.md](docs/mui-emotion-ssr-vike.md).

### React 19 & TypeScript 7.x Compiler Modernization (2026-07)
- **Stack**: React 19, TypeScript 7.x.
- **TSConfig Path Mappings**: Modern TypeScript deprecates `"baseUrl"`. To eliminate compiler warnings and IDE errors, **never** specify `"baseUrl": "."` or `"ignoreDeprecations": "5.0"`. Instead, use **relative targets** (prefixing with `./`) for all path mapping arrays (e.g. `"@/*": ["./src/*"]`).
- **Ref Prop**: Do **not** use legacy `forwardRef` or `displayName` wrappers in components. Declare `ref` directly as a standard React component prop as supported natively in React 19.
- **useMemo Elimination**: Do **not** use `useMemo` for simple property derivations or cheap calculations (e.g., extracting values from objects, or filtering lists of a few dozen entries). React 19's virtual DOM diffing is highly performant, and string primitive dependencies in hooks are compared by value anyway. Removing unnecessary `useMemo` hooks reduces dependency tracking and hook memory overhead.

### @vercel/node + TypeScript 7 Incompatibility (2026-07-14)
- **Problem**: `@vercel/node` uses an internal TypeScript compiler host to transpile `.ts` serverless entry points. When it detects a local TS 7.x installation, it tries to use it, but TS 7 changed internal `readFile` APIs that `@vercel/node` depends on. This causes `Error: Cannot read properties of undefined (reading 'readFile')` during the serverless function build step — **after** the Vite/Vike build succeeds.
- **Fix**: Rename `api/index.ts` → `api/index.mjs`. The `.mjs` extension tells `@vercel/node` to treat it as plain ESM — no TypeScript compilation needed. The file is just a 1-line re-export of the already-built `dist/server/entry.mjs`.
- **NEVER revert to `api/index.ts`** while on TypeScript 7.x, unless `@vercel/node` releases a fix.

### Vercel Serverless SSR Diagnostics & firebase-admin ESM Interop (2026-07-21)
- **Dynamic Adapter Entry Matching**: `scripts/patch-vercel-entry.mjs` dynamically detects the server export chunk from Vike's minified Rollup build output rather than assuming static export names.
- **Diagnostic Serverless Wrapper**: `api/index.mjs` intercepts top-level import failures and execution exceptions, returning structured JSON errors with stack traces to eliminate opaque 500 error pages.
- **`firebase-admin` Dependency Pinning**: `firebase-admin@14.x` introduced `jwks-rsa@4.x` which depends on `jose@6.x` (pure ESM). On Node 20.x serverless runtimes, this causes `ERR_REQUIRE_ESM: require() of ES Module ... not supported`. To ensure seamless CJS/ESM interop on Vercel, `firebase-admin` MUST remain pinned to `^13.0.0` (which uses `jwks-rsa@3.x` / `jose@4.x` supporting CommonJS `require()`).

## 10. Testing Architecture (Vitest & Playwright)
- **Pyramid Structure**: The project implements a strict 3-layer testing pyramid (`tests/unit`, `tests/integration`, `tests/e2e`). Do not collapse layers or bypass mock boundaries in unit/integration layers.
- **Reference Document**: See `docs/testing-architecture.md` for full implementation details, including Zustand singleton mocking (`tests/setup.ts`), Playwright POM patterns, and Vike SSR routing tests.
- **Test Commands**: Use `pnpm exec vitest run` for layers 1 & 2. Use `pnpm exec playwright test` for layer 3.

## 11. Package Manager Policy (STRICT)
- **ALWAYS use `pnpm`**.
- **NEVER use `npm` or `npx`**.
- Use `pnpm dlx` instead of `npx`.
- Use `pnpm run <script>` for package scripts.


## 12. CSS, Typography & Brand Identity (STRICT)

> **CANONICAL REFERENCE**: [docs/design-system.md](docs/design-system.md) is the **single source of truth** for all visual styles. You **MUST** read it before writing any CSS, SCSS, or MUI `sx` styling code.

### Live Style Guide (Dev Routes)

The project maintains a **live interactive style guide** that renders all typography classes, button variants, color swatches, and contrast enforcement patterns:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dev` | [`AllFontStyles.tsx`](src/components/dev/AllFontStyles.tsx) | Full design system reference |
| `/dev/typography` | Same | Legacy URL (same component) |

**Route files**: `pages/(marketing)/dev/+Page.tsx` and `pages/(marketing)/dev/typography/+Page.tsx`.
These routes are prerendered via the `(marketing)` group. **Do NOT remove, rename, or modify these routes.**

### CSS Architecture

```
src/styles/
├── _variables.scss          # CSS custom properties (colors, fonts) — SINGLE SOURCE
├── components/
│   ├── _typography.scss     # Fluid typography system (6 preset classes)
│   └── _buttons.scss        # Centralized button system (6 variants + legacy map)
├── _globals.scss            # Global resets, font-face, utility classes
└── main.scss                # Entry point
```

### Naming Convention
- **Kebab-case only**: All SCSS classes must use `kebab-case`.
- **Forbidden**: `camelCase` CSS classes are prohibited.

### Typography Classes (Quick Reference)

| Class | Fluid Size | Intent |
|-------|-----------|--------|
| `.type-hero-title` | 32px → 60px | Hero/landing page titles |
| `.type-section-title` | 24px → 36px | Section headers |
| `.type-card-title` | 18px → 24px | Card titles |
| `.type-body-lg` | 16px → 18px | Lead paragraphs |
| `.type-body` | 14px → 16px | Standard content |
| `.type-caption` | 12px → 14px | Captions, metadata |

### Button Classes (Quick Reference)

| Class | Visual | Intent |
|-------|--------|--------|
| `.btn-primary-gradient` | Teal→Blue gradient, pill | **Main CTAs** (Siguiente, Guardar) |
| `.btn-secondary-outline` | Teal border, transparent | **Secondary** (Volver, Cancelar) |
| `.btn-icon-action` | Solid teal + icon slot | Icon buttons (PUBLICAR) |
| `.btn-floating-action` | Purple + shadow | Asísteme floating bar |
| `.btn-menu-nav` | Dark semi-transparent pill | Navigation menu items |
| `.btn-card-action` | Solid teal, square corners | Card action links |

### Auth Module Buttons (CSS Modules)

| Class | File | Intent |
|-------|------|--------|
| `.PrimaryAuthButton` | `Login.module.scss` / `Register.module.scss` | Phone/email submit (white text on gradient) |
| `.TealButton` | `Login.module.scss` / `Register.module.scss` | Google sign-in (white text on solid teal) |

### Primary Brand Colors (Quick Reference)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background-main-green-color` | `#00b0ab` | Primary buttons, CTAs |
| `--logo-comunidad-dezzpo-color` | `#209da1` | Logo, brand accent |
| `--background-dark-purple-color` | `#662382` | Asísteme, premium |
| `--content-text-color` | `#4b4b4b` | Body text |
| `--primary-titles-text-color` | `#4d4d4d` | Headings |

### ❌ FORBIDDEN Anti-Patterns (Brand Identity Protection)

1. **Never invent new colors.** Use ONLY CSS custom properties from `_variables.scss`.
2. **Never hardcode hex values in components.** Use `var(--variable-name)`.
3. **Never create new button styles inline.** Use the 6 existing variants from `_buttons.scss`.
4. **Never override `.TealButton` or `.PrimaryAuthButton`** — these are WCAG-compliant auth buttons.
5. **Never use Tailwind CSS.** The project uses SCSS + CSS custom properties.
6. **Never use MUI `sx` prop for brand colors.** Use SCSS classes or CSS variables.
7. **Never change font families.** Helvetica SemiBold (headings) + Work Sans (body) only.
8. **Never remove utility classes** (`.bg-verde`, `.opacidad-negro`, `.TealButton`, etc.).
9. **Never modify the primary gradient** `linear-gradient(-90deg, #18B1A7 35%, #0099CC 100%)` — it is the Dezzpo brand signature.

### Text Variant Utilities

| Class | Effect |
|-------|--------|
| `.text-bold` | `font-weight: 700` |
| `.text-italic` | `font-style: italic` |
| `.text-underline` | `text-decoration: underline` |
| `.text-strikethrough` | `text-decoration: line-through` |

### Contrast Enforcement

| Class | Use When |
|-------|----------|
| `.text-on-light` | Text on white/cream backgrounds |
| `.text-on-dark` | Text on dark backgrounds |
| `.opacidad-negro` | Dark overlay on images (WCAG) |
| `.opacidad-blanco` | Light overlay on images |
| `.step-card-text` | Forces dark text in light cards |

### Accessibility (WCAG 2.1)
- **Line width**: Use `.text-optimal-width` (max 65 characters per line)
- **Focus states**: Use `.focus-visible` for keyboard navigation
- **Screen readers**: Use `.sr-only` for hidden labels
- **Button contrast**: All buttons on teal/gradient → white text mandatory

### Fluid Typography Mixin

```scss
// In _typography.scss — use for responsive font sizing:
@include fluid-type(16px, 24px); // Scales smoothly between mobile→desktop
@include fluid-line-height(1.35, 1.6); // Responsive line-height
```

### ✅ MANDATORY Practices

1. **Read `docs/design-system.md`** before writing any styling code.
2. **Check `/dev` route** to visually verify your changes match the system.
3. **Use fluid typography classes** instead of fixed pixel sizes.
4. **Use CSS variables** for all colors.
5. **Apply contrast classes** (`.text-on-light`, `.text-on-dark`) for WCAG compliance.
6. **All button text on teal/gradient backgrounds must be white** (`#ffffff`).

