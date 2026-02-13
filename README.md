# Comunidad Dezzpo

Professional network for real estate maintenance, remodeling, and finishes. We connect qualified professionals with users through a trusted marketplace.

## Tech Stack
- **Framework**: [Vike v0.4.x](https://vike.dev/) (SSR/SSG)
- **UI Context**: React 18 + MUI v5
- **State**: Zustand (replacing Context/RxJS)
- **Auth**: Firebase Auth (Google + Email)

### 🛠️ EXTERNAL PROVIDERS

| Provider | Purpose | Initialization Dependency |
| --- | --- | --- |
| **Firebase Auth** | Identity & Session | Global `AuthProvider` |
| **Google Auth** | SSO Provider | Firebase Client SDK |
| **Sendbird** | Real-time Messaging | Authenticated UID (Auth-only) |

### 🚦 ROUTING & ACCESS CONTROL

The project utilizes a **Tiered Access Model**:

1. **Public (Marketing):** Unrestricted access.
3. **Hybrid (App Guest):** Accessible by anyone w/ App Shell. UI adapts to auth state.
    - `/app/portal-servicios`
    - `/app/directorio-requerimientos`
    - `/app/ver-requerimiento/[id]`
    - `/app/suscripciones` 
    - `/app/perfil/[id]` (Public View)
4. **Strict (App Auth):** Requires valid session (e.g., `/app/messages`, `/app/settings`).
5. **Admin (Custom Claims):** Requires `claims.admin === true` via Firebase custom claims.
    - `/admin/dashboard` — KPI Command Center
    - `/admin/usuarios` — User Management (DataGrid)
    - `/admin/verificacion` — Identity Verification Queue
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
│   ├── +config.ts                            # Global Vike v1 config
│   ├── +Layout.tsx                           # Root layout wrapper
│   ├── +onRenderClient.tsx                   # Client renderer
│   ├── +onRenderHtml.tsx                     # HTML renderer
│   ├── +Head.tsx                             # Shared <head> meta
│   │
│   ├── (marketing)/                          # Route Group: Marketing Pages (SSR/SSG)
│   │   ├── +Layout.tsx                       # Marketing layout (header/footer)
│   │   └── ...                               # Public pages
│   │
│   ├── (auth)/                               # Route Group: Authentication
│   │   ├── +Layout.tsx                       # Auth layout (centered card)
│   │   ├── ingreso/+Page.tsx                 # Login
│   │   ├── registro/+Page.tsx                # Registration
│   │   └── restaurar-contrasena/+Page.tsx    # Password reset flow
│   │
│   ├── admin/                                # Protected Admin Dashboard
│   │   ├── +Layout.tsx                       # Admin guard + sidebar layout
│   │   ├── dashboard/+Page.tsx               # KPI Command Center
│   │   ├── usuarios/+Page.tsx                # User Management (DataGrid)
│   │   ├── verificacion/+Page.tsx            # Identity Verification Queue
│   │   └── apendice-costos/+Page.tsx         # Cost Appendix Management
### 📂 PROJECT STRUCTURE

* `@src/styles/`: [**STRICT**] Centralized SCSS (kebab-case). Global typography and variables.
* `@src/features/`: Complex, business-logic-heavy modules (e.g., quotes, dashboard).
* `@src/components/`: Pure, reusable UI components (Buttons, Inputs, Layouts).
* `@src/services/`: API and Firebase service layers.
* `@src/stores/`: Global state management (Zustand).
* `pages/`: Vike filesystem routing.

### 🧭 DIRECTORY MAP

```text
/
├── pages/                            # Vike Routing (Filesystem-based)
│   ├── (app)/                        # Route Group: Authenticated App
│   │   ├── +Layout.tsx               # App Shell (Sidebar + Navbar)
│   │   ├── +guard.ts                 # Auth Guard Configuration
│   │   ├── portal-servicios/         # [HYBRID] Service marketplace
│   │   ├── perfil/                   # [HYBRID] User profiles
│   │   │   ├── +Page.tsx             # Profile component
│   │   │   └── +route.ts             # Dynamic route param logic
│   │   │   ├── +Page.tsx                     # User's own profile
│   │   │   ├── @id/+Page.tsx                 # Vanity URL profile
│   │   │   └── +route.ts                     # Route resolver
│   │   │
│   │   ├── ajustes/
│   │   │   ├── +Page.tsx                     # Settings grid
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
│   │   ├── historial-servicios/+Page.tsx     # [NEW] Service history & status
│   │   ├── biblioteca/+Page.tsx
│   │   ├── calificaciones/+Page.tsx          # [NEW] Contract-gated ratings
│   │   ├── certificaciones/+Page.tsx
│   │   ├── contratacion/+Page.tsx
│   │   ├── contratar/+Page.tsx               # [NEW] Contract creation
│   │   ├── proyecto/+Page.tsx
│   │   ├── suscripciones/+Page.tsx
│   │   ├── formas-pago/+Page.tsx             # [NEW] Payment methods (ePayco)
│   │   ├── invitar-amigos/+Page.tsx
│   │   ├── cambiar-clave/+Page.tsx
│   │   ├── configuracion-privacidad/+Page.tsx # [NEW] Privacy toggles
│   │   └── asesorias/+Page.tsx               # [NEW] Advisory Q&A
│   │   │
│   │   └── _error/+Page.tsx                  # Error page
│   │
│   ├── src/
│   │   ├── components/                       # Atomic Design
│   │   │   ├── atoms/                        # Basic UI elements
│   │   │   ├── molecules/                    # Combined atoms
│   │   │   ├── organisms/                    # Complex components
│   │   │   └── templates/                    # Page templates
│   │   │
│   │   ├── features/                         # Feature modules
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── budget/
│   │   │   ├── chat/
│   │   │   └── requirements/
│   │   │
│   │   ├── services/                         # Service Layer
│   │   │   ├── firebase/
│   │   │   ├── firestore/
│   │   │   └── sendbird/
│   │   │
│   │   ├── hooks/                            # Custom hooks
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
| **Admin Control Tower** | ✅ Implemented | `useAdminGuard`, KPI dashboard (Recharts), User DataGrid, Identity verification queue |

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

