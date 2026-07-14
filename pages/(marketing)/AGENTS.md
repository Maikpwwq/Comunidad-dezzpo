# Marketing Pages - AI Agent Context

> **Scope**: This context applies to all pages under `pages/(marketing)/`.
> These are PUBLIC pages focused on SEO and conversion.

---

## Route Group Configuration

```typescript
// pages/(marketing)/+config.ts
export default {
  prerender: true,  // ← Enable SSG for all marketing pages
} satisfies Config
```

> **Note**: Some public-facing pages (like `portal-servicios`) live in `pages/(app)/` as **Hybrid Routes**. They allow guest access but use the App Layout, not the Marketing Layout.

### MUI + Emotion on marketing pages

- Marketing routes still render inside the global Vike pipeline: `+onRenderHtml` wraps the tree with Emotion `CacheProvider` and `PageShell` (MUI `ThemeProvider` + `CssBaseline`), then extracts critical Emotion styles into `<head>` (after Bootstrap) for correct first paint and hydration.
- Prefer SSR-safe patterns (no `window` / `localStorage` / direct `firebase.auth()` in the first render). Heavy client-only widgets should defer work to `useEffect` or client-only subtrees when necessary.

---

## Pages in This Group

| Route | Purpose | SEO Priority | Notes |
|-------|---------|--------------|-------|
| `/` | Home - Landing with QuickMatch search/CTA | **Critical** | |
| `/nosotros` | About us (history, mission, vision, team) | High | |
| `/contactenos` | Contact info (phone, email, address, map) | Medium | |
| `/asi-trabajamos` | How it works (propietarios + comerciantes) | High | |
| `/comunidad-comerciantes` | For Professionals | **Critical** | |
| `/comunidad-propietarios` | For Property Owners | **Critical** | |
| `/presupuestos` | Request services (informative + form) | High | Links to `/app/nuevo-proyecto` |
| `/ayuda-pqrs` | Help center & FAQ (accordion + AI chatbot) | Medium | Triggers AI chatbot |
| `/legal` | Legal documents (T&C, Privacy, Cookies) | Low | Google Drive links |
| `/blog` | Blog content | Medium | |
| `/profesionales-servicios` | Professional services directory landing | High | |
| `/calificaciones` | Ratings page | Medium | |
| `/apendice-costos` | Cost appendix reference | Medium | |
| `/nuevo-proyecto` | New project wizard | High | 4-step form flow |
| `/comerciante/@slug` | Public merchant profiles | High | Dynamic slugs |
| `/@service/@zone` | Service × Zone discovery pages | **Critical** | Prerendered for all zones |
| `/patrocinadores` | Sponsors page | Low | |
| `/prensa` | Press page | Low | |
| `/dev/typography` | Design system reference (dev only) | None | |

---

## Geographic Coverage & Dynamic Routes

### `@service/@zone` — Discovery Pages

The `/@service/@zone` routes generate service discovery pages for every combination of service category × geographic zone (e.g., `/plomeria/suba`, `/electricidad/soacha`).

#### Centralized Zone Configuration

**CRITICAL**: All zone definitions are centralized in `@assets/data/ListadoZonas.ts`:

| Export | Type | Purpose |
|--------|------|---------|
| `zones` | `string[]` | Array of zone slugs for route generation |
| `zoneNames` | `Record<string, string>` | Slug → human-readable label mapping |

**Consumers in this route group:**
- `+onBeforePrerenderStart.ts` — imports `zones` for static route generation
- `+data.ts` — imports `zoneNames` for label resolution during data fetching

**Rule**: DO NOT hardcode zone lists in any marketing component or route file. Always import from `@assets/data/ListadoZonas`.

#### Coverage

Includes all 20 localities of Bogotá plus adjacent metropolitan municipalities (Soacha, Chía, Cajicá, Zipaquirá, Cota, Funza, Mosquera, Madrid, Facatativá, La Calera, Sopó).

---

## QuickMatch Component

The homepage hero search (`src/features/marketing/components/QuickMatch.tsx`) provides instant fuzzy matching:

- **Categories**: Imported from `@assets/data/ListadoCategorias`
- **Zones**: Dynamically built from `@assets/data/ListadoZonas` (`zoneNames`)
- **Flow**: User types a need → fuzzy-matches against categories → selects zone → navigates to `/{service-slug}/{zone}`

**Rule**: When updating zones, only modify `ListadoZonas.ts`. QuickMatch and all route files will automatically reflect the changes.

---

## Sitemap Generation

`scripts/generate-sitemap.ts` generates `public/sitemap.xml` at build time:

