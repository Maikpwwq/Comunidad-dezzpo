# Automated Testing Architecture & Quality Assurance Master Guide

> **Scope**: Comunidad Dezzpo PWA (Vike.js v0.4, React 19, Hono API, Firebase Auth/Firestore/Storage, Zustand, ePayco)  
> **System of Record**: This document is the single source of truth for testing patterns, emulator setups, security rule validation, property-based fuzzing, E2E multi-role specs, mutation testing, accessibility audits, and CI/CD pipelines.

---

## 1. Quality & Risk Architecture (STRIDE Threat Matrix)

Before writing test suites, a formal security audit (**Fase 0**) mapped all architectural threat vectors across the system:

| Threat Category (STRIDE) | Risk Target | Mitigation / Verification | Test Coverage Layer |
|---|---|---|---|
| **Spoofing** | Unauthorized UID creation in `/users*` or `certificationRequests` | Enforce `request.auth.uid == userId` and `comercianteId == request.auth.uid` | Layer 2: `firestore.rules.test.ts` |
| **Tampering** | Modifying contract status or price quotes | Restrict update rights to contract participants; ePayco HMAC MD5 signature generation server-side | Layer 1: `paymentSecurity.property.test.ts`<br>Layer 2: `firestore.rules.test.ts` |
| **Repudiation** | Denying referral registration or reward redemption | Immutable referral audit trail (`referrals`, `referralRedemptions`), `delete: false` on critical collections | Layer 1: `referralCode.property.test.ts`<br>Layer 2: `firestore.rules.test.ts` |
| **Information Disclosure** | Horizontal data leakage in `quotations`, `contracts`, or `verifications/{uid}` storage assets | Strict participant matching in Firestore rules; `isOwner(userId)` checks in Cloud Storage rules | Layer 2: `firestore.rules.test.ts`, `storage.rules.test.ts` |
| **Denial of Service** | Oversized file uploads, UTF-8 string fuzzing in forms | `isUnderMaxSize(10)` & `isImage()` rules in Storage; `fast-check` string fuzzing in forms | Layer 1: `slugifyAndZones.property.test.ts`<br>Layer 2: `storage.rules.test.ts` |
| **Elevation of Privilege** | Non-admin access to `/admin/*` routes or broadcast notifications | `useAdminGuard` hook checking `claims.admin === true`; `isAdmin()` Firestore helper | Layer 2: `firestore.rules.test.ts`<br>Layer 3: `adminSecurityGuard.spec.ts` |

---

## 2. Tech Stack & Test Ecosystem

| Tool | Role | Config / Execution File |
|------|------|-------------------------|
| **Vitest 3.x** | Test runner for unit & integration tests | `vitest.config.ts` |
| **jsdom** | DOM environment emulation for Vitest | `vitest.config.ts` (`environment: 'jsdom'`) |
| **fast-check** | Property-based fuzzing engine | `tests/unit/**/*.property.test.ts` |
| **@firebase/rules-unit-testing** | Firebase Security Rules unit test framework | `tests/integration/rules/*.test.ts` |
| **Firebase Local Emulator Suite** | Isolated Auth (9099), Firestore (8080), Storage (9199) | `firebase.json` |
| **Playwright** | E2E multi-role browser automation (Chromium, Firefox, WebKit) | `playwright.config.ts` |
| **@axe-core/playwright** | Automated WCAG 2.1 AA accessibility audit | `tests/e2e/a11y/accessibility.spec.ts` |
| **StrykerJS** | Mutation testing runner for service logic | `stryker.config.json` |
| **GitHub Actions** | Automated CI (PR gate) and Nightly workflow automation | `.github/workflows/ci.yml`, `nightly.yml` |

---

## 3. Directory Structure

