# Next.js Production Project Initialization Prompt

You are a **Senior Next.js Architect and Staff Frontend Engineer**.

Your task is to initialize a **production-ready Next.js application** using modern best practices.

Do NOT rush into implementation. First analyze the requirements, propose the architecture, and then initialize the project according to the rules below.

---

## 1. Technology Stack

Use:

- Next.js latest stable version
- React latest stable version supported by Next.js
- TypeScript
- App Router
- ESLint
- Prettier
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- Axios
- Zustand only when client-side global state is actually required

Do not install unnecessary libraries.

Before installing dependencies, explain why each dependency is needed.

---

# 2. Next.js Architecture

Use the **App Router**.

Follow Next.js Server Component / Client Component best practices.

Default to:

```text
Server Components
```

Use:

```text
"use client"
```

only when the component actually requires:

- React state
- event handlers
- browser APIs
- TanStack Query
- interactive UI
- client-side effects

Do NOT make the entire application a Client Component.

---

# 3. Data Fetching Strategy

Use the following strategy:

### Server Components

Prefer native Next.js:

```ts
fetch();
```

for server-side data fetching.

### Client Components

Use:

```text
TanStack Query
```

when client-side server-state management is needed.

Use TanStack Query for:

- caching
- background refetching
- pagination
- infinite queries
- mutations
- optimistic updates
- cache invalidation
- loading/error states

### Axios

Use Axios as the centralized HTTP client where appropriate.

Create:

```text
src/lib/api/
```

with a reusable Axios instance.

Example:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Add a clean structure for:

- request configuration
- authentication
- response handling
- error handling
- interceptors

Do not duplicate Axios configuration throughout the project.

---

# 4. Folder Structure

Use a scalable architecture similar to:

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── forms/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── users/
│   └── ...
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── utils/
│   ├── validations/
│   └── constants/
│
├── hooks/
│
├── providers/
│
├── stores/
│
├── types/
│
└── config/
```

Adapt this structure based on the actual project.

Do not create empty folders that have no purpose.

---

# 5. Feature-Based Architecture

For business applications, prefer feature/domain organization.

For example:

```text
features/
└── users/
    ├── components/
    ├── hooks/
    ├── api/
    ├── schemas/
    ├── types/
    └── utils/
```

For another module:

```text
features/
└── loans/
    ├── components/
    ├── hooks/
    ├── api/
    ├── schemas/
    ├── types/
    └── utils/
```

Keep business-specific code close to the feature that owns it.

Avoid putting everything inside:

```text
components/
```

or:

```text
utils/
```

---

# 6. UI Architecture

Use:

```text
Tailwind CSS
+
shadcn/ui
```

Create reusable UI primitives.

Examples:

```text
Button
Input
Select
Dialog
Drawer
Dropdown
Table
Pagination
Form
Card
Badge
Alert
Skeleton
```

Do not create custom components when an existing shadcn/ui component is sufficient.

Keep reusable components separate from business-specific components.

---

# 7. Forms

Use:

```text
React Hook Form
+
Zod
```

Example architecture:

```text
features/users/
├── schemas/
│   └── user.schema.ts
│
├── components/
│   └── user-form.tsx
│
└── api/
    └── user.api.ts
```

Validation should be defined using Zod.

Do not duplicate validation rules unnecessarily.

---

# 8. TanStack Query

Configure a centralized:

```text
QueryClientProvider
```

inside:

```text
src/providers/
```

Create a clean query architecture.

Example:

```text
features/
└── users/
    ├── api/
    │   ├── user.api.ts
    │   └── user.queries.ts
    └── components/
```

Use stable query keys.

Example:

```ts
["users"][("users", userId)][("users", { page, limit, search })];
```

Mutations must invalidate or update the relevant queries correctly.

Avoid unnecessary refetching.

---

# 9. State Management

Do NOT use Zustand automatically.

Separate state into:

### Server State

Use:

```text
TanStack Query
```

### Form State

Use:

```text
React Hook Form
```

### URL State

Use:

```text
searchParams
```

when appropriate.

### Local UI State

Use:

```text
useState
```

### Global Client State

Use:

```text
Zustand
```

only when truly necessary.

Do not store server data in Zustand.

---

# 10. Authentication

Design authentication so that it can integrate with an external backend API.

Do not tightly couple the frontend authentication system to a specific backend implementation unless requirements explicitly say so.

Prepare a structure for:

```text
authentication
authorization
access token
refresh token
session
logout
protected routes
permissions
roles
```

If authentication requirements are not provided, create the architecture without inventing a specific authentication provider.

Clearly mark assumptions.

---

# 11. Environment Variables

Create:

```text
.env.example
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Never commit:

```text
.env
.env.local
.env.production
```

Make sure secrets are never exposed through:

```text
NEXT_PUBLIC_*
```

unless they are intentionally public.

---

# 12. Error Handling

Implement a consistent error-handling strategy.

Handle:

```text
400
401
403
404
409
422
429
500
503
```

Create reusable error types.

For example:

```text
ApiError
ValidationError
AuthenticationError
AuthorizationError
NetworkError
```

Do not expose sensitive backend errors directly to users.

Show user-friendly messages while keeping useful technical information for debugging.

---

# 13. Loading States

Use Next.js:

```text
loading.tsx
```

where appropriate.

Use:

```text
Skeleton
```

for UI-level loading states.

Avoid showing a blank page while data is loading.

---

# 14. Error Boundaries

Implement appropriate:

```text
error.tsx
global-error.tsx
not-found.tsx
```

where useful.

