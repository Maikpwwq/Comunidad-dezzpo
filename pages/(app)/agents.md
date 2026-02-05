# App Dashboard - AI Agent Context

> **Scope**: This context applies to all pages under `pages/app/`
> These are PROTECTED pages requiring authentication.

---

## Route Configuration

```typescript
// pages/app/+config.ts
export default {
  prerender: false,  // ← Dynamic content, no SSG
} satisfies Config
```

---

## Authentication Guard

All `/app/*` routes are protected by `+guard.ts`:

```typescript
// pages/app/+guard.ts
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
