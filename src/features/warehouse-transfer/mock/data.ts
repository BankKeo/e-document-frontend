import type { StockTransfer } from "../types";

function ago(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

export const MOCK_TRANSFERS: StockTransfer[] = [
  {
    id: "trf_1",
    ref: "TRF-2026-001",
    fromWarehouse: "Central Warehouse — Vientiane",
    toWarehouse: "Secondary Warehouse — Savannakhet",
    status: "Completed",
    requestedBy: "Phoutthasone Keomany",
    lines: [
      {
        id: "l1",
        itemName: "Paper A4 80gsm",
        sku: "SKU-001",
        quantity: 50,
        unit: "ream",
      },
      {
        id: "l2",
        itemName: "General Purpose Cleaner",
        sku: "SKU-006",
        quantity: 20,
        unit: "litre",
      },
    ],
    createdAt: ago(72),
    completedAt: ago(60),
  },
  {
    id: "trf_2",
    ref: "TRF-2026-002",
    fromWarehouse: "Central Warehouse — Vientiane",
    toWarehouse: "Secondary Warehouse — Savannakhet",
    status: "In Transit",
    requestedBy: "Somchai Keopaseuth",
    lines: [
      {
        id: "l1",
        itemName: "Pallet Racking Frame",
        sku: "SKU-007",
        quantity: 6,
        unit: "bay",
      },
    ],
    createdAt: ago(4),
  },
  {
    id: "trf_3",
    ref: "TRF-2026-003",
    fromWarehouse: "Secondary Warehouse — Savannakhet",
    toWarehouse: "Central Warehouse — Vientiane",
    status: "Draft",
    requestedBy: "Malinee Vongkham",
    lines: [
      {
        id: "l1",
        itemName: "Office Desk",
        sku: "SKU-003",
        quantity: 2,
        unit: "unit",
      },
    ],
    createdAt: ago(1),
  },
];

export const TRANSFER_WAREHOUSES = [
  "Central Warehouse — Vientiane",
  "Secondary Warehouse — Savannakhet",
];
