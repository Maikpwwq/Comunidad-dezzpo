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
```
src/
├── features/         # [Domain Logic]
│   ├── auth/
│   ├── profile/
│   └── quotes/
├── services/         # [Data Layer]
│   ├── firebase/     # Core Config
│   └── user/         # User Service
└── pages/            # [Routing]
    ├── (marketing)/  # Public
    └── app/          # Private
```

## 6. Learned Lessons

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