```
tests/
├── setup.ts                                          # Global Vitest setup (RTL matchers + Zustand store mock factory)
│
├── unit/                                             # Layer 1: Unit & Property-Based Tests
│   ├── components/
│   │   ├── PropertySelector.test.tsx                 # Atomic property selector component tests
│   │   └── UserRankingBadge.test.tsx                 # Badge classification chip rendering tests
│   ├── features/
│   │   ├── search/SearchBar.test.tsx                 # Autocomplete search & route navigation
│   │   └── projects/NuevoProyecto.test.tsx           # Multi-step project wizard
│   ├── services/
│   │   ├── paymentSecurity.property.test.ts          # Property-based MD5 signature fuzzing
│   │   ├── referralCode.property.test.ts             # Referral code invariant fuzzing
│   │   ├── paymentService.test.ts                    # ePayco checkout payload construction
│   │   ├── referralService.test.ts                   # Attribution, points, rewards logic
│   │   ├── blogService.test.ts                       # Blog CRUD & slug generation
│   │   ├── notificationService.test.ts               # Hybrid notification dispatch
│   │   └── asesoriaService.test.ts                   # Technical advisory Q&A CRUD
│   ├── stores/
│   │   ├── userStore.property.test.ts                # Zustand store state invariants
│   │   ├── userStore.test.ts                         # Store actions & auth persistence
│   │   └── chatStore.test.ts                         # ChatWidget state
│   └── utilities/
│       └── slugifyAndZones.property.test.ts          # Property tests for slugify & ListadoZonas
│
├── integration/                                      # Layer 2: Integration & Security Rules Tests
│   ├── auth/
│   │   └── authGuard.test.ts                         # Vike +guard.ts whitelist & redirect logic
│   ├── projects/
│   │   └── NuevoProyectoIntegration.test.tsx         # Full form lifecycle & localStorage draft sync
│   ├── search/
│   │   └── SearchBarIntegration.test.tsx             # QuickMatch fallback navigation
│   └── rules/
│       ├── firestore.rules.test.ts                   # 14 test groups: full collection isolation
│       └── storage.rules.test.ts                     # 5 test groups: site, profiles, verifications
│
└── e2e/                                              # Layer 3: Playwright E2E & Accessibility Tests
    ├── pom/
    │   ├── AuthPage.ts                               # POM for auth forms
    │   ├── DashboardPage.ts                          # POM for Admin Control Tower
    │   └── ContractPage.ts                           # POM for contract & payment management
    ├── auth/
    │   └── authFlows.spec.ts                         # Login, registration, password reset
    ├── flows/
    │   └── completeContractLifecycle.spec.ts         # Propietario + Comerciante flows + page crash guard
    ├── admin/
    │   └── adminSecurityGuard.spec.ts                # Admin claim enforcement & route guard
    ├── projects/
    │   └── newProjectFlow.spec.ts                    # New project wizard E2E
    ├── search/
    │   └── searchFlow.spec.ts                        # Homepage QuickMatch search
    ├── happy-paths/
    │   └── happyPaths.spec.ts                        # Authenticated route smoke tests
    └── a11y/
        └── accessibility.spec.ts                     # axe-core WCAG 2.1 AA audit
```

---

## 4. Layer Breakdown & Test Patterns

### Layer 1: Unit & Property-Based Tests (`tests/unit/`)

#### Zustand Store Mock Factory (`tests/setup.ts`)
Interprets `zustand.create()` and `zustand.createStore()` calls globally:
- Captures initial state during instantiation.
- Registers auto-reset callbacks calling `store.setState(initialState, true)`.
- Automatically executes reset callbacks in `afterEach()` alongside React Testing Library `cleanup()`.

#### Property-Based Testing (`fast-check`)
Uses generative fuzzing to verify mathematical invariants over thousands of generated inputs:
```typescript
// Example: ePayco Signature Fuzzing
fc.assert(
    fc.property(
        fc.string(), fc.string(), fc.string(), fc.integer({ min: 1000 }), fc.constant('COP'),
        (custId, pKey, invoice, amount, currency) => {
            const sig = generateEpaycoSignature(custId, pKey, invoice, amount, currency)
            expect(sig).toMatch(/^[a-f0-9]{32}$/)
        }
    )
)
```

---

### Layer 2: Integration & Security Rules Tests (`tests/integration/`)

#### Firebase Security Rules Emulation (`tests/integration/rules/`)
Runs against the **Firebase Local Emulator Suite** (ports: Auth `9099`, Firestore `8080`, Storage `9199`). **Zero production database calls.**

- **`firestore.rules.test.ts`**: Tests `allow` and `deny` rules for all collections:
  - Quotations (`/quotations`): Merchants cannot read other merchants' quotes.
  - Contracts (`/contracts`): Only client, provider, or admin can read; deletions prohibited.
  - User Profiles (`/users*`): Public read, owner-only write, UID spoofing blocked.
  - Subcollections (`inmuebles`, `paymentMethods`): Restricted strictly to owner or admin.
  - Certifications & Inspections: Restricted to applicant or admin.
  - Referrals & Redemptions: Participant-only read, admin-only status updates.
  - Notifications: Recipient or broadcast (`ALL`) read; admin-only write.
  - Subscriptions, Blog, Asesorias, Funnel Events, Categorias: Public vs Admin rules verified.
  - Catch-all: Denies access to unmapped collections.

