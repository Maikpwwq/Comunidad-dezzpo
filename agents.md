# AI Agent Constraint Engine

> **CRITICAL**: This file functions as the **System of Record** for all architectural and coding standards. You must adhere to these constraints without exception.

## 1. Strict Architecture Laws

### ⚡ PROVIDER & AUTH CONSTRAINTS

* **Firebase Auth Hydration:** All `/app/*` routes must account for the "Initializing" state. **Forbidden:** Hard-redirecting to `/login` before `onAuthStateChanged` has resolved.
* **Sendbird Initialization:** The Messaging Provider **must not** initialize for anonymous guests. Wrap all Sendbird logic in an `isAuth` check to prevent `null` user crashes.
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
│   └── setAdminClaim.ts                      # One-time admin setup
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 6. Sub-Agent Orchestration
This file acts as the primary orchestrator. For specific domain constraints, refer to:
- **Marketing Pages**: [pages/(marketing)/agents.md](pages/(marketing)/agents.md)
- **App/Dashboard**: [pages/(app)/agents.md](pages/(app)/agents.md)
- **Admin Panel**: [pages/(admin)/agents.md](pages/(admin)/agents.md)

## 7. Learned Lessons

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

