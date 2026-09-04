# Admin Control Tower — Agent Constraints

> **SCOPE**: This file governs all pages under `pages/admin/*` (URL prefix `/admin/*`).

## 1. Security Architecture

### Admin Guard (The "Airlock")
- **Hook**: `useAdminGuard()` from `@hooks/useAdminGuard`
- **Mechanism**: Calls `getIdTokenResult(true)` to force-refresh and checks `claims.admin === true`
- **Failure**: Immediate redirect to `/` if claim is missing or false
- **Never** bypass the guard or hardcode admin checks. All admin access flows through this single hook.

### Firestore Rules
- Admin predicate: `isAdmin()` → `request.auth.token.admin == true`
- Admins can read **all** user collections and update user profiles (for verification, bans)
- Admins **cannot** delete user documents

### Bundle Isolation
- Admin service (`@services/admin`) must **only** be imported inside `pages/admin/*` pages
- Never import admin components or services in `(app)/*` or `(marketing)/*` routes
- The admin layout does **not** initialize Sendbird UI components. However, the root moderator ID (`847329`) is programmatically invited to all private negotiation channels for oversight.

## 2. Route Structure

| Route | Module | Description |
|-------|--------|-------------|
| `/admin/dashboard` | KPI Dashboard | User counts, growth trends, revenue potential, contract health |
| `/admin/usuarios` | User Management | DataGrid with search, role/status chips, side drawer detail |
| `/admin/verificacion` | Identity Verification | Queue workbench, split-screen (user data ↔ document), approve/reject |
| `/admin/certificaciones` | Certifications Review | Evaluation queue workbench for comerciante skill verification |
| `/admin/referidos` | Referral Audit | Global referral metrics (KPIs, conversion rate), filterable audit table |
| `/admin/notificaciones` | Broadcast Workbench | Platform-wide mass notification broadcast to all or by role |
| `/admin/tiendas` | Tiendas Workbench | Directory management, multi-branch sedes editor, and submission queue |

## 3. Data Service (`adminService.ts`)

| Function | Returns | Purpose |
|----------|---------|---------|
| `getAdminStats()` | `AdminStats` | Total users, new users (30d), revenue potential |
| `getContractStats()` | `ContractStats` | Contracts by status (pending_payment/active/completed/disputed) |
| `getAllUsers()` | `AdminUserRow[]` | All users from both collections |
| `getPendingVerifications()` | `VerificationItem[]` | Users with `identityVerification.status == 'pending'` |
| `updateVerificationStatus()` | `void` | Approve/reject with optional reason |

### Referral Service (`referralService.ts` — admin queries)
| Function | Returns | Purpose |
|----------|---------|---------|
| `getAllReferralsForAdmin()` | `ReferralRecord[]` | All referral records ordered by `createdAt` desc |

### Social Interceptions Service (`interceptionsRepository.ts` / `adminService.ts`)
| Function | Returns | Purpose |
|----------|---------|---------|
| `getSocialInterceptionStats()` | `Promise<SocialInterceptorStats>` | Real Firestore query without mock fallbacks |
| `subscribeToSocialInterceptions(onUpdate, onError)` | `() => void` | Reactive `onSnapshot` listener with unmount cleanup |

## 4. Dependencies (Admin-Only)

| Package | Usage |
|---------|-------|
| `recharts` | Pie chart (user distribution), Bar chart (contract health) |
| `@mui/x-data-grid` (v7) | High-performance user table with sorting, pagination, search |
| `@mui/material` / `@mui/icons-material` (v6) | Layout, dialogs, chips — same major line as the rest of the app |

**Lockfile note:** The repo pins `@mui/system` to **6.5.0** via `pnpm.overrides` in `package.json` so Data Grid v7 does not pull a conflicting newer `@mui/system`. Before changing MUI or Data Grid majors, run `pnpm why @mui/system` and follow the official migration guides.

### Theme and providers

- Admin UI uses the **same** root `ThemeProvider` and `CssBaseline` as marketing and app (`pages/PageShell.tsx`). Do not wrap admin pages in a second `ThemeProvider`.

---

## 5. Setup Requirements

1. **Service Account Key**: `serviceAccountKey.json` in project root (for `setAdminClaim.ts` script)
2. **Set Admin Claim**: `pnpm dlx ts-node scripts/setAdminClaim.ts <UID>`
3. **Token Refresh**: User must sign out and back in after claim is set

## 6. Coding Constraints