- **`storage.rules.test.ts`**: Tests Cloud Storage security:
  - Public static assets (`/site/**`, `/html/**`): Public read, admin-only upload.
  - Profiles (`/profiles/{userId}/**`): Public read, owner upload, **image-only MIME validation** (`image/*`), max 10MB limit.
  - Identity Verifications (`/verifications/{userId}/**`): Private read/write reserved for owner or admin.
  - Catch-all: Denies unhandled paths.

---

### Layer 3: Playwright E2E Multi-Role & Accessibility (`tests/e2e/`)

#### Page Object Models (POMs)
- **`AuthPage.ts`**: Encapsulates login, registration, role selection, password reset.
- **`DashboardPage.ts`**: Encapsulates Admin Control Tower KPIs, monetization cards, classification tabs.
- **`ContractPage.ts`**: Encapsulates contract cards, status badges, ePayco payment redirects.

#### Cross-Role Page Crash Guard
`completeContractLifecycle.spec.ts` includes an automated crash guard scanning 11 critical authenticated routes (`/app/portal-servicios`, `/app/directorio-requerimientos`, `/app/ajustes`, `/app/mensajes`, `/app/notificaciones`, `/app/invitar-amigos`, `/app/calificaciones`, `/app/historial-servicios`, `/app/formas-pago`, `/app/certificaciones`, `/app/suscripciones`) for unhandled runtime exceptions or white-screen rendering failures.

#### Admin Security Guard
`adminSecurityGuard.spec.ts` verifies that non-admin users attempting to visit any of the 7 `/admin/*` routes are immediately redirected without data leakage or layout flickering.

#### Accessibility Audit (axe-core)
`accessibility.spec.ts` runs `@axe-core/playwright` across 6 public pages and 3 hybrid routes to enforce WCAG 2.1 AA compliance, filtering for critical/serious accessibility violations.

---

## 5. Execution Commands & Standard Scripts

All commands are standardized in `package.json` using `pnpm`:

```bash
# Unit + Integration + Property Tests (Vitest + Fast-Check)
pnpm test                         # Run all unit, property, and component tests
pnpm test:coverage                # Run tests with V8 coverage report (80% threshold)
pnpm test:watch                   # Vitest interactive watch mode

# Security Rules Integration (Firebase Local Emulator Suite)
pnpm test:emulators               # Runs firestore.rules.test.ts and storage.rules.test.ts against emulators

# E2E & Accessibility (Playwright + axe-core)
pnpm test:e2e                     # Run Playwright multi-browser E2E suite
pnpm test:e2e:ui                  # Interactive Playwright UI mode
pnpm exec playwright test tests/e2e/a11y/ # Run WCAG 2.1 AA accessibility audit

# Mutation Testing (StrykerJS)
pnpm test:stryker                 # Run StrykerJS mutation testing on src/services/**/*.ts

# CI/CD Quality Gate
pnpm lint:gate                    # Zero ESLint warnings gate
pnpm typecheck                    # TypeScript compiler verification (tsc --noEmit)
```

---

## 6. Coverage Thresholds & Quality Gates

Enforced in `vitest.config.ts`:

| Metric | Threshold |
|---|---|
| **Statements** | 80% |
| **Branches** | 75% |
| **Functions** | 80% |
| **Lines** | 80% |

- **Exclusions**: `node_modules`, `dist`, `tests`, `scripts`, `server` (Hono API covered via separate integration tests).

---

## 7. CI/CD Workflows (GitHub Actions)

### 1. PR Gate (`.github/workflows/ci.yml`)
Triggers on every Pull Request and Push to `master`:
1. **Lint & Typecheck**: `pnpm lint:gate` + `pnpm typecheck`
2. **Unit & Component Tests**: `pnpm test:coverage` (uploads coverage artifact)
3. **Firebase Security Rules**: `pnpm test:emulators` (starts Firebase Local Emulators with Java 21)
4. **Production Build**: `pnpm build` verification

### 2. Nightly Suite (`.github/workflows/nightly.yml`)
Triggers daily at 00:00 UTC:
1. **Parallel Playwright E2E**: Multi-browser execution on Chromium and Firefox.
2. **StrykerJS Mutation Testing**: Verifies test suite resilience on service modules.
3. **axe-core Accessibility Audit**: Full WCAG 2.1 AA scan.
4. **Summary Aggregation**: Fails workflow if any job encounters critical regressions.
