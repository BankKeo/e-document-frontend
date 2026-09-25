# Authentication UX/UI — Implementation Notes (Mock-first)

Covers AUTH-001 … AUTH-008. The UI and interaction flows are fully implemented
against an in-memory mock service so the product UX can be reviewed and
approved before the backend API is wired up. No data from these flows touches
the real API yet.

---

## 1. Demo Access

| Field    | Value                |
| -------- | -------------------- |
| Email    | `malina@acme.gov`    |
| Password | `Password123!`       |

The login page shows a **Demo access** box with one-click fill.

Mock account switching is simulated via the demo credentials; a second mock user
`kham@acme.gov` (same password) exists in the mock data.

### Sandbox "magic values"

| Value                          | Effect                                     |
| ------------------------------ | ------------------------------------------ |
| Password `00000000` on login   | Simulates temporary account lockout (429). |
| MFA code `000000`              | Simulates an incorrect/expired code.       |
| Reset token `reset_expired`    | Simulates an expired/link already used.    |
| Any other `reset_<…>` token    | Accepts the reset.                         |

---

## 2. Routes

| Route                    | Auth feature   | Visibility |
| ------------------------ | -------------- | ---------- |
| `/login`                 | AUTH-001/008   | Public     |
| `/forgot-password`       | AUTH-004       | Public     |
| `/reset-password?token=` | AUTH-005       | Public     |
| `/account/security`      | AUTH-006/007/008 | Protected (AppShell) |

Dashboard routes render inside `(dashboard)` which is wrapped by
`<AuthGate>`; unauthenticated visitors are redirected to `/login`.

---

## 3. Architecture

```
src/features/auth/
├── types/                     # AuthUser, AuthTokens, UserSession, MfaStatus, …
├── schemas/auth.schemas.ts    # zod schemas + password strength evaluator
├── mock/
│   ├── data.ts                # mock users, sessions, MFA constants
│   └── service.ts             # authService – in-memory async mock (swap point)
├── context/auth-context.tsx   # AuthProvider / useAuth (global session state)
└── components/
    ├── auth-page-shell.tsx        # standalone auth card layout
    ├── auth-gate.tsx              # protected-route gate (redirect to /login)
    ├── login-route.tsx            # /login wrapper + already-authenticated redirect
    ├── login-form.tsx             # AUTH-001 (+ MFA step when account has MFA)
    ├── forgot-password-form.tsx   # AUTH-004
    ├── reset-password-form.tsx    # AUTH-005
    ├── password-input.tsx         # show/hide password field (InputGroup)
    ├── password-strength.tsx      # strength meter + policy checks
    ├── form-field.tsx             # label + control + error/hint a11y wrapper
    ├── change-password-form.tsx   # AUTH-006
    ├── sessions-panel.tsx         # AUTH-007 (+ AUTH-003 refresh UI)
    ├── security-page.tsx          # tabbed "Security" page
    ├── mfa-panel.tsx              # AUTH-008 status + enable/disable/backup
    ├── mfa-setup-dialog.tsx       # AUTH-008 setup wizard (scan → verify → codes)
    ├── backup-codes.tsx           # backup code list + copy buttons
    └── mock-qr-code.tsx           # deterministic placeholder QR (SVG)
```

### Session state

`AuthProvider` (registered in `src/app/layout.tsx`) owns the single source of
truth for the current session:

- `status`: `loading | authenticated | unauthenticated`
- `user`, `tokens`
- `signIn(email, password, remember)` — returns `{ kind: "success" }` or
  `{ kind: "mfa" }` when the account requires MFA.
- `completeMfa(code)` — finishes sign-in when MFA is required.
- `signOut()` — clears returned-tokens state, removes persisted session,
  redirects to `/login` (AUTH-002).
- `refreshSession()` — silent token rotation (AUTH-003).

Persistence (mirrors the real token helpers in `src/lib/auth/token.ts`):

- "Remember me" → session JSON written to `localStorage["auth.session"]`.
- Without "remember me" → session lives in memory only and is lost on reload.
- On boot, a persisted session with an **expired access token** is silently
  refreshed (AUTH-003 demo of automatic rotation).

> Security notes for the real integration: access tokens should stay in memory,
> refresh tokens live in an httpOnly cookie set by the backend, and
> `axios` response interceptor in `src/lib/api/client.ts` already performs
> automatic refresh on `401`. No secret is ever written to `localStorage` in
> production.

---

## 4. Feature Walkthrough

