# Admin Control Tower — Agent Constraints

> **SCOPE**: This file governs all pages under `pages/(admin)/*`.

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
- Admin service (`@services/admin`) must **only** be imported inside `(admin)/*` pages
- Never import admin components or services in `(app)/*` or `(marketing)/*` routes
- The admin layout does **not** initialize Sendbird

## 2. Route Structure

| Route | Module | Description |
|-------|--------|-------------|
| `/admin/dashboard` | KPI Dashboard | User counts, growth trends, revenue potential, contract health |
| `/admin/usuarios` | User Management | DataGrid with search, role/status chips, side drawer detail |
| `/admin/verificacion` | Identity Verification | Queue workbench, split-screen (user data ↔ document), approve/reject |

## 3. Data Service (`adminService.ts`)

| Function | Returns | Purpose |
|----------|---------|---------|
| `getAdminStats()` | `AdminStats` | Total users, new users (30d), revenue potential |
| `getContractStats()` | `ContractStats` | Contracts by status (active/completed/disputed) |
| `getAllUsers()` | `AdminUserRow[]` | All users from both collections |
| `getPendingVerifications()` | `VerificationItem[]` | Users with `identityVerification.status == 'pending'` |
| `updateVerificationStatus()` | `void` | Approve/reject with optional reason |

## 4. Dependencies (Admin-Only)

| Package | Usage |
|---------|-------|
| `recharts` | Pie chart (user distribution), Bar chart (contract health) |
| `@mui/x-data-grid` | High-performance user table with sorting, pagination, search |

## 5. Setup Requirements

1. **Service Account Key**: `serviceAccountKey.json` in project root (for `setAdminClaim.ts` script)
2. **Set Admin Claim**: `pnpm dlx ts-node scripts/setAdminClaim.ts <UID>`
3. **Token Refresh**: User must sign out and back in after claim is set

## 6. Coding Constraints

- Follow all global constraints from the root `agents.md`
- Use **atomic Zustand selectors** — never destructure full store
- Use **path aliases** (`@services/admin`, `@hooks/useAdminGuard`) — no relative imports
- All new code must be `.tsx` / `.ts` — no `.jsx`
- Zero `any` policy — use explicit types for all Firestore data
