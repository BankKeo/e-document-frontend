# Warehouse & Inventory Modules UX/UI — Implementation Notes (Mock-first)

Covers WH-001…008, ITEM-001…012, STOCK-001…012, IN-001…011, OUT-001…010,
FORECAST-001…008, ASSET-001…012, and HW-001…010. All flows run against
in-memory mock services for review before backend wiring.

---

## 1. Routes

| Route                               | Features                                     |
| ----------------------------------- | -------------------------------------------- |
| `/warehouse`                        | Dashboard: stock, inbound, outbound, forecasting |
| `/warehouse/warehouses` `[id]`      | WH-001…008 warehouse master + location hierarchy |
| `/warehouse/inventory` `[id]`       | ITEM-001…012 item master + STOCK balances, movements |
| `/warehouse/inbound` `[id]`         | IN-001…011 receiving operations              |
| `/warehouse/outbound` `[id]`        | OUT-001…010 issue / picking / packing        |
| `/warehouse/transfers`              | STOCK-003 stock transfers between warehouses |
| `/warehouse/assets` `[id]`          | ASSET-001…012 asset register and lifecycle   |
| `/warehouse/hardware`               | HW-001…010 barcode/QR, scanners, printers    |

---

## 2. Architecture

Each module follows the feature-folder pattern:

```
src/features/warehouse-*/
├── types/
├── mock/{data,service}.ts
├── api/*.queries.ts
├── utils.ts
└── components/*-page.tsx, *-detail.tsx, create-*-dialog.tsx
```

The warehouse dashboard (`src/features/warehouse-dashboard/`) aggregates the
inventory, warehouse master, inbound, outbound, and transfer mock services.

---

## 3. Feature Notes

### Warehouse Master (WH)
List with capacity and utilization KPIs. Detail shows the
Warehouse → Zone → Rack → Shelf hierarchy (WH-003…006) as nested cards.

### Item / Product Master + Inventory (ITEM, STOCK)
Item master with SKU, barcode, category, brand, model, unit, min/max stock and
reorder point (ITEM-001…012). Inventory list flags **Low stock** (<= reorder
point) and **Overstock** (>= max stock). Item detail shows stock position,
reservation (STOCK-005/006), adjustment (STOCK-004) and full traceability of
movements (STOCK-002): INBOUND +, TRANSFER, OUTBOUND −, ADJUSTMENT.

### Inbound (IN)
Receiving order from a PO with barcode/quantity verification (IN-001…005),
damaged goods, partial receiving, quality inspection, put-away, and confirmation
(IN-006…011). Flow stepper: PO → Arrival → Inspection → Put-away →
Inventory updated.

### Outbound (OUT)
Issue request from a department (OUT-001/002), approval, picking, packing,
barcode scan, issue and delivery (OUT-003…010). Flow stepper:
Department request → Approval → Picking → Packing → Issue → Inventory updated.

### Transfers (STOCK-003)
Move stock between warehouses from/to selectors; traceable as a TRANSFER
movement. Draft → In Transit → Completed.

### Forecasting (FORECAST)
The warehouse dashboard derives demand forecast per item from on-hand stock and
thresholds: average consumption, demand forecast, safety stock, days until
stockout, and an Order/Monitor/Ok recommendation (FORECAST-001…008).

### Assets (ASSET)
Register with tag and category (ASSET-001…003), location, custodian
(ASSET-004/005), assignment/transfer (ASSET-006/007), maintenance and repair
(ASSET-008/009), depreciation (ASSET-010), disposal (ASSET-011), and a full
history log (ASSET-012).

### Barcode / Hardware (HW)
Device registry for scanners, printers, and mobile scanning (HW-002/004/010),
label generation for barcode/QR (HW-001/003), label printing (HW-009), and the
scan workflows mapped to receiving/picking/count/asset scans (HW-005…008).

---

## 4. Mock → Real Backend Swap

Each `warehouse-*/mock/service.ts` is the single seam; the react-query layer
stays unchanged. Endpoint conventions:

| Module      | Expected base path                    |
| ----------- | ------------------------------------- |
| Warehouses  | `GET/POST /wms/warehouses[/:id]`      |
| Items       | `GET/POST /wms/items[/:id]`           |
| Inbound     | `GET/POST /wms/inbound[/:id]`         |
| Outbound    | `GET/POST /wms/outbound[/:id]`        |
| Transfers   | `GET/POST /wms/transfers[/:id]`       |
| Assets      | `GET/POST /wms/assets[/:id]`          |
| Hardware    | `GET/POST /wms/hardware`              |

Backend authorization remains authoritative.

---

## 5. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build`. Routes smoke tested (200): all
list and detail pages above.