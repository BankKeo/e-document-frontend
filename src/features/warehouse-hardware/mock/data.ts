import type { HardwareDevice, GeneratedLabel } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_DEVICES: HardwareDevice[] = [
  {
    id: "dev_1",
    name: "Handheld Scanner — Dock 1",
    type: "Barcode Scanner",
    location: "Central Warehouse — Receiving",
    status: "Connected",
    lastSeen: ago(5),
  },
  {
    id: "dev_2",
    name: "Handheld Scanner — Dock 2",
    type: "Barcode Scanner",
    location: "Central Warehouse — Outbound",
    status: "Connected",
    lastSeen: ago(20),
  },
  {
    id: "dev_3",
    name: "Label Printer — Zebra ZD421",
    type: "Label Printer",
    location: "Central Warehouse — Office",
    status: "Connected",
    lastSeen: ago(60),
  },
  {
    id: "dev_4",
    name: "Mobile Camera Scanner",
    type: "Mobile Scanning",
    location: "Secondary Warehouse — Savannakhet",
    status: "Offline",
    lastSeen: ago(500),
  },
  {
    id: "dev_5",
    name: "Label Printer — Brother QL",
    type: "Label Printer",
    location: "Secondary Warehouse",
    status: "Unavailable",
    lastSeen: ago(3000),
  },
];

export const MOCK_LABELS: GeneratedLabel[] = [
  {
    id: "lbl_1",
    code: "8851234567890",
    type: "Barcode",
    target: "SKU-001 — Paper A4 80gsm",
    generatedAt: ago(120),
  },
  {
    id: "lbl_2",
    code: "8851234567906",
    type: "Barcode",
    target: "SKU-002 — Ink Toner HP 63",
    generatedAt: ago(240),
  },
  {
    id: "lbl_3",
    code: "https://edemo.local/asset/AST-003",
    type: "QR",
    target: "AST-003 — Pickup Vehicle",
    generatedAt: ago(400),
  },
];
