# Automated Testing Architecture

Comunidad Dezzpo implements a strict **three-layer testing pyramid** to ensure UI stability, state management integrity, and happy-path reliability across its tiered access model (Public, Hybrid, Auth, Admin).

---

## 1. Tech Stack

| Tool | Role | Config File |
|------|------|-------------|
| **Vitest** | Central test runner (Layers 1 & 2) | `vitest.config.ts` |
| **React Testing Library** | Component rendering & DOM assertions | — |
| **@testing-library/user-event** | Realistic user interaction simulation | — |
| **@testing-library/jest-dom** | Extended DOM matchers (`toBeInTheDocument`, etc.) | — |
| **jsdom** | Browser environment emulation for Vitest | `vitest.config.ts` → `environment: 'jsdom'` |
| **Playwright** | E2E browser automation (Layer 3) | `playwright.config.ts` |

---

## 2. Directory Structure

```
tests/
├── setup.ts                                          # Global Vitest setup (RTL matchers + Zustand mock factory)
│
├── unit/                                             # Layer 1: Isolated unit tests
│   ├── stores/
│   │   ├── chatStore.test.ts                         # ChatWidget open/close state
│   │   └── userStore.test.ts                         # Auth state, profile, contacts
│   └── features/
│       ├── search/
│       │   └── SearchBar.test.tsx                    # Autocomplete rendering, filtering, navigation
│       └── projects/
│           └── NuevoProyecto.test.tsx                # Multi-step form rendering, validation, Firestore mock
│
├── integration/                                      # Layer 2: Cross-boundary integration tests
│   ├── auth/
│   │   └── authGuard.test.ts                         # Vike +guard.ts whitelist & redirect logic
│   ├── projects/
│   │   └── NuevoProyectoIntegration.test.tsx         # Full form lifecycle (URL params → localStorage → Firestore)
│   └── search/
│       └── SearchBarIntegration.test.tsx             # QuickMatch fallback navigation
│
└── e2e/                                              # Layer 3: Playwright browser tests
    ├── pom/
    │   └── AuthPage.ts                               # Page Object Model for auth flows
    ├── auth/
    │   └── authFlows.spec.ts                         # Login, registration, password reset, route bounce
    ├── projects/
    │   └── newProjectFlow.spec.ts                    # Authenticated project creation → history redirect
    ├── search/
    │   └── searchFlow.spec.ts                        # Homepage QuickMatch → microsite navigation
    └── happy-paths/
        └── happyPaths.spec.ts                        # Smoke tests for 8 critical authenticated routes
```

---

## 3. Layer Details

### Layer 1: Unit Tests (`tests/unit/`)

**Principle**: Total isolation. Every external dependency is mocked — Firestore, Auth, Vike router, context providers.

#### Zustand Store Mock Factory (`tests/setup.ts`)

The global setup intercepts `zustand.create()` and `zustand.createStore()` to:
1. Capture each store's **initial state** at creation time.
2. Register a reset function that calls `store.setState(initialState, true)` after each test.
3. Automatically execute all reset functions in `afterEach`, alongside RTL's `cleanup()`.

This eliminates cross-test contamination from singleton Zustand stores without requiring manual teardown.

```typescript
// Pattern: Automatic Zustand store reset
const { create: actualCreate } = await vi.importActual<typeof import('zustand')>('zustand');

vi.mock('zustand', async (importOriginal) => {
  const actual = await importOriginal<typeof import('zustand')>();
  return {
    ...actual,
    create: (<T>(stateCreator: StateCreator<T>) => {
      const store = actualCreate(stateCreator);
      const initialState = store.getState();
      storeResetFns.add(() => store.setState(initialState, true));
      return store;
    }) as typeof actualCreate,
  };
});
```

> **Known issue**: Stores using Zustand's `persist` middleware with `skipHydration: true` (like `userStore`) may not return a standard store object from `create()`. The mock factory must handle this edge case — if `store.getState` is not a function, the store uses middleware that wraps the return value. See `userStore.ts` line 84 for the specific pattern.

#### Current Unit Test Inventory

| Test File | What It Tests |
|-----------|---------------|
| `chatStore.test.ts` | Initial state (`isOpen: false`), `toggleChat()`, `setOpen()`, `setCurrentPathname()` |
| `userStore.test.ts` | Profile hydration, `updateUser()`, `isAuth` flag, contact array CRUD |
| `SearchBar.test.tsx` | Empty-state rendering, filtered option display, `navigate()` on selection, input clear, keyboard nav |
| `NuevoProyecto.test.tsx` | Step rendering, required-field validation blockers, mocked `setDoc()` payload construction |

#### Mocking Patterns

| Dependency | Mock Strategy |
|------------|---------------|
| `vike/client/router` | `vi.mock()` with `navigate: vi.fn()` |
| `@hooks/usePageContext` | `vi.mock()` returning `{ urlPathname: '/' }` |
| `firebase/firestore` | `vi.mock()` with `setDoc: vi.fn()`, `doc: vi.fn()`, `collection: vi.fn()` |
| `@assets/data/ListadoCategorias` | `vi.mock()` with a minimal fixture array |
| `react-icomoon` | `vi.mock()` returning a simple `<span>` stub |

