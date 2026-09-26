# Procurement Modules UX/UI — Implementation Notes (Mock-first)

Covers PLAN-001…010, PR-001…013, SUP-001…012, TENDER-001…018, CON-001…015,
DEL-001…011, and ANA-001…010. All flows run against in-memory mock services so
the UX can be reviewed before the backend is wired up.

---

## 1. Routes

| Route                              | Features                                        |
| ---------------------------------- | ----------------------------------------------- |
| `/procurement`                     | Analytics dashboard (spend, pipeline, KPIs)     |
| `/procurement/plans` `[id]`        | PLAN-001…010 procurement plans                 |
| `/procurement/requisitions` `[id]` | PR-001…013 purchase requisitions               |
| `/procurement/suppliers` `[id]`    | SUP-001…012 suppliers (lifecycle + documents)  |
| `/procurement/tenders` `[id]`      | TENDER-001…018 tender / e-bidding              |
| `/procurement/contracts` `[id]`    | CON-001…015 contracts                          |
| `/procurement/deliveries` `[id]`   | DEL-001…011 deliveries                         |

---

## 2. Architecture

```
src/features/procurement-*/          # one feature folder per module
├── types/                           # domain types (e.g. Contract, Tender)
├── mock/
│   ├── data.ts                      # seed records
│   └── service.ts                   # in-memory CRUD + lifecycle methods
├── api/*.queries.ts                 # react-query hooks (swap seam)
├── utils.ts                         # formatCurrency and helpers
└── components/
    ├── *-list-page.tsx              # DataTable + KPIs + create dialog
    ├── *-detail.tsx                 # lifecycle stepper, items, actions
    └── create-*.dialog.tsx          # creation forms
```

The procurement analytics module (`src/features/procurement-analytics/`)
aggregates across the six mock services for the dashboard at `/procurement`
and `/analytics`.

---

## 3. Feature Notes

### Procurement Plans (PLAN)
Draft with line items, budget, planned date (PLAN-001…007). Approval lifecycle
Draft → Submitted → Approved (PLAN-008); revisions via re-edit; monitoring KPIs
in list header.

### Purchase Requisitions (PR)
Items with specification, quantity, estimated price, required date
(PR-002…006), attachments, and the approval pipeline displayed as a stepper:
Department → Budget → Procurement (PR-008/009). Return and cancel actions
(PR-010/011/012); full history trail (PR-013).

### Suppliers (SUP)
Lifecycle stepper Draft → Submitted → Under Review → Verified → Approved →
Active → Suspended → Blacklisted. Registration dialog (SUP-001/003), contacts
(SUP-007), bank info (SUP-008), documents (SUP-005), categories (SUP-006), and
hazard flagging.

### Tenders (TENDER)
Tender with schedule, documents, evaluation committee, and a bids table.
Publish (TENDER-006), submit a bid (TENDER-009), score bids with 60/40
technical/financial weights (TENDER-012/013/014), award recommendation
(TENDER-016/017), and cancel (TENDER-018).

### Contracts (CON)
Lifecycle Draft → Review → Approval → Signing → Active. Digital signing
(CON-010), versions (CON-011), amendments (CON-012), renewal watch via
expiration alerts (CON-015), termination (CON-014).

### Deliveries (DEL)
Delivery schedule from a PO (DEL-001/002), shipments, expected-vs-received
quantities with rejection (DEL-005…008), partial delivery, quality inspection
and confirmation (DEL-009/010), and history.

### Analytics (ANA)
Procurement dashboard aggregates spend by department, supplier, and category
(ANA-002/003/004), cycle time, PR/tender stats, supplier performance, and
contract expiration (ANA-001/005…010).

---

## 4. Mock → Real Backend Swap

Each `procurement-*/mock/service.ts` is the single seam; the react-query layer
in `api/*.queries.ts` stays unchanged. Endpoint conventions:

| Module         | Expected base path                        |
| -------------- | ----------------------------------------- |
| Plans          | `GET/POST /pms/plans[/:id]`               |
| Requisitions   | `GET/POST /pms/requisitions[/:id]`        |
| Suppliers      | `GET/POST /pms/suppliers[/:id]`           |
| Tenders        | `GET/POST /pms/tenders[/:id]` + `/bids`   |
| Contracts      | `GET/POST /pms/contracts[/:id]`           |
| Deliveries     | `GET/POST /pms/deliveries[/:id]`          |

Backend authorization remains authoritative.

---

## 5. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build`. Routes smoke tested (200): the
list and detail pages above.