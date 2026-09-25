# User Management UX/UI — Implementation Notes (Mock-first)

Covers USER-001 … USER-008. All flows are implemented against an in-memory mock
service so the UX can be reviewed before the backend API is wired up. The
authoritative backend/user-based authorization remains untouched.

---

## 1. Routes

| Route                       | Features              | Visibility |
| --------------------------- | --------------------- | ---------- |
| `/admin/users`              | list, USER-001/003/006/007 actions | Protected (admin) |
| `/admin/users/[id]`         | USER-002 (+ 003/004/005/006/007)   | Protected (admin) |
| `/account/profile`          | USER-008              | Protected (self) |

The avatar menu now links to **Profile** (`/account/profile`) and the sidebar
"Account" group lists Profile + Security.

---

## 2. Architecture

```
src/features/users/
├── types/                     # User, Role, Department, UserStatus
├── schemas/user.schema.ts     # zod: userFormSchema, create/edit schemas
├── mock/
│   ├── data.ts                # 12 mock users, 6 roles, 7 departments
│   └── service.ts             # userService – in-memory async mock (swap point)
├── api/user.queries.ts        # react-query hooks → userService
└── components/
    ├── users-page.tsx         # list page (DataTable + filters + actions)
    ├── user-form-dialog.tsx   # add / edit user dialog (USER-001, USER-003)
    ├── user-actions.tsx       # row actions menu + toggle status (USER-004/005)
    └── user-detail.tsx        # detail page (USER-002 + assign role/dept)
    └── user-profile.tsx       # self profile (USER-008)
```

The old axios-backed `user.api.ts`, `user-form.tsx`, and `user-table.tsx` were
replaced by the mock service layer and the dialog-based UX.

---

## 3. Feature Walkthrough

### USER-001 — Create User
"Users → **Add user**" opens a dialog: name, email, job title, role, and
department. New users start **Active**. Mock enforces a unique email per
session (a duplicate email is rejected).

### USER-002 — View User
Click a user name (or **View** in the row menu) to open `/admin/users/[id]`:
profile header, Contact card (email/phone/title), Access card, and Account card
(created, last active, status). Unknown ids show a graceful "user not found"
state with a back link.

### USER-003 — Edit User
Edit via **Edit** on the list row menu or on the detail page. Name, title,
role, and department are editable; **email is read-only** (identity).

### USER-004 / USER-005 — Disable / Activate
- **Disable** (with confirmation): immediately revokes access; data preserved.
- **Activate**: restores access.
Available from the row menu and the detail page. Status shown as a badge
(`StatusBadge`) and filterable on the list.

### USER-006 — Assign Role
Role is chosen at create/edit time, and can be reassigned inline on the detail
page via the **Access → Role** select. Roles catalog: Admin, Approver, Editor,
Viewer, Procurement Officer, Warehouse Manager.

### USER-007 — Assign Department
Same pattern as role — chosen at create/edit and reassignable inline on the
detail page (**Access → Department**). Catalog: Executive Office, Finance,
Procurement, Warehouse & Inventory, Human Resources, IT, Legal.

### USER-008 — User Profile
`/account/profile` resolves the **signed-in user** through the same catalog
(`usr_01` Malina mirrors the auth mock, so identity + admin record agree) and
shows contact and organization details. Role/department edits are left to
administrators; the page links to the personal Security page.

---

## 4. Mock Service → Real Backend Swap

`userService` (`src/features/users/mock/service.ts`) is the single seam. Replace
its methods with `api` client calls and delete `mock/`. The react-query hooks in
`api/user.queries.ts` need no changes.

| Mock method               | Expected endpoint        |
| ------------------------- | ------------------------ |
| `listUsers`               | `GET /users`             |
| `getUser`                 | `GET /users/:id`         |
| `createUser`              | `POST /users`            |
| `updateUser`              | `PUT /users/:id`         |
| `disableUser` / `activateUser` | `POST /users/:id/disable` / `/activate` |
| `assignRole`              | `PUT /users/:id/role`    |
| `assignDepartment`        | `PUT /users/:id/department` |
| `listRoles` / `listDepartments` | `GET /roles` / `GET /departments` |

---

## 5. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). Routes smoke
tested: `/admin/users`, `/admin/users/usr_01`, `/account/profile` all 200.