---

### Layer 2: Integration Tests (`tests/integration/`)

**Principle**: Cross module boundaries with realistic data, but still no network. Tests validate that feature modules compose correctly with Vike routing, auth guards, and localStorage.

| Test File | What It Tests |
|-----------|---------------|
| `authGuard.test.ts` | Imports the real `guard` function from `pages/(app)/+guard.ts`. Asserts that hybrid whitelist routes pass without `isAuthenticated`, while strict routes throw `redirect()`. |
| `NuevoProyectoIntegration.test.tsx` | Simulates URL query params (`?category=plomeria`), validates form pre-fill, tests localStorage draft persistence, traces the complete payload to mocked `setDoc()`. |
| `SearchBarIntegration.test.tsx` | **Flagged gap**: QuickMatch uses component-local `useState`, not a Zustand store. Tests the fallback navigation behavior. Skipped test documents the architectural gap explicitly. |

---

### Layer 3: End-to-End Tests (`tests/e2e/`)

**Principle**: Real browser against the local dev server (`http://localhost:3000`). Playwright boots the server via `pnpm dev` automatically.

#### Page Object Model (POM)

`tests/e2e/pom/AuthPage.ts` abstracts selectors and interactions for auth flows:
- `gotoLogin()` / `gotoRegister()` / `gotoPasswordReset()`
- `login(email, password)` / `register(...)` / `requestPasswordReset(email)`
- Selector constants for form fields, submit buttons, error messages

#### E2E Test Inventory

| Test File | Coverage |
|-----------|----------|
| `authFlows.spec.ts` | Login → dashboard redirect; registration → redirect; password reset; unauthenticated bounce to `/ingreso` |
| `newProjectFlow.spec.ts` | Authenticated user navigates to `/nuevo-proyecto`, fills all 4 steps, submits, verifies redirect |
| `searchFlow.spec.ts` | Types in QuickMatch hero, selects dropdown option, navigates to `/@service/@zone` microsite |
| `happyPaths.spec.ts` | Iterates over 8 critical routes (`/app/cotizar`, `/app/mensajes`, `/app/ajustes`, etc.), asserts no page errors and visible UI |

#### Browser Configuration

Playwright tests run against **3 browser engines** by default:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

Mobile viewports (Pixel 5, iPhone 12) are configured but commented out — uncomment in `playwright.config.ts` to enable.

---

## 4. Running Tests

### Vitest (Layers 1 & 2)

```bash
# Run all unit + integration tests
pnpm exec vitest run

# Watch mode (re-runs on file changes)
pnpm exec vitest

# Run with coverage report
pnpm exec vitest run --coverage

# Run a specific test file
pnpm exec vitest run tests/unit/stores/userStore.test.ts
```

### Playwright (Layer 3)

```bash
# First-time setup: install browser binaries
pnpm exec playwright install

# Run all E2E tests (auto-starts dev server)
pnpm exec playwright test

# Run a specific spec
pnpm exec playwright test tests/e2e/auth/authFlows.spec.ts

# Interactive UI mode
pnpm exec playwright test --ui

# View HTML report after a run
pnpm exec playwright show-report
```

---

## 5. Coverage Requirements

Enforced via `vitest.config.ts`:

| Metric | Threshold |
|--------|-----------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

Coverage excludes: `node_modules`, `dist`, `tests`, config files, `scripts`, `server`.

---

## 6. Adding New Tests

### Naming Conventions
- Unit/Integration: `*.test.ts` or `*.test.tsx`
- E2E: `*.spec.ts`

### Where to Place Tests

| What you're testing | Location |
|---------------------|----------|
| A Zustand store in isolation | `tests/unit/stores/` |
| A UI component with mocked deps | `tests/unit/features/<domain>/` |
| Auth guard logic, form lifecycle | `tests/integration/<domain>/` |
| Full browser user journey | `tests/e2e/<domain>/` |
| Reusable page interaction patterns | `tests/e2e/pom/` |

### Writing a Zustand Store Test

```typescript
import { describe, it, expect } from 'vitest';
import { useMyStore } from '@stores/myStore';

describe('myStore', () => {
  it('starts with default state', () => {
    // No setup needed — the Zustand mock factory in setup.ts
    // handles creation and auto-reset between tests
    const state = useMyStore.getState();
    expect(state.someField).toBe('default');
  });

  it('updates via action', () => {
    useMyStore.getState().someAction('new value');
    expect(useMyStore.getState().someField).toBe('new value');
  });
  // State is automatically reset before the next test
});
```

### Writing an E2E Test with POM

```typescript
import { test, expect } from '@playwright/test';
import { AuthPage } from '../pom/AuthPage';

test('authenticated user can access settings', async ({ page }) => {
  const authPage = new AuthPage(page);
  await authPage.gotoLogin();
  await authPage.login('user@example.com', 'password');
  await page.goto('/app/ajustes');
  await expect(page.locator('h1')).toContainText(/ajustes|configuración/i);
});
```
