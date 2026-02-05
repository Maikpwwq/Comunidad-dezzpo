# Marketing Pages - AI Agent Context

> **Scope**: This context applies to all pages under `pages/(marketing)/`
> These are PUBLIC pages focused on SEO and conversion.

---

## Route Group Configuration

```typescript
// pages/(marketing)/+config.ts
export default {
  prerender: true,  // ← Enable SSG for all marketing pages
} satisfies Config

> **Note**: Some public-facing pages (like `portal-servicios`) live in `pages/app/` as **Hybrid Routes**. They allow guest access but use the App Layout, not the Marketing Layout.

```

---

## Pages in This Group

| Route | Purpose | SEO Priority |
|-------|---------|--------------|
| `/` | Home - Landing with search/CTA | **Critical** |
| `/nosotros` | About us | High |
| `/contactenos` | Contact form | Medium |
| `/asi-trabajamos` | How it works | High |
| `/comunidad-comerciantes` | For Professionals | **Critical** |
| `/comunidad-propietarios` | For Property Owners | **Critical** |

---

## SEO Requirements

Every page MUST export `documentProps`:

```typescript
// pages/(marketing)/nosotros/+Page.tsx
export const documentProps = {
  title: 'Sobre Nosotros | Comunidad Dezzpo',
  description: 'Conoce la historia de Comunidad Dezzpo...',
}

export default function Page() {
  // Component
}
```

---

## Migration Pattern

Pages currently re-export legacy components:

```typescript
// Current (stub)
export const documentProps = { title: '...', description: '...' }
export { default } from '#@/index/pages/nosotros/+Page'

// Target (fully migrated)
export const documentProps = { title: '...', description: '...' }

export default function Page() {
  return (
    <Container>
      {/* Migrated JSX content */}
    </Container>
  )
}
```

---

## Agent Instructions

When modifying marketing pages:

1. **Always include `documentProps`** with title and description
2. **Test with SSG**: Run `pnpm build` to verify pre-rendering
3. **Avoid client-only logic**: Content must render on server
4. **Use Vike v0.4.x patterns**: `export default` for page component
5. **STRICT PACKAGE MANAGER POLICY**:
   - **ALWAYS use `pnpm`**.
   - **NEVER use `npm` or `npx`**.
   - Use `pnpm dlx` instead of `npx`.
   - Use `pnpm run <script>` for package scripts.