### AUTH-001 — Login
`/login` → centered auth card. Email + password (show/hide), remember me,
"Forgot password?" link, inline error alert (unknown email, wrong password,
lockout). Success → toast + redirect to `/`. If the account has MFA enabled,
the form advances to a 6-digit verification step after the password.

### AUTH-002 — Logout
Sign out is available from the user menu (`src/components/layout/user-menu.tsx`,
avatar dropdown → destructive "Sign Out"). Mock call, session cleared, toast,
redirect to `/login`. Per-session sign-out (revoke) lives under Session
Management.

### AUTH-003 — Refresh Token
Two visible surfaces:
1. **Session Management → Current session** card shows the remaining access
   token lifetime and a **Refresh session** button that rotates the token pair.
2. **Silent boot refresh** — a persisted expired token is refreshed when the app
   loads (in `auth-context.tsx`).

The production amplifier already exists in `src/lib/api/client.ts` (401 → single
retry with refresh).

### AUTH-004 — Forgot Password
`/forgot-password` → email form → confirmation state ("Check your inbox").
Always succeeds to avoid account enumeration. Sandbox reveals a **mock reset
link** so the full flow can be demoed.

### AUTH-005 — Reset Password
`/reset-password?token=…` → new password + confirm with strength meter →
success state → "Go to sign in". Invalid/expired token shows an error alert;
a missing token shows a "request a new link" prompt.

### AUTH-006 — Change Password
"Security → Password" tab. Requires current password; enforces a strength meter
and a "must differ from current" rule. Lives at `/account/security`.

### AUTH-007 — Session Management
"Security → Sessions" tab. Shows the current session (highlighted card with
token TTL) and all other active sessions (device, browser, OS, location, IP,
last active) with per-session **Sign out** (confirm dialog) and a
**Sign out all other sessions** action.

### AUTH-008 — MFA
"Security → Two-factor" tab.
- **Disabled state:** explainer card → **Enable** opens a wizard:
  1. **Scan** — placeholder QR + TOTP secret (copyable).
  2. **Verify** — 6-digit code (any code except `000000` succeeds).
  3. **Backup codes** — 10 one-time codes, each copyable.
- **Enabled state:** status card → **Backup codes** (view/regenerate) and
  **Disable** (requires password, confirm dialog).
- Logging out and back in while MFA is enabled demonstrates the login-time
  verification step (AUTH-001 + AUTH-008 hand-off).

The QR is a deterministic SVG placeholder generated from the secret string; it
is **not** a scannable TOTP QR — swap for a real QR library when wiring the API.

---

## 5. Design System Usage

- shadcn/ui (Base UI) primitives: `Card`, `Input`, `InputGroup`, `Button`,
  `Checkbox`, `Label`, `Alert`, `Badge`, `Dialog`, `Tabs`, `Separator`,
  `Avatar`, `DropdownMenu`, `Tooltip`.
- Forms: React Hook Form + Zod (`@hookform/resolvers`), same pattern as
  `features/users`.
- Standalone auth pages reuse `AuthPageShell`; the AppShell dashboard uses
  `PageHeader` + `Tabs` on the Security page.
- A11y: labelled fields, `aria-invalid` + `aria-describedby` wiring via
  `FormField`, focus rings, password visibility toggle with `aria-pressed`.

---

## 6. Swapping Mock → Real Backend

`authService` (`src/features/auth/mock/service.ts`) is the single seam. Replace
its methods with calls through the shared `api` client
(`src/lib/api/client.ts`) and delete the `mock/` folder. The UI components
should not need changes:

| Mock method                  | Expected endpoint                |
| ---------------------------- | -------------------------------- |
| `signIn`                     | `POST /auth/login`               |
| `verifyMfaChallenge`         | `POST /auth/mfa/verify`          |
| `signOut`                    | `POST /auth/logout`              |
| `refresh`                    | `POST /auth/refresh`             |
| `requestPasswordReset`       | `POST /auth/forgot-password`     |
| `resetPassword`              | `POST /auth/reset-password`      |
| `changePassword`             | `POST /auth/change-password`     |
| `listSessions`               | `GET /auth/sessions`             |
| `revokeSession` / `revokeAllSessions` | `POST /auth/sessions/revoke` |
| `getMfaStatus`, `enableMfa`  | `GET/POST /auth/mfa`             |
| `verifyMfaSetup`, `regenerateBackupCodes`, `disableMfa` | `POST /auth/mfa/…` |

Errors should be mapped through `toApiError` in `src/lib/api/errors.ts` (typed
errors: `UnauthorizedError`, `ValidationError`, `RateLimitError`, …).

---

## 7. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack).