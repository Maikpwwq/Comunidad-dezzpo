# Comunidad Dezzpo

Professional network for real estate maintenance, remodeling, and finishes. We connect qualified professionals with users through a trusted marketplace.

## Tech Stack
- **Framework**: [Vike v0.4.x](https://vike.dev/) (SSR/SSG)
- **Frontend**: React + TypeScript
- **Server**: Hono (via Vike-Photon)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Library**: [MUI v6](https://mui.com/)
- **Backend/Services**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Vercel (Serverless Functions)

## Project Structure

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
│   │   ├── +Page.tsx                         # [RENAME] Home page
│   │   ├── nosotros/+Page.tsx
│   │   ├── contactenos/+Page.tsx
│   │   ├── asi-trabajamos/+Page.tsx
│   │   ├── blog/+Page.tsx
│   │   ├── legal/+Page.tsx
│   │   ├── prensa/+Page.tsx
│   │   ├── patrocinadores/+Page.tsx
│   │   ├── ayuda-pqrs/+Page.tsx
│   │   ├── asesorias/+Page.tsx
│   │   ├── calificaciones/+Page.tsx
│   │   ├── presupuestos/+Page.tsx
│   │   ├── apendice-costos/+Page.tsx
│   │   ├── profesionales-servicios/+Page.tsx
│   │   ├── comunidad-comerciantes/+Page.tsx
│   │   ├── comunidad-propietarios/+Page.tsx
│   │   └── nuevo-proyecto/
│   │       ├── +Page.tsx
│   │       └── +route.ts
│   │
│   ├── (auth)/                               # Route Group: Authentication Pages
│   │   ├── +Layout.tsx                       # [NEW] Auth layout (minimal UI)
│   │   ├── ingreso/+Page.tsx
│   │   ├── registro/+Page.tsx
│   │   ├── restaurar-contrasena/+Page.tsx
│   │   └── aplicar/+Page.tsx
│   │
│   ├── app/                                  # Protected App Routes (SSR + Client)
│   │   ├── +Layout.tsx                       # [MOVE/REFACTOR] AppLayout.jsx
│   │   ├── +guard.ts                         # [NEW] Auth guard for /app/*
│   │   │
│   │   ├── perfil/
│   │   │   ├── +Page.tsx                     # User's own profile
│   │   │   ├── @id/+Page.tsx                 # [NEW] Dynamic public profile
│   │   │   └── +route.ts                     # [REFACTOR] Simplified route
│   │   │
│   │   ├── ajustes/
│   │   │   ├── +Page.tsx                     # Settings page
│   │   │   └── @id/+Page.tsx                 # [OPTIONAL] Admin edit
│   │   │
│   │   ├── cotizar/                          # Quote/Budget flow
│   │   │   ├── +Page.tsx
│   │   │   ├── editar/@id/+Page.tsx
│   │   │   └── ver/@id/+Page.tsx
│   │   │
│   │   ├── requerimiento/                    # Requirements flow
│   │   │   ├── editar/@id/+Page.tsx
│   │   │   └── ver/@id/+Page.tsx
│   │   │
│   │   ├── mensajes/+Page.tsx                # Sendbird Chat integration
│   │   ├── notificaciones/+Page.tsx
│   │   ├── portal-servicios/+Page.tsx
│   │   ├── directorio-requerimientos/+Page.tsx
│   │   ├── historial-servicios/+Page.tsx
│   │   ├── biblioteca/+Page.tsx
│   │   ├── calificaciones/+Page.tsx
│   │   ├── certificaciones/+Page.tsx
│   │   ├── contratacion/+Page.tsx
│   │   ├── contratar/+Page.tsx
│   │   ├── proyecto/+Page.tsx
│   │   ├── suscripciones/+Page.tsx
│   │   ├── formas-pago/+Page.tsx
│   │   ├── invitar-amigos/+Page.tsx
│   │   ├── cambiar-clave/+Page.tsx
│   │   └── configuracion-privacidad/+Page.tsx
│   │   │
│   │   └── _error/+Page.tsx                  # [MOVE] Error page
│   │
│   ├── src/
│   │   ├── components/                       # [RESTRUCTURE] Atomic Design
│   │   │   ├── atoms/                        # Basic UI elements
│   │   │   ├── molecules/                    # Combined atoms
│   │   │   ├── organisms/                    # Complex components
│   │   │   └── templates/                    # Page templates
│   │   │
│   │   ├── features/                         # [NEW] Feature modules
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── budget/
│   │   │   ├── chat/
│   │   │   └── requirements/
│   │   │
│   │   ├── services/                         # [REFACTOR] TypeScript services
│   │   │   ├── firebase/
│   │   │   ├── firestore/
│   │   │   └── sendbird/
│   │   │
│   │   ├── hooks/                            # [NEW] Shared hooks
│   │   ├── stores/                           # [REFACTOR] RxJS state
│   │   ├── types/                            # [NEW] Shared TypeScript types
│   │   ├── assets/                           # [KEEP] Static assets
│   │   ├── fonts/                            # [KEEP] Local fonts
│   │   └── styles/                           # [NEW] Global styles
│   │
│   ├── server/                               # [KEEP] Express server
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
```

## Workflow

### Development
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### Build
```bash
# Build for production
pnpm build

# Preview build
pnpm preview
```

## Migration Status

| Module | Status | Notes |
|--------|--------|-------|
| **Auth** | ✅ Migrated | Uses `@features/auth`, `useAuth` hook, strictly typed |
| **Profile** | ✅ Migrated | Uses `@features/profile`, `userService`, Zustand store |
| **Quotes** | ✅ Migrated | Uses `@features/quotes`, `quotationService`, `draftService` |
| **CSS Standardization** | ✅ Migrated | Enforced `kebab-case`, asset class mapping in place |

## Service Standards

All new services must strictly adhere to the `ServiceResponse<T>` pattern to ensure robust error handling and type safety.

```typescript
// Standard Response Pattern
export type ServiceResponse<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ServiceErrorInfo };

// Example Usage
async function getProfile(id: string): Promise<ServiceResponse<UserProfile>> {
  // ... implementation
}
```

## CSS & Typography Guide

### Naming Convention
Use `kebab-case` for all SCSS classes. `camelCase` is forbidden.

```tsx
// ✅ Correct
<div className={styles['main-container']} />

// ❌ Forbidden
<div className="mainContainer" />
```

### Typography System
Located in `src/styles/components/_typography.scss`.

| Class | Size | Use Case |
|-------|------|----------|
| `.type-hero-title` | 60px → 32px | Hero/landing titles |
| `.type-section-title` | 36px → 24px | Section headers |
| `.type-card-title` | 24px → 18px | Card titles |
| `.type-body-lg` | 18px → 16px | Lead paragraphs |
| `.type-body` | 16px → 14px | Standard content |
| `.type-caption` | 14px → 12px | Captions/metadata |

**Fluid Typography Mixin:**
```scss
@include fluid-type(16px, 24px); // Scales 16px→24px between mobile/desktop
```

### Text Variants
| Class | Style |
|-------|-------|
| `.text-bold` | `font-weight: 700` |
| `.text-italic` | `font-style: italic` |
| `.text-underline` | Underlined text |
| `.text-strikethrough` | Line-through |

### Contrast Classes
| Class | Use Case |
|-------|----------|
| `.text-on-light` | Dark text on white/cream backgrounds |
| `.text-on-dark` | White text on dark backgrounds |
| `.opacidad-negro` | Dark overlay box for image backgrounds |

### Button System
Located in `src/styles/components/_buttons.scss`.

| Class | Style | Use Case |
|-------|-------|----------|
| `.btn-primary-gradient` | Teal-to-blue gradient | Main CTAs (Siguiente, Guardar) |
| `.btn-secondary-outline` | Transparent + border | Secondary (Volver, Cancelar) |
| `.btn-icon-action` | Solid teal + icon | PUBLICAR, CHAT EN VIVO |
| `.btn-floating-action` | Purple + shadow | Asísteme sticky bar |

### Dev Reference
View live typography samples at `/dev/typography`.

## Legal

Developed by **Dezzpo Inc.** | [Website](https://www.dezzpo.com/)

