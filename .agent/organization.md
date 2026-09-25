# Organization Module UX/UI — Implementation Notes (Mock-first)

Covers ORG-001 … ORG-006. All flows are implemented against an in-memory mock
service so the UX can be reviewed before the backend API is wired up.

---

## 1. Routes

All live under `/admin/organization` with a shared sub-navigation
(`OrganizationNav` in `layout.tsx`):

| Route                                     | Features                     |
| ----------------------------------------- | ---------------------------- |
| `/admin/organization`                     | ORG-001 overview + stats     |
| `/admin/organization/departments`         | ORG-002                      |
| `/admin/organization/positions`           | ORG-003                      |
| `/admin/organization/employees`           | ORG-004                      |
| `/admin/organization/hierarchy`           | ORG-005                      |
| `/admin/organization/approval-authority`  | ORG-006                      |

The existing "Organization" sidebar item already pointed at `/admin/organization`
and now opens the overview with tabs.

---

## 2. Architecture

```
src/features/organization/
├── types/                          # Organization, Department, Position,
│                                   #   Employee, ApprovalRule, enums
├── schemas/organization.schemas.ts # zod schemas for all five entities
├── mock/
│   ├── data.ts                     # org profile, 7 depts, 15 positions,
│   │                               #   16 employees, 10 approval rules
│   └── service.ts                  # organizationService (swap point)
├── api/organization.queries.ts     # react-query hooks → mock service
└── components/
    ├── organization-nav.tsx        # module sub-navigation
    ├── organization-overview.tsx   # ORG-001
    ├── departments-page.tsx / department-form-dialog.tsx   # ORG-002
    ├── positions-page.tsx / position-form-dialog.tsx       # ORG-003
    ├── employees-page.tsx / employee-form-dialog.tsx       # ORG-004
    ├── hierarchy-page.tsx          # ORG-005
    ├── approval-authority-page.tsx / approval-rule-form-dialog.tsx  # ORG-006
    └── entity-row-actions.tsx      # shared edit/delete menu + confirm dialog
```

Patterns mirror `features/users`: DataTable lists, dialog forms, inline error /
loading states, toasts on mutation success, and confirm dialogs for deletions.

---

## 3. Feature Walkthrough

### ORG-001 — Organization
Overview page: org profile card (read-only → inline edit form) and KPI cards
(departments, positions, active employees, active approval rules) wired directly
to the other ORG pages.

### ORG-002 — Departments
Table of departments (name, code, parent, head, members) + status-less CRUD.
Departments can be nested (parent select), each with an optional head (any
employee) and description. Deleting keeps employees on the record.

### ORG-003 — Positions
Table of positions (title, department, grade, description) + CRUD. Positions are
the link between the HR roster and the org structure.

### ORG-004 — Employees
Employee directory with status filter (Active / On leave / Terminated): code,
name, email, department, position, reports-to, employment type, joined date,
phone. When the department changes the position list filters accordingly. Roster
values mirror the auth/users demos (`emp_001` = Malina, matching `usr_01`).

### ORG-005 — Organizational Hierarchy
Collapsible org-chart tree: Organization → departments (nested by parent) →
manager (crowned) → team. Expand/collapse per node, member counts, role titles.

### ORG-006 — Approval Authority
Table of approval rules: document type, module (Procurement/DMS/Warehouse),
amount limit ("any" or min–max LAK), approval level, path (approver →
alternate), and an inline enable/disable toggle. CRUD via dialog; rules drive
future workflow routing.

---

## 4. Sandbox Notes

- Amounts and employee catalog are demo data. Position/department selects update
  each other (department → position filtering).
- In-memory stores reset on full page reload.

---

## 5. Mock Service → Real Backend Swap

`organizationService` (`src/features/organization/mock/service.ts`) is the single
seam. Replace methods with `api` client calls and delete `mock/`; the
react-query layer needs no changes.

| Mock method       | Expected endpoint                        |
| ----------------- | ---------------------------------------- |
| `getOrganization` / `updateOrganization` | `GET/PUT /organization`      |
| `getStats`        | `GET /organization/stats`               |
| `listDepartments` / `create` / `update` / `delete` | `/organization/departments` |
| `listPositions` / `create` / `update` / `delete`   | `/organization/positions`    |
| `listEmployees` / `create` / `update` / `delete`   | `/organization/employees`    |
| `listApprovalRules` / CRUD / `toggle`       | `/organization/approval-authority` |
| `listDocumentTypes` / `listApprovers` | reference data endpoints       |

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). Smoke tested:
all six `/admin/organization*` routes return 200.