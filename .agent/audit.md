# Audit Module UX/UI — Implementation Notes (Mock-first)

Covers AUDIT-001 … AUDIT-007. All log pages are implemented against static,
in-memory mock data so the UX can be reviewed before the real event streams are
wired up.

---

## 1. Routes

All live under `/admin/audit` with a shared sub-navigation (`AuditNav`). The
existing "Audit Logs" sidebar item opens the login history view.

| Route                        | Features              |
| ---------------------------- | --------------------- |
| `/admin/audit`               | AUDIT-001 login history |
| `/admin/audit/activity`      | AUDIT-002 user activity |
| `/admin/audit/documents`     | AUDIT-003 document history |
| `/admin/audit/approvals`     | AUDIT-004 approval history |
| `/admin/audit/procurement`   | AUDIT-005 procurement history |
| `/admin/audit/inventory`     | AUDIT-006 inventory transactions |
| `/admin/audit/data-changes`  | AUDIT-007 data change history |

---

## 2. Architecture

```
src/features/audit/
├── types/              # LoginEvent, UserActivityEvent, DocumentHistoryEntry,
│                       #   ApprovalEvent, ProcurementEvent, InventoryEntry,
│                       #   DataChangeEntry
├── mock/
│   ├── data.ts         # 7–9 sample events per log kind
│   └── service.ts      # typed list methods (swap point)
├── api/audit.queries.ts # react-query hooks (one per kind)
├── utils.ts            # formatDateTime, formatRelative, signNumber, exportCsv
└── components/
    ├── audit-nav.tsx        # module sub-navigation
    ├── shared-audit.tsx     # ActorCell, TimeCell, ExportButton
    ├── login-history-page.tsx         # AUDIT-001
    ├── user-activity-page.tsx         # AUDIT-002
    ├── document-history-page.tsx      # AUDIT-003
    ├── approval-history-page.tsx      # AUDIT-004
    ├── procurement-history-page.tsx   # AUDIT-005
    ├── inventory-history-page.tsx     # AUDIT-006
    └── data-change-history-page.tsx   # AUDIT-007
```

Every page uses the shared `DataTable` (search, sort, columns, pagination) plus
a per-kind filter and a working **Export CSV** button (client-side blob
download).

---

## 3. Feature Walkthrough

### AUDIT-001 — Login History
Sign-in events: when, user, status (success/failed), method (password, MFA, SSO,
session, with a reason for failures), device/browser, location/IP. Filter by
status.

### AUDIT-002 — User Activity
Module-scoped actions (created/updated/approved/exported…): user, module, action,
target, detail, IP. Filter by module.

### AUDIT-003 — Document History
Per-document lifecycle: document + ref + version, action badge (created/edited/
viewed/downloaded/approved/rejected/deleted), user, summary. Filter by action.

### AUDIT-004 — Approval History
Approval trail: document ref/type, requester, decision (approved/rejected/
requested/sent back), level, decider, comment. Filter by decision.

### AUDIT-005 — Procurement History
Requisition/tender/order/contract events with reference, type, stage,
description. Filter by type.

### AUDIT-006 — Inventory Transactions
Stock movements (in/out/adjustment/transfer) with signed quantity, balance after,
warehouse, item, reference. Signed quantities color-coded. Filter by type.

### AUDIT-007 — Data Change History
Field-level diffs (entity, record, field, before → after, changed by). Filter by
entity; before/after rendered with an arrow column.

---

## 4. Sandbox Notes

- Timestamps are generated relative to load time (`ago(minutes)`), so the
  "x m/h/d ago" cells always look current.
- All events reference the same demo roster used by auth/users/organization for
  a consistent narrative (e.g. Malina disabling Ketsana appears in both Login
  history and Data changes).
- Data resets on reload (static mock).

---

## 5. Mock → Real Backend Swap

`auditService` (`src/features/audit/mock/service.ts`) is the single seam. Replace
each `list*Events()` with an API call (each returns an array; the UI needs no
changes):

| Mock method            | Expected endpoint   |
| ---------------------- | ------------------- |
| `listLoginEvents`      | `GET /audit/login-history` |
| `listActivityEvents`   | `GET /audit/user-activity` |
| `listDocumentEvents`   | `GET /audit/documents` |
| `listApprovalEvents`   | `GET /audit/approvals` |
| `listProcurementEvents`| `GET /audit/procurement` |
| `listInventoryEvents`  | `GET /audit/inventory` |
| `listDataChangeEvents` | `GET /audit/data-changes` |

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). All seven
`/admin/audit*` routes smoke tested (200).