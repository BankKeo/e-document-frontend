import type { InboundOrder } from "../types";

function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function ago(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export const MOCK_INBOUND_ORDERS: InboundOrder[] = [
  {
    id: "in_1",
    ref: "IN-2026-001",
    purchaseOrderRef: "PO-2026-014",
    supplier: "Vientiane Office Supplies Co., Ltd",
    scheduledAt: dateIn(2),
    status: "Scheduled",
    warehouse: "Central Warehouse — Vientiane",
    lines: [
      {
        id: "l1",
        itemName: "Paper A4 80gsm",
        sku: "SKU-001",
        expected: 100,
        received: 0,
        rejected: 0,
        unit: "ream",
      },
      {
        id: "l2",
        itemName: "Ink Toner HP 63",
        sku: "SKU-002",
        expected: 5,
        received: 0,
        rejected: 0,
        unit: "unit",
      },
    ],
    note: "Follows DEL-2026-001.",
    createdBy: "Malinee Vongkham",
  },
  {
    id: "in_2",
    ref: "IN-2026-002",
    purchaseOrderRef: "PO-2026-009",
    supplier: "Phousy Construction & Trading",
    scheduledAt: dateIn(-4),
    arrivedAt: ago(4),
    status: "Inspected",
    warehouse: "Central Warehouse — Vientiane",
    lines: [
      {
        id: "l1",
        itemName: "Asphalt Mix AC-20",
        sku: "SKU-004",
        expected: 40,
        received: 40,
        rejected: 0,
        unit: "ton",
      },
    ],
    note: "Quality passed.",
    createdBy: "Phoutthasone Keomany",
  },
  {
    id: "in_3",
    ref: "IN-2026-003",
    purchaseOrderRef: "PO-2026-020",
    supplier: "Lao Tractor & Machinery",
    scheduledAt: dateIn(-1),
    arrivedAt: ago(1),
    status: "Arrived",
    warehouse: "Secondary Warehouse — Savannakhet",
    lines: [
      {
        id: "l1",
        itemName: "Pallet Racking Frame",
        sku: "SKU-007",
        expected: 18,
        received: 0,
        rejected: 0,
        unit: "bay",
      },
    ],
    note: "Partial arrival — shelves pending.",
    createdBy: "Somchai Keopaseuth",
  },
  {
    id: "in_4",
    ref: "IN-2026-004",
    purchaseOrderRef: "PO-2026-022",
    supplier: "Golden Mekong Logistics",
    scheduledAt: dateIn(5),
    status: "Scheduled",
    warehouse: "Central Warehouse — Vientiane",
    lines: [
      {
        id: "l1",
        itemName: "General Purpose Cleaner",
        sku: "SKU-006",
        expected: 40,
        received: 0,
        rejected: 0,
        unit: "litre",
      },
    ],
    note: "",
    createdBy: "Malina Phetxomphou",
  },
];