- Imports `zones` from `@assets/data/ListadoZonas`
- Imports `ListadoCategorias` from `@assets/data/ListadoCategorias`
- Generates `Category × Zone` URL matrix (~3100+ URLs)
- Fetches dynamic `comerciante` slugs from Firestore
- Runs as part of `pnpm build` pipeline

---

## Ayuda PQRS Architecture (Redesigned)

The `/ayuda-pqrs` page is a modern FAQ center:

### Structure
- **Gradient hero** with "Centro de Ayuda" title
- **Tabbed accordion** (MUI Accordion) with 3 categories:
  - Propietarios (4 FAQs)
  - Comerciantes (6 FAQs)
  - General (9 FAQs)
- **AI Chatbot CTA card** — replaces old WhatsApp "Chat en vivo" button

### AI Chatbot Integration
- Imports `useChatStore` from `@stores/chatStore`
- "Chatear con IA" button calls `setOpen(true)` + `setPathname('/ayuda-pqrs')`
- This opens the global `ChatWidget` with context-aware retrieval for this page
- **No WhatsApp dependency** — chatbot is 24/7 AI-powered

### FAQ Data Architecture
- All Q&A data is defined as typed arrays in the component (`FAQ_SECTIONS`)
- Same answers are mirrored in `knowledge/dezzpo-core.md` for RAG retrieval
- **When updating FAQ answers**, update BOTH the component data AND the knowledge file

---

## Public Profiles & Messaging

The public profiles (e.g. `/app/perfil/[id]`) are **Hybrid Routes**. They render the `Comentarios.tsx` module which wraps the Sendbird `OpenChannel`. 
> **CRITICAL Security Constraint**: To prevent unauthorized spam and malicious usage from saboteurs, `Comentarios.tsx` **MUST** enforce authentication before rendering the `<SendbirdProvider>`. If the user is a guest (`!userID`), they should see a disabled placeholder state, not the chat interface.

---

## Presupuestos → Nuevo Proyecto Flow

The `/presupuestos` page is **informative** with a "Solicitar Servicios" form:
1. User selects **type of project** and **category of professional**
2. Clicks "Siguiente" → redirected to `/app/nuevo-proyecto`
3. 4-step form: Categoría → Ajustes → Programar Visita → Registrarse

> **Important**: The presupuestos page itself does NOT create the requirement. It only collects initial category selection and forwards to the app route.

---

## SEO Requirements

Every page MUST have proper metadata in `+config.ts`:

```typescript
// pages/(marketing)/nosotros/+config.ts
export default {
  title: 'Sobre Nosotros | Comunidad Dezzpo',
  description: 'Conoce la historia de Comunidad Dezzpo...',
}
```

---

## Agent Instructions

When modifying marketing pages:

1. **Always include title and description** in config or documentProps
2. **Test with SSG**: Run `pnpm build` to verify pre-rendering
3. **Avoid client-only logic**: Content must render on server
4. **Use Vike v0.4.x patterns**: `export default` for page component
5. **SCSS Modules for new pages**: Use `PageName.module.scss` pattern (not global CSS)
6. **Sync FAQ changes**: Update both component data AND `knowledge/dezzpo-core.md`
7. **Zone changes**: Only modify `@assets/data/ListadoZonas.ts` — never hardcode zones locally
8. **STRICT PACKAGE MANAGER POLICY**:
   - **ALWAYS use `pnpm`**.
   - **NEVER use `npm` or `npx`**.
   - Use `pnpm dlx` instead of `npx`.
   - Use `pnpm run <script>` for package scripts.

---

## Testing Coverage

See [docs/testing-architecture.md](../../docs/testing-architecture.md) for full details.

### Nuevo Proyecto (`/nuevo-proyecto`)
- `tests/unit/features/projects/NuevoProyecto.test.tsx` — isolated multi-step form rendering, validation blockers, mocked `setDoc()` payload.
- `tests/integration/projects/NuevoProyectoIntegration.test.tsx` — full form lifecycle: URL param pre-fill, localStorage draft persistence, Firestore submission.
- `tests/e2e/projects/newProjectFlow.spec.ts` — Playwright: authenticated user completes wizard → history redirect.

### SearchBar & QuickMatch
- `tests/unit/features/search/SearchBar.test.tsx` — MUI Autocomplete rendering, filtered options, `navigate()` on selection.
- `tests/integration/search/SearchBarIntegration.test.tsx` — QuickMatch fallback navigation to `/nuevo-proyecto`.
- `tests/e2e/search/searchFlow.spec.ts` — Playwright: hero search → dropdown → microsite navigation.

### Import Convention for Page Components
When importing `+Page.tsx` files from `pages/` into tests, use the `#R/*` alias:
```typescript
import NuevoProyectoPage from '#R/(marketing)/nuevo-proyecto/+Page';
```
