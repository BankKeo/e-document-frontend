# e-Document — Frontend

Production-ready Next.js foundation for the e-Document enterprise platform:
Electronic Document Management (e-DMS), Procurement (PMS), and Warehouse &
Inventory (WMS).

## Project Overview

A unified enterprise ERP application built with the Next.js App Router, Server
Components by default, feature-based architecture, and a centralized API layer.
The UI follows a restrained, premium enterprise design language (one product,
three modules).

## Tech Stack

- Next.js (App Router) + React
- TypeScript (strict)
- Tailwind CSS + shadcn/ui (Base UI / base-nova)
- TanStack Query (client-side server state) + TanStack Table (headless tables)
- React Hook Form + Zod (forms & validation)
- Axios (HTTP client with interceptors)
- next-themes (dark mode) + sonner (toasts)
- ESLint + Prettier

## Requirements

- Node.js 20+
- npm

## Installation

```bash
npm install
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Environment Variables

| Variable              | Description                                |
| --------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend REST API (public). |

Never put secrets in `NEXT_PUBLIC_*`. Server-only secrets are configured at
deploy time.

## Project Structure

```text
src/
├── app/
│   ├── (dashboard)/      # AppShell layout, routes, module placeholder
│   ├── error.tsx / loading.tsx / not-found.tsx / global-error.tsx
│   └── layout.tsx
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── layout/           # AppShell, Sidebar, Topbar, Breadcrumbs, CommandMenu
│   ├── data-table/       # enterprise DataTable (sort/search/columns/pagination)
│   ├── dashboard/        # KpiCard and dashboard widgets
│   └── shared/           # PageHeader, EmptyState, ErrorState, StatusBadge, ConfirmDialog
├── config/
│   ├── env.ts
│   └── navigation.ts     # single source of truth for nav / breadcrumbs / search
├── features/             # business features (domain-owned code)
│   ├── users/            # user management: list/detail/profile (mock-first)
│   ├── auth/             # login, sessions, MFA (mock-first) + AuthProvider
│   ├── organization/     # organization, depts, positions, employees,
│   │                     #   hierarchy, approval authority (mock-first)
│   └── rbac/             # roles, permissions, data access (mock-first)
│   └── audit/            # login, activity, document/approval/procurement/
│                         #   inventory/data-change history (mock-first)
│   └── notification/     # in-app inbox, email prefs, alerts (mock-first)
│   └── dms-document/     # document create/version/share/archive (mock-first)
├── lib/
│   ├── api/              # axios instance + typed errors
│   ├── auth/             # token/session helpers
│   └── utils/
├── providers/            # QueryClient, Theme, Toaster
└── types/                # shared types
```

## Architecture

- **Server Components by default.** Add `"use client"` only when state, events,
  browser APIs, interactivity, or TanStack Query are actually needed.
- **Feature folders** (`src/features/<feature>/`) keep types, schemas, API code,
  and components close to the feature that owns them.
- **State separation:** server state → TanStack Query, form state → React Hook
  Form, URL state → `searchParams`, local UI state → `useState`. No global store.
- **Design system first.** Modules build on the shared AppShell, primitives, and
  DataTable so e-DMS, PMS, and WMS feel like one platform.

## API Configuration

Single Axios instance (`src/lib/api/client.ts`):

- attaches `Authorization: Bearer <token>`
- transparently refreshes expired tokens on `401` (single retry)
- normalizes backend errors into typed errors by status:
  `ValidationError` (422), `UnauthorizedError` (401), `ForbiddenError` (403),
  `NotFoundError` (404), `RateLimitError` (429), `NetworkError`

Choose fetch vs TanStack Query per use case: native `fetch` in Server
Components; TanStack Query for client-side caching, pagination, mutations, and
cache invalidation.

## Authentication

Auth UI is implemented end-to-end against an in-memory mock service so the UX
can be reviewed before the backend is wired up. See
`.agent/authentication.md` for details, demo credentials, and the API swap
plan.

Routes & features:

- `/login` — sign in (AUTH-001)
- `/forgot-password`, `/reset-password` — password recovery (AUTH-004/005)
- `/account/security` — change password, session management, MFA (AUTH-006/007/008)
- Sign out from the avatar menu (AUTH-002); silent access-token refresh (AUTH-003)

Session state lives in `src/features/auth/context/auth-context.tsx`
(`AuthProvider`), with dashboard routes gated by `AuthGate`.

Production integration stays decoupled from any provider:

- access tokens in memory (`src/lib/auth/token.ts`)
- refresh tokens expected in an httpOnly cookie set by the backend
- axios response interceptor performs automatic refresh (`src/lib/api/client.ts`)
- roles/permissions types ready in `src/types/auth.ts`

Assumption: the backend exposes `POST /auth/login`, `POST /auth/refresh`, and
`POST /auth/logout`. Backend authorization remains authoritative.

## User Management

Admin user management (`/admin/users` + `/admin/users/[id]`) and the
self-service profile (`/account/profile`) are implemented against an in-memory
mock service. Features: create, view, edit, disable/activate, role & department
assignment, and profile. See `.agent/user.md` for the API swap plan and the
role/department catalogs.

## Organization

The organization module (`/admin/organization`, sub-tabbed) covers the entity
profile, departments, positions, employees, a collapsible org chart, and
approval authority — all mock-first. See `.agent/organization.md`.

## Roles & Access (RBAC)

`/admin/roles` (sub-tabbed) covers role CRUD, the permissions catalog,
role-permission assignment, user-role assignment, department access, and
data-level access — all mock-first. See `.agent/rbac.md`.

## Audit

`/admin/audit` (sub-tabbed, 7 log types) tracks logins, user activity, document,
approval, procurement, inventory, and data-change history with CSV export — all
mock-first. See `.agent/audit.md`.

## Notifications

`/notifications` (sub-tabbed) covers the in-app inbox, approval/rejection/task/
contract/low-stock feeds, and the email notification center with preferences —
all mock-first, with a live unread-count bell in the topbar. See `.agent/notification.md`.

## Documents

`/dms/documents` covers document creation, versioned upload/edit, view, download,
sharing, archive/restore, and trash — all mock-first. See `.agent/document.md`.

## Layout & Navigation

`src/config/navigation.ts` drives the sidebar, breadcrumbs, and the ⌘K command
palette. Module routes not yet implemented render a shared placeholder instead
of a blank page. Route structure uses the `(dashboard)` route group with the
AppShell layout.

## Testing

Testing not installed yet. Recommended stack when needed: Vitest + React
Testing Library (unit/integration) and Playwright (E2E).

## Build

```bash
npm run build
```

## Production

```bash
npm run start
```

## Development Commands

```bash
npm run dev           # start dev server
npm run build         # production build
npm run start         # start production server
npm run lint          # ESLint
npm run format        # Prettier write
npm run format:check  # Prettier check
npm run typecheck     # tsc --noEmit
```
