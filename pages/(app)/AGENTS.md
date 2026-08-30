# App Dashboard - AI Agent Context

> **Scope**: This context applies to all pages under `pages/(app)/` (URL prefix `/app/*`).
> These routes use the app shell; many require authentication, and some are **hybrid** (guest + auth).

---

## MUI, Emotion, and root providers

- **Do not add** another `ThemeProvider`, `CssBaseline`, or root `UserAuthProvider` in `(app)/+Layout.tsx` or feature code. They already wrap the whole app from `pages/PageShell.tsx`, with Emotion `CacheProvider` in `+onRenderHtml` / `+onRenderClient`.
- Use MUI components and `sx` as usual; SSR/hydration depend on the shared Emotion cache key in `src/emotion/createEmotionCache.ts` (`mui`).

---

## Route Configuration

```typescript
// pages/(app)/+config.ts
export default {
  prerender: false,  // ← Dynamic content, no SSG
} satisfies Config
```

---

## Authentication Guard

All `/app/*` routes are protected by `+guard.ts`:

```typescript
// pages/(app)/+guard.ts
import { redirect } from 'vike/abort'
import type { GuardSync } from 'vike/types'

// Whitelist of public routes within the app shell
const PUBLIC_APP_ROUTES = [
  '/app/portal-servicios',
  '/app/directorio-requerimientos',
  '/app/suscripciones',
  '/app/ver-requerimiento',
  // Dynamic routes like /app/perfil/@id are handled by logic, not exact match
]

export const guard: GuardSync = (pageContext): void => {
  const { urlPathname, isAuthenticated } = pageContext

  // 1. Allow if user is authenticated
  if (isAuthenticated) return

  // 2. Allow if route is in public whitelist
  if (PUBLIC_APP_ROUTES.some(route => urlPathname.startsWith(route))) return

  // 3. Allow public profile viewing (but not own profile /app/perfil)
  if (urlPathname.startsWith('/app/perfil/') && urlPathname.split('/').length > 3) return

  // 4. Otherwise, redirect to login
  throw redirect(`/ingreso?returnTo=${urlPathname}`)
}
```

### Hybrid Route Strategy (SSR Warning)
Routes like `portal-servicios` and `ver-requerimiento` work for both Guests and Users. This means:
1.  **NO client-only logic guards** that block rendering (white screen).
2.  **SSR Safety is Critical**: Components must not access `window`, `localStorage`, or `firebase.auth()` directly during the initial render.
    *   Use `useEffect` for browser-apis.
    *   Use `useUserStore` (Zustand) for auth state.
    *   **Data Files**: Do NOT instantiate React components at the module level (e.g., `icon: <Icon />`). Export the component reference (`icon: Icon`) and instantiate it in the component tree.

---

## Zustand State Usage

```typescript
import { useUserStore, useCurrentUser } from '@stores/userStore'

function ProfilePage() {
  // Option 1: Direct access
  const { userId, rol } = useUserStore()

  // Option 2: Optimized selector (recommended)
  const isAuth = useUserStore((state) => state.isAuth)

  // Update state
  const updateUser = useUserStore((state) => state.updateUser)
  updateUser({ displayName: 'New Name' })
}
```

### Role-Based Rendering

```typescript
const rol = useUserStore((state) => state.rol)

return (
  <nav>
    {rol === 1 && <NavLink href="/app/requerimiento">Mis Requerimientos</NavLink>}
    {rol === 2 && <NavLink href="/app/cotizar">Mis Cotizaciones</NavLink>}
  </nav>
)
```

---

## Messaging Subsystem

- **Provider**: Sendbird Chat v4 (Core) + UIKit v3
- **Orchestration**: All programmatic group channels (e.g., Draft Negotiation, Contracts, Direct Quotes) must be created or retrieved via `src/services/sendbird/sendbird.service.ts`.
- **UI Dashboard**: The primary user hub for chats is the segmented two-column layout at `/app/mensajes/+Page.tsx`, customized using UIKit's `renderConversationList`.
- **Navigation**: Use URL query params (`?channel=URL`) when redirecting a user after spawning a new channel.

---

## Public Profile & Microsite Routing (`/app/perfil`)

- **Hybrid Route**: Profiles are accessible to unauthenticated visitors as public landing pages / digital business cards for merchants.
- **Route Resolution**: Handled dynamically in `pages/(app)/perfil/+route.ts` and resolved in `src/services/users/userService.ts` (`resolveUserByIdOrSlug`):
  - **UID**: `/app/perfil/pbEr6iR3LjOOsYISvBEkZfwdXlx2`
  - **Commercial/Brand Slug**: `/app/perfil/Dezzpo-Profesionales-Calificados` (Standard/Canonical)
  - **Razon Social Slug**: `/app/perfil/Comunidad-Dezzpo`
  - **Vanity URL**: `/app/perfil/@Dezzpo-Profesionales-Calificados`
  - **Own Profile**: `/app/perfil` (requires auth; falls back to current session UID)
- **Share Card UI**: Profiles feature a **Mi Micrositio Dezzpo** card with a 1-click clipboard copy button and domain/slug breakdown for marketing and client sharing.

---

## Migration Pattern

```typescript
// Current (stub)
export const documentProps = { title: 'Perfil | Comunidad Dezzpo' }
export { default } from '#@/app/pages/perfil/+Page'

// Target (fully migrated TypeScript)
export const documentProps = { title: 'Perfil | Comunidad Dezzpo' }

import { useUserStore } from '@stores/userStore'
import { auth } from '#@/firebase/firebaseClient'

export default function Page() {
  const { userId, displayName } = useUserStore()
  
  return (
    <Container>
      {/* Migrated TypeScript content */}
    </Container>
  )
}
```

---

## Agent Instructions

When modifying app pages:

1. **Use Zustand** for auth state (not legacy Context)
2. **Check `+guard.ts`** for auth protection
3. **Use `@stores/userStore`** for user data
4. **Follow Vike v0.4.x patterns**: `export default` at file level
5. **TypeScript only** for new/migrated code

---

## Testing Coverage

See [docs/testing-architecture.md](../../docs/testing-architecture.md) for full details.

### Guard & Auth Tests
- `tests/integration/auth/authGuard.test.ts` — imports the real `guard` function from `#R/(app)/+guard` and verifies whitelist vs redirect behavior for every route in the tiered access model.
- `tests/e2e/auth/authFlows.spec.ts` — Playwright tests for login, registration, password reset, and unauthenticated route bounce to `/ingreso`.
- `tests/e2e/happy-paths/happyPaths.spec.ts` — smoke tests iterating over critical `/app/*` routes to verify they render without crashing.

### Store Tests
- `tests/unit/stores/userStore.test.ts` — profile hydration, `updateUser()`, `isAuth` flag, contact CRUD.
- `tests/unit/stores/chatStore.test.ts` — `toggleChat()`, `setOpen()`, `setCurrentPathname()`.

### Service Tests
- `tests/unit/services/referralService.test.ts` — code generation, sign-up attribution (+50 pts), self-referral prevention, reward redemption with insufficient points guard.

---

## Referral Program (`/app/invitar-amigos`)

The referral dashboard is a gamified center for "Voz a Voz" growth:

### Features
- **Referral Code & Link**: Auto-generated unique code (`DEZZPO-XXXX`), one-click copy to clipboard.
- **Social Sharing**: Direct buttons for WhatsApp, Facebook, and Email sharing.
- **KPI Cards**: Total Invited, Active Referrals, Points Balance, Total Points Earned.
- **Reward Catalog**: Redeem points for membership discounts, certification discounts, featured profile, or free inspections. Config is centralized in `@config/referrals.config`.
- **Referral History Table**: Audit trail with status chips (Registered / Contract Completed) and points awarded.

### Architecture
- **Config**: `src/config/referrals.config.ts` — `REWARD_CATALOG` and `REFERRAL_POINT_RULES`.
- **Service**: `src/services/referralService.ts` — `getOrCreateReferralCode()`, `getReferralSummary()`, `redeemReward()`.
- **Tracker**: `src/hooks/useReferralTracker.ts` — captures `?ref=CODE` from URL into `sessionStorage`, mounted globally in `PageShell.tsx`.
- **Attribution**: `userService.setUser()` reads the stored ref code on new registration and calls `trackReferralRegistration()`.

### Constraints
- **Never hardcode point values** — always use `REFERRAL_POINT_RULES` from `@config/referrals.config`.
- **Reward catalog** is a `readonly` array; UI components import it from config, not from the service.
- Self-referral is blocked at the service layer.

---

## Multi-Property Management ("Mis Inmuebles" - `/app/mis-inmuebles`)

The property management center allows **Propietario** accounts (`rol === 1`) to register and manage multiple serviced property addresses (houses, apartments, commercial buildings).

### Features
- **Property List**: View all registered properties with alias, street address, city, postal code, and optional city-zone locality chip.
- **Preferred Property ("Preferida")**: Exactly one property can be marked as default. Setting a property as preferred atomically unsets all others using a Firestore `writeBatch`.
- **Deletion Guard**: Prevents deleting the currently preferred property if other properties exist in the list. If it is the last property, deletion is allowed.
- **Address Separation**: The owner's personal/contact address in `Ajustes > Ubicación` remains separate for correspondence.

### Architecture
- **Firestore Subcollection**: `usersPropietariosResidentes/{uid}/inmuebles/{inmuebleId}`.
- **Service**: `@services/inmuebles` (`getInmuebles`, `createInmueble`, `updateInmueble`, `deleteInmueble`, `setPreferidaInmueble`).
- **Feature UI**: `@features/inmuebles` (`InmueblesList`, `InmuebleCard`, `InmuebleFormModal`, `PropertySelector`).
- **Navigation**: Rendered in `PROPIETARIO_SIDEBAR` (first-level `Inicio` section).

### Integration Points
- **`/nuevo-proyecto`**: Uses `<PropertySelector />` to select target property for requirement posting.
- **`/app/suscripciones`**: VIP inspection modal uses `<PropertySelector />` to auto-fill inspection address details.
