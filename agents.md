# AI Agent Constraint Engine

> **CRITICAL**: This file functions as the **System of Record** for all architectural and coding standards. You must adhere to these constraints without exception.

## 1. Strict Architecture Laws

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

### App Context (`pages/app`)
- **Focus**: Client-side interactivity, Authentication, User Data.
- **Constraints**:
  - CSR / SPA behavior.
  - strict `+guard.ts` protection.
  - Heavy use of Zustand stores.

## 5. Visual Guide

### File Structure
### File Structure
```
comunidad-dezzpo/
├── pages/                                    # Vike root pages directory
│   ├── +config.ts                            # [NEW] Global Vike v1 config
│   ├── +Layout.tsx                           # [NEW] Root layout wrapper
│   ├── +onRenderClient.tsx                   # [MOVE] from src/index/renderer
│   ├── +onRenderHtml.tsx                     # [MOVE] from src/index/renderer
│   ├── +Head.tsx                             # [NEW] Shared <head> meta
│   │
│   ├── (marketing)/                          # Route Group: Marketing Pages (SSR/SSG)
│   │   ├── +Layout.tsx                       # [NEW] Marketing layout (header/footer)
│   │   └── ... (Public pages)
│   │
│   ├── (auth)/                               # Route Group: Authentication Pages
│   │   ├── +Layout.tsx                       # [NEW] Auth layout (minimal UI)
│   │   └── ... (Login, Register pages)
│   │
│   ├── app/                                  # Protected App Routes (SSR + Client)
│   │   ├── +Layout.tsx                       # [MOVE/REFACTOR] AppLayout.jsx
│   │   ├── +guard.ts                         # [NEW] Auth guard for /app/*
│   │   └── ... (Dashboard, Profile, Quotes)
│   │
│   ├── src/
│   │   ├── components/                       # [RESTRUCTURE] Atomic Design
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   │
│   │   ├── features/                         # [NEW] Feature modules
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── budget/
│   │   │   ├── chat/
│   │   │   └── requirements/
│   │   │
│   │   ├── services/                         # [REFACTOR] TypeScript services
│   │   ├── hooks/                            # [NEW] Shared hooks
│   │   ├── stores/                           # [REFACTOR] RxJS state
│   │   ├── types/                            # [NEW] Shared TypeScript types
│   │   ├── assets/                           # [KEEP] Static assets
│   │   └── styles/                           # [NEW] Global styles
│   │
│   ├── server/                               # [KEEP] Express server
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
```

## 6. Sub-Agent Orchestration
This file acts as the primary orchestrator. For specific domain constraints, refer to:
- **Marketing Pages**: [pages/(marketing)/agents.md](pages/(marketing)/agents.md)
- **App/Dashboard**: [pages/(app)/agents.md](pages/(app)/agents.md)

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