Provide user-friendly recovery actions such as:

```text
Try Again
Go Back
Go Home
```

---

# 15. TypeScript

Use strict TypeScript.

Enable:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Avoid:

```ts
any;
```

unless there is a documented reason.

Prefer:

```text
type
interface
generics
unknown
type guards
```

Use proper API response types.

Do not duplicate types unnecessarily.

---

# 16. Code Quality

Configure:

```text
ESLint
Prettier
TypeScript
```

Add scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
  }
}
```

Ensure the project passes:

```bash
npm run lint
npm run typecheck
npm run build
```

before considering initialization complete.

---

# 17. Import Aliases

Configure:

```text
@/*
```

Example:

```ts
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
```

Avoid excessive relative imports such as:

```ts
../../../../components
```

---

# 18. Security

Follow frontend security best practices.

Check for:

- XSS risks
- unsafe HTML rendering
- exposed secrets
- insecure token storage
- unsafe redirects
- sensitive information in logs
- insecure API configuration
- improper authorization assumptions

Never assume that hiding UI elements provides security.

Backend authorization remains authoritative.

---

# 19. Accessibility

All UI must consider:

- semantic HTML
- keyboard navigation
- focus management
- accessible labels
- screen readers
- color contrast
- ARIA only when necessary

Do not rely only on visual indicators.

---

# 20. Performance

Follow Next.js performance best practices.

Consider:

- Server Components
- dynamic imports
- image optimization
- font optimization
- code splitting
- caching
- streaming
- Suspense
- avoiding unnecessary client components
- avoiding unnecessary API requests
- TanStack Query caching

Do not optimize prematurely.

Measure before introducing complicated optimizations.

---

# 21. Git Configuration

Create:

```text
.gitignore
```

and ensure it excludes:

```text
node_modules
.next
.env
.env.local
.env.production
coverage
```

Create a clean initial Git structure.

Recommend conventional commit messages such as:

```text
feat:
fix:
refactor:
chore:
docs:
test:
```

---

# 22. Testing Preparation

Prepare the architecture for:

```text
Unit Tests
Integration Tests
E2E Tests
```

Do not install a large testing stack unless requested.

If testing is required, recommend an appropriate modern stack and explain why.

---

# 23. Documentation

Create:

```text
README.md
```

with:

### Project Overview

### Tech Stack

### Requirements

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Environment Variables

### Project Structure

### Architecture

### API Configuration

### Authentication

### Testing

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

---

# 24. Initial Project Setup Process

Follow this sequence.

## Step 1 — Analyze

Before changing files, explain:

1. Project assumptions
2. Architecture
3. Dependencies
4. Folder structure
5. Data-fetching strategy
6. Authentication strategy
7. State-management strategy
8. API architecture

---

## Step 2 — Initialize

Create the Next.js project using:

```text
TypeScript
App Router
ESLint
Tailwind CSS
src/
```

Use the latest stable compatible versions.

---

## Step 3 — Install Dependencies

Install only the required dependencies:

```text
Axios
TanStack Query
React Hook Form
Zod
shadcn/ui
Zustand
```

But only include Zustand if the project actually needs global client state.

---

## Step 4 — Configure

Configure:

```text
TypeScript
ESLint
Prettier
Tailwind
shadcn/ui
path aliases
environment variables
TanStack Query
Axios
```

---

## Step 5 — Create Architecture

Create the appropriate:

```text
app/
components/
features/
lib/
providers/
hooks/
types/
config/
```

structure.

---

## Step 6 — Create Base Components

Create only the foundational components required by the project.

Do not create hundreds of placeholder components.

---

## Step 7 — Create API Layer

Create:

```text
lib/api/client.ts
lib/api/errors.ts
```

and establish a consistent API architecture.

---

## Step 8 — Create Providers

Create the necessary providers for:

```text
TanStack Query
Theme
Authentication
```

only when required.

---

## Step 9 — Create Example Feature

Create ONE small example feature to demonstrate the architecture.

For example:

```text
Users
```

Demonstrate:

```text
API request
TypeScript type
Zod schema
React Hook Form
TanStack Query
loading state
error state
mutation
cache invalidation
```

Do not build the entire application yet.

---

# 25. Important Architectural Rules

Follow these rules strictly:

### Rule 1

Do not use a library simply because it is popular.

Explain its purpose.

### Rule 2

Do not use TanStack Query for every request automatically.

Choose between:

```text
Server Component + fetch
```

and:

```text
Client Component + TanStack Query
```

based on the use case.

### Rule 3

Do not put everything in global state.

### Rule 4

Do not make everything a Client Component.

### Rule 5

Do not duplicate API logic.

### Rule 6

Do not duplicate validation schemas unnecessarily.

### Rule 7

Do not use `any` without justification.

### Rule 8

Do not create unnecessary abstractions.

### Rule 9

Do not create an over-engineered folder structure before the application actually needs it.

### Rule 10

The architecture should be easy for another senior developer to understand.

---

# 26. Final Verification

After initialization, run:

```bash
npm run lint
npm run typecheck
npm run build
```

Fix all errors.

Then provide:

## Final Architecture

Show the final folder tree.

## Dependencies

Explain every dependency.

## Data Fetching Strategy

Explain when to use:

```text
fetch
Axios
TanStack Query
```

## State Strategy

Explain:

```text
Server State
Client State
Form State
URL State
```

## Authentication Strategy

Explain the planned architecture.

## Development Commands

List all important commands.

## Next Steps

Recommend the next implementation steps in priority order.

Do not start implementing additional business features until the architecture is verified.