- Follow all global constraints from the root `AGENTS.md`
- Use **atomic Zustand selectors** — never destructure full store
- Use **path aliases** (`@services/admin`, `@hooks/useAdminGuard`) — no relative imports
- All new code must be `.tsx` / `.ts` — no `.jsx`
- Zero `any` policy — use explicit types for all Firestore data

### Zero-Tolerance Policy on Mocks & Prototypes (Admin & Social Automation)
- **Strictly Forbidden**: Hardcoding fallback metrics, simulated counters, or fake user names (e.g. "Carlos Ramirez", "Mariana Duarte") in any admin service or UI component.
- **Empty State Integrity**: When Firestore collections have 0 documents, return real zeroes and empty arrays (`recentEvents: []`), rendering polished empty states rather than mock fallbacks.
- **Comment ID Requirement**: Status `dispatched` requires a verified, non-empty `comment_id` from Meta Graph API. Any failure must be flagged as `failed` with its `errorCode` and `errorDetails`.
- **SSR Safety & Memory Leaks**: Real-time Firestore listeners (`onSnapshot`) must check `typeof window !== 'undefined'` and return cleanup functions (`unsubscribe()`) to prevent memory leaks during SPA navigation or Vike SSR rendering.

## 7. RAG Chatbot Admin Context

### Knowledge Base Management
- **Knowledge file**: `knowledge/dezzpo-core.md` — editable business info for the AI chatbot
- **Seed command**: `pnpm dlx tsx scripts/seed-knowledge.ts` — embeds knowledge into Supabase
- **Web scraper**: `pnpm dlx tsx scripts/seed.ts` — re-crawls site with Firecrawl
- Knowledge entries tagged `source: 'knowledge/*'` are replaced on re-seed; Firecrawl data is preserved

### Environment Variables (Server)
| Variable | Purpose |
|----------|---------|
| `VITE_APP_SUPABASE_PROJECT_URL` | Supabase project URL |
| `VITE_APP_SUPABASE_SECRET_KEY` | Supabase service role key |
| `VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key (2.5 Flash) |

### Monitoring
- Check Gemini quota at: https://aistudio.google.com/ → Rate Limits
- Free tier limits: `gemini-2.5-flash` (5 RPM, 20 RPD), `gemini-embedding-001` (100 RPM)
- Supabase vector table: `dezzpo_documents` (768-dim pgvector, HNSW index)

## 8. Contract & Payment Monitoring (Admin)

### Contract Lifecycle
```
pending_payment → active (after ePayco payment) → completed → disputed
```

### Key Metrics for Dashboard
| Metric | Source | Query |
|--------|--------|-------|
| Pending Payments | `contracts` | `where('status', '==', 'pending_payment')` |
| Active Contracts | `contracts` | `where('status', '==', 'active')` |
| Completed Value | `contracts` | `where('status', '==', 'completed')` → sum `agreedAmount` |
| Disputed Contracts | `contracts` | `where('status', '==', 'disputed')` |

### Payment Environment Variables
| Variable | Purpose |
|----------|---------|
| `VITE_APP_EPAYCO_PUBLIC_KEY` | ePayco public key |
| `VITE_APP_EPAYCO_PRIVATE_KEY` | ePayco private key (server-only) |
| `VITE_APP_PAYCO_TEST` | Test mode flag |

---

## 9. Testing Coverage

See [docs/testing-architecture.md](../../docs/testing-architecture.md) for full details.

### Current Coverage
Admin pages are not yet covered by dedicated unit or integration tests. The following existing tests provide partial coverage:

- `tests/e2e/happy-paths/happyPaths.spec.ts` — general authenticated route smoke tests (does not currently include `/admin/*` routes since they require custom claims).
- `tests/unit/stores/userStore.test.ts` — covers the shared `userStore` that admin pages consume.

### Future Test Candidates
| Test | Type | Priority |
|------|------|----------|
| `useAdminGuard` hook | Unit | High — verify custom claims check and redirect |
| `adminService.getAdminStats()` | Unit | Medium — mock Firestore aggregation |
| Admin Dashboard rendering | Integration | Medium — verify KPI cards with mocked stats |
| Verification Queue approve/reject | Integration | High — verify status transitions |
| Referral Audit `/admin/referidos` rendering | Integration | Medium — verify KPI cards and table with mocked `getAllReferralsForAdmin` |
| `/admin/dashboard` E2E | E2E | Low — requires seeded admin user with claims |
