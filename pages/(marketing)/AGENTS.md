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
```

> **Note**: Some public-facing pages (like `portal-servicios`) live in `pages/(app)/` as **Hybrid Routes**. They allow guest access but use the App Layout, not the Marketing Layout.

### MUI + Emotion on marketing pages

- Marketing routes still render inside the global Vike pipeline: `+onRenderHtml` wraps the tree with Emotion `CacheProvider` and `PageShell` (MUI `ThemeProvider` + `CssBaseline`), then extracts critical Emotion styles into `<head>` (after Bootstrap) for correct first paint and hydration.
- Prefer SSR-safe patterns (no `window` / `localStorage` / direct `firebase.auth()` in the first render). Heavy client-only widgets should defer work to `useEffect` or client-only subtrees when necessary.

---

## Pages in This Group

| Route | Purpose | SEO Priority | Notes |
|-------|---------|--------------|-------|
| `/` | Home - Landing with search/CTA | **Critical** | |
| `/nosotros` | About us (history, mission, vision, team) | High | |
| `/contactenos` | Contact info (phone, email, address, map) | Medium | |
| `/asi-trabajamos` | How it works (propietarios + comerciantes) | High | |
| `/comunidad-comerciantes` | For Professionals | **Critical** | |
| `/comunidad-propietarios` | For Property Owners | **Critical** | |
| `/presupuestos` | Request services (informative + form) | High | Links to `/app/nuevo-proyecto` |
| `/ayuda-pqrs` | Help center & FAQ (accordion) | Medium | Triggers AI chatbot |
| `/legal` | Legal documents (T&C, Privacy, Cookies) | Low | Google Drive links |

---

## Ayuda PQRS Architecture (Redesigned)

The `/ayuda-pqrs` page was redesigned as a modern FAQ center:

### Structure
- **Gradient hero** with "Centro de Ayuda" title
- **Tabbed accordion** (MUI Accordion) with 3 categories:
  - Propietarios (4 FAQs)
  - Comerciantes (6 FAQs)
  - General (9 FAQs)
- **AI Chatbot CTA card** — replaces old WhatsApp "Chat en vivo" button

### Key Files
| File | Purpose |
|------|---------|
| `+Page.tsx` | Main page component with MUI Accordion, tabs, AI CTA |
| `AyudaPqrs.module.scss` | SCSS module with gradient hero, accordion styling, AI card |

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
7. **STRICT PACKAGE MANAGER POLICY**:
   - **ALWAYS use `pnpm`**.
   - **NEVER use `npm` or `npx`**.
   - Use `pnpm dlx` instead of `npx`.
   - Use `pnpm run <script>` for package scripts.
