# e-Document — Frontend

Production-ready Next.js foundation for the e-Document application.

## Project Overview

A document-management frontend built with the Next.js App Router, Server
Components by default, feature-based architecture, and a centralized API layer.

## Tech Stack

- Next.js (App Router) + React
- TypeScript (strict)
- Tailwind CSS + shadcn/ui (Base UI)
- TanStack Query (client-side server state)
- React Hook Form + Zod (forms & validation)
- Axios (HTTP client with interceptors)
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
├── app/                 # routes, layouts, error/loading/not-found
├── components/
│   └── ui/              # shadcn/ui primitives
├── features/            # business features (domain-owned code)
│   └── users/           # example feature
├── lib/
│   ├── api/             # axios instance + typed errors
│   ├── auth/            # token/session helpers
│   └── utils/
├── providers/           # QueryClientProvider
├── types/               # shared types
└── config/              # environment config
```

## Architecture

- **Server Components by default.** Add `"use client"` only when state, events,
  browser APIs, interactivity, or TanStack Query are actually needed.
- **Feature folders** (`src/features/<feature>/`) keep types, schemas, API code,
  and components close to the feature that owns them.
- **State separation:** server state → TanStack Query, form state → React Hook
  Form, URL state → `searchParams`, local UI state → `useState`. No global store
  is installed unless a real need appears.

## API Configuration

Single Axios instance (`src/lib/api/client.ts`):

- attaches `Authorization: Bearer <token>`
- transparently refreshes expired tokens on `401` (single retry)
- normalizes backend errors into typed errors whose class is chosen by status:
  `ValidationError` (422, with field map), `UnauthorizedError` (401),
  `ForbiddenError` (403), `NotFoundError` (404), `RateLimitError` (429),
  `NetworkError` (no response) — see `src/lib/api/errors.ts`.

Choose fetch vs TanStack Query per use case: native `fetch` in Server
Components; TanStack Query for client-side caching, pagination, mutations, and
cache invalidation.

## Authentication

Auth is decoupled from any specific provider and designed to integrate with the
external backend API:

- access tokens are stored in memory (`src/lib/auth/token.ts`)
- refresh tokens are expected in an httpOnly cookie set by the backend
  (fallback: localStorage)
- the axios response interceptor performs automatic refresh
- roles/permissions types are ready in `src/types/auth.ts`

Assumption: the backend exposes `POST /auth/login`, `POST /auth/refresh`, and
`POST /auth/logout`, and returns `{ accessToken, refreshToken? }`. Backend
authorization remains authoritative — the frontend never relies on hiding UI.

## Testing

Testing has not been installed yet. Recommended stack when needed: Vitest + React
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
