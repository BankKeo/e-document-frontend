import type { OutboundIssue } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_OUTBOUND: OutboundIssue[] = [
  {
    id: "out_1",
    ref: "OUT-2026-001",
    department: "Finance",
    requester: "Anousone Vongsa",
    status: "Picking",
    warehouse: "Central Warehouse — Vientiane",
    lines: [
      {
        id: "l1",
        itemName: "Paper A4 80gsm",
        sku: "SKU-001",
        quantity: 20,
        unit: "ream",
      },
      {
        id: "l2",
        itemName: "Ink Toner HP 63",
        sku: "SKU-002",
        quantity: 2,
        unit: "unit",
      },
    ],
    requestedAt: ago(200),
    createdBy: "Malinee Vongkham",
  },
  {
    id: "out_2",
    ref: "OUT-2026-002",
    department: "Procurement",
    requester: "Aloun Sisavath",
    status: "Approved",
    warehouse: "Central Warehouse — Vientiane",
    lines: [
      {
        id: "l1",
        itemName: 'Business Laptop 14"',
        sku: "SKU-008",
        quantity: 6,
        unit: "unit",
      },
    ],
    requestedAt: ago(1500),
    createdBy: "Malinee Vongkham",
  },
  {
    id: "out_3",
    ref: "OUT-2026-003",
    department: "Public Works",
    requester: "Viengkham Saysana",
    status: "Issued",
    warehouse: "Central Warehouse — Vientiane",
    lines: [
      {
        id: "l1",
        itemName: "Asphalt Mix AC-20",
        sku: "SKU-004",
        quantity: 24,
        unit: "ton",
      },
    ],
    requestedAt: ago(400),
    issuedAt: ago(300),
    createdBy: "Somchai Keopaseuth",
  },
  {
    id: "out_4",
    ref: "OUT-2026-004",
    department: "Executive Office",
    requester: "Malina Phetxomphou",
    status: "Requested",
    warehouse: "Secondary Warehouse — Savannakhet",
    lines: [
      {
        id: "l1",
        itemName: "General Purpose Cleaner",
        sku: "SKU-006",
        quantity: 30,
        unit: "litre",
      },
    ],
    requestedAt: ago(100),
    createdBy: "Malinee Vongkham",
  },
];

export const MOCK_OUTBOUND_WAREHOUSES = [
  "Central Warehouse — Vientiane",
  "Secondary Warehouse — Savannakhet",
];

export const MOCK_ISSUE_LINES = [
  { itemName: "Paper A4 80gsm", sku: "SKU-001", unit: "ream" },
  { itemName: "Ink Toner HP 63", sku: "SKU-002", unit: "unit" },
  { itemName: 'Business Laptop 14"', sku: "SKU-008", unit: "unit" },
  { itemName: "General Purpose Cleaner", sku: "SKU-006", unit: "litre" },
];
