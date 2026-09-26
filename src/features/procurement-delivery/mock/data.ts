import type { Delivery } from "../types";

function ago(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: "del_1",
    ref: "DEL-2026-001",
    purchaseOrderRef: "PO-2026-014",
    supplier: "Vientiane Office Supplies Co., Ltd",
    scheduledDate: dateIn(3),
    status: "Scheduled",
    note: "First partial delivery of the stationery order.",
    lines: [
      {
        id: "l1",
        item: "Paper A4 80gsm",
        expectedQty: 100,
        receivedQty: 0,
        rejectedQty: 0,
        unit: "ream",
      },
      {
        id: "l2",
        item: "Ink toner HP 63",
        expectedQty: 5,
        receivedQty: 0,
        rejectedQty: 0,
        unit: "unit",
      },
    ],
    createdBy: "Malina Phetxomphou",
    createdAt: ago(4),
  },
  {
    id: "del_2",
    ref: "DEL-2026-002",
    purchaseOrderRef: "PO-2026-009",
    supplier: "Phousy Construction & Trading",
    scheduledDate: dateIn(-5),
    shippedDate: ago(6),
    receivedAt: ago(5),
    status: "Received",
    note: "Asphalt mix delivered to site depot.",
    lines: [
      {
        id: "l1",
        item: "Asphalt mix AC-20",
        expectedQty: 40,
        receivedQty: 40,
        rejectedQty: 0,
        unit: "ton",
      },
      {
        id: "l2",
        item: "Crushed rock base",
        expectedQty: 150,
        receivedQty: 148,
        rejectedQty: 2,
        unit: "m³",
      },
    ],
    createdBy: "Viengkham Saysana",
    createdAt: ago(10),
  },
  {
    id: "del_3",
    ref: "DEL-2026-003",
    purchaseOrderRef: "PO-2026-020",
    supplier: "Lao Tractor & Machinery",
    scheduledDate: dateIn(-2),
    shippedDate: ago(2),
    status: "Partially Received",
    note: "Racking frames arrived; shelves pending.",
    lines: [
      {
        id: "l1",
        item: "Pallet racking frame",
        expectedQty: 24,
        receivedQty: 18,
        rejectedQty: 0,
        unit: "bay",
      },
      {
        id: "l2",
        item: "Racking shelves",
        expectedQty: 72,
        receivedQty: 0,
        rejectedQty: 0,
        unit: "unit",
      },
    ],
    createdBy: "Phoutthasone Keomany",
    createdAt: ago(8),
  },
  {
    id: "del_4",
    ref: "DEL-2026-004",
    purchaseOrderRef: "PO-2026-022",
    supplier: "Golden Mekong Logistics",
    scheduledDate: dateIn(7),
    status: "Delayed",
    note: "Shipping delayed by 2 days at border crossing.",
    lines: [
      {
        id: "l1",
        item: "Cleaning equipment",
        expectedQty: 10,
        receivedQty: 0,
        rejectedQty: 0,
        unit: "unit",
      },
    ],
    createdBy: "Malina Phetxomphou",
    createdAt: ago(2),
  },
  {
    id: "del_5",
    ref: "DEL-2026-005",
    purchaseOrderRef: "PO-2026-015",
    supplier: "Vientiane Office Supplies Co., Ltd",
    scheduledDate: dateIn(-8),
    receivedAt: ago(8),
    status: "Confirmed",
    note: "Furniture order confirmed after quality inspection.",
    lines: [
      {
        id: "l1",
        item: "Office desk",
        expectedQty: 20,
        receivedQty: 20,
        rejectedQty: 0,
        unit: "unit",
      },
      {
        id: "l2",
        item: "Office chair",
        expectedQty: 20,
        receivedQty: 19,
        rejectedQty: 1,
        unit: "unit",
      },
    ],
    createdBy: "Aloun Sisavath",
    createdAt: ago(14),
  },
];

export const MOCK_PO_REFS = [
  "PO-2026-009",
  "PO-2026-014",
  "PO-2026-015",
  "PO-2026-020",
  "PO-2026-022",
];
