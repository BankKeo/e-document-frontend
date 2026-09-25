# RBAC UX/UI — Implementation Notes (Mock-first)

Covers RBAC-001 … RBAC-006. All flows are implemented against an in-memory mock
service so the UX can be reviewed before the backend API is wired up. RBAC is
purely administrative UI — authorization itself remains backend-authoritative.

---

## 1. Routes

All live under `/admin/roles` with a shared sub-navigation (`RbacNav`):

| Route                     | Features                          |
| ------------------------- | --------------------------------- |
| `/admin/roles`            | RBAC-001 roles list + CRUD        |
| `/admin/roles/permissions`| RBAC-002 permissions catalog      |
| `/admin/roles/users`      | RBAC-004 user-role assignment     |
| `/admin/roles/[id]`       | RBAC-003/005/006 single role config (tabs) |

The existing "Roles & Permissions" sidebar item now opens the roles list.

---

## 2. Architecture

```
src/features/rbac/
├── types/                          # Role, Permission, DataLevel, scopes
├── schemas/rbac.schemas.ts         # zod role schema
├── mock/
│   ├── data.ts                     # 6 roles, 18 permissions (4 modules),
│   │                               #   role→permission map, dept scopes,
│   │                               #   data levels, user→role map
│   └── service.ts                  # rbacService (swap point)
├── api/rbac.queries.ts             # react-query hooks → mock service
└── components/
    ├── rbac-nav.tsx                # module sub-navigation
    ├── roles-page.tsx / role-form-dialog.tsx   # RBAC-001
    ├── permissions-page.tsx        # RBAC-002
    ├── user-roles-page.tsx         # RBAC-004
    └── role-detail.tsx             # RBAC-003/005/006 (tabs)
```

Also promotes the generic edit/delete row actions to
`src/components/shared/entity-row-actions.tsx` (reused by the organization
module too).

---

## 3. Feature Walkthrough

### RBAC-001 — Roles
Roles list (name, code, description, user count, built-in/custom badge) with
create / edit / delete. Built-in roles can be edited but not deleted. Clicking a
role opens its configuration page.

### RBAC-002 — Permissions
Catalog of granular permissions grouped by module (DMS, Procurement, Warehouse,
Administration) with label, key, description, and an availability toggle.
Disabled permissions are hidden from role assignment lists.

### RBAC-003 — Role-Permission Assignment
Role detail → **Permissions** tab: a checkbox matrix by module. Changes are
local until **Save permissions** persists the assignment.

### RBAC-004 — User-Role Assignment
"User Roles" page lists users (from the same mock roster as user management)
with their assigned role badges. **Assign roles** opens a multi-select dialog;
a user's effective access is the union of their roles.

### RBAC-005 — Department Access
Role detail → **Department access** tab: "All departments" or a restricted set
of specific departments (checkbox list). Controls which department-scoped data
a role can reach.

### RBAC-006 — Data-Level Access
Role detail → **Data level** tab: Full / Department / Own / None (with
explanations) plus a "restrict sensitive documents" toggle. Overlays the
department scope to define the effective read scope.

---

## 4. Sandbox Notes

- User ids mirror the user-management mock (`usr_01` = Malina = Admin), keeping
  demos consistent across modules.
- Role user counts are derived from the user–role assignment map.
- In-memory stores reset on full page reload.

---

## 5. Mock Service → Real Backend Swap

`rbacService` (`src/features/rbac/mock/service.ts`) is the single seam. Replace
methods with `api` client calls and delete `mock/`; the react-query layer stays
unchanged.

| Mock method            | Expected endpoint                        |
| ---------------------- | ---------------------------------------- |
| `listRoles` / CRUD     | `/rbac/roles`                            |
| `listPermissions` / `togglePermission` | `/rbac/permissions`       |
| `listRolePermissions` / `saveRolePermissions` | `/rbac/roles/:id/permissions` |
| `getDepartmentScope` / `saveDepartmentScope` | `/rbac/roles/:id/departments` |
| `getDataAccess` / `saveDataAccess` | `/rbac/roles/:id/data-level`       |
| `listUserRoles` / `assignUserRoles` | `/rbac/user-roles`           |
| `getUsers` / `listDepartments` | reference data endpoints         |

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). Smoke tested:
`/admin/roles`, `/admin/roles/role_admin`, `/admin/roles/permissions`,
`/admin/roles/users` all 200.