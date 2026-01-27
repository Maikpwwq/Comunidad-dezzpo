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

export const guard: GuardSync = (pageContext): void => {
  if (!pageContext.isAuthenticated) {
    throw redirect(`/ingreso?returnTo=${pageContext.urlPathname}`)
  }
}
```

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
