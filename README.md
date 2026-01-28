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

```bash
src/
├── app/              # Legacy compat (being phased out)
├── components/       # Shared UI components
│   ├── common/       # Generic atoms (buttons, inputs)
│   └── layout/       # App shell (Navbar, Sidebar, Footer)
├── config/           # App-wide configuration (theme, constants)
├── features/         # Domain-specific modules
│   ├── auth/         # Authentication logic & components
│   ├── marketing/    # Public-facing components
│   ├── messaging/    # Sendbird chat integration
│   ├── profile/      # User profile management
│   ├── projects/     # Project creation & management
│   └── quotes/       # Quotation system
├── hooks/            # Custom React hooks (useAuth, useFirestoreQuery)
├── services/         # Typed service layer (Firebase wrappers)
│   ├── firebase/     # Core Firebase config & client
│   └── sendbird/     # Sendbird SDK wrappers
└── stores/           # Global Zustand stores
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

## Legal

Developed by **Dezzpo Inc.**
- [Website](https://www.dezzpo.com/)
- [Console](https://console.firebase.google.com/project/app-comunidad-dezzpo/overview)
