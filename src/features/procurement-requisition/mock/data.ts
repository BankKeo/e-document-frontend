import type { PurchaseRequisition } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const MOCK_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: "pr_1",
    ref: "PR-2026-001",
    title: "Office supplies — stationery pack",
    department: "Executive Office",
    category: "Office Supplies",
    requester: "Malina Phetxomphou",
    status: "Approved",
    items: [
      {
        id: "i1",
        description: "Paper A4 80gsm",
        spec: "Ream of 500, white",
        quantity: 200,
        unit: "ream",
        estimatedPrice: 45_000,
        requiredDate: dateIn(14),
      },
      {
        id: "i2",
        description: "Ink toner HP 63",
        spec: "Original cartridge",
        quantity: 10,
        unit: "unit",
        estimatedPrice: 280_000,
        requiredDate: dateIn(14),
      },
    ],
    total: 11_800_000,
    documents: [{ id: "d1", name: "stationery-request.pdf", size: 96_000 }],
    history: [
      {
        id: "h1",
        at: ago(5000),
        action: "Created by Malina Phetxomphou",
        actor: "Malina Phetxomphou",
      },
      {
        id: "h2",
        at: ago(4800),
        action: "Approved by Department Head",
        actor: "Phonesavanh Chanthavong",
      },
      { id: "h3", at: ago(4600), action: "Budget approved", actor: "Finance" },
    ],
    createdAt: ago(5000),
    updatedAt: ago(4600),
  },
  {
    id: "pr_2",
    ref: "PR-2026-002",
    title: "Laptop refresh for procurement team",
    department: "Procurement",
    category: "IT Equipment",
    requester: "Aloun Sisavath",
    status: "Budget Approval",
    items: [
      {
        id: "i1",
        description: "Business laptop",
        spec: '14", 16GB RAM, 512GB SSD',
        quantity: 6,
        unit: "unit",
        estimatedPrice: 9_500_000,
        requiredDate: dateIn(21),
      },
    ],
    total: 57_000_000,
    documents: [{ id: "d1", name: "it-justification.pdf", size: 210_000 }],
    history: [
      {
        id: "h1",
        at: ago(1500),
        action: "Created by Aloun Sisavath",
        actor: "Aloun Sisavath",
      },
      {
        id: "h2",
        at: ago(1200),
        action: "Department approval granted",
        actor: "Kham Anoulack",
      },
    ],
    createdAt: ago(1500),
    updatedAt: ago(1200),
  },
  {
    id: "pr_3",
    ref: "PR-2026-003",
    title: "Road repair materials",
    department: "Public Works",
    category: "Construction",
    requester: "Viengkham Saysana",
    status: "Department Approval",
    items: [
      {
        id: "i1",
        description: "Asphalt mix",
        spec: "AC-20 hot mix",
        quantity: 120,
        unit: "ton",
        estimatedPrice: 2_000_000,
        requiredDate: dateIn(30),
      },
      {
        id: "i2",
        description: "Crushed rock base",
        spec: "Class 2",
        quantity: 400,
        unit: "m³",
        estimatedPrice: 180_000,
        requiredDate: dateIn(30),
      },
    ],
    total: 312_000_000,
    documents: [],
    history: [
      {
        id: "h1",
        at: ago(600),
        action: "Created by Viengkham Saysana",
        actor: "Viengkham Saysana",
      },
    ],
    createdAt: ago(600),
    updatedAt: ago(600),
  },
  {
    id: "pr_4",
    ref: "PR-2026-004",
    title: "Racking shelves for main warehouse",
    department: "Warehouse & Inventory",
    category: "Capital",
    requester: "Phoutthasone Keomany",
    status: "Draft",
    items: [
      {
        id: "i1",
        description: "Pallet racking bay",
        spec: "Heavy duty, 3 levels",
        quantity: 24,
        unit: "bay",
        estimatedPrice: 16_000_000,
        requiredDate: dateIn(40),
      },
    ],
    total: 384_000_000,
    documents: [],
    history: [
      {
        id: "h1",
        at: ago(200),
        action: "Draft created",
        actor: "Phoutthasone Keomany",
      },
    ],
    createdAt: ago(200),
    updatedAt: ago(200),
  },
  {
    id: "pr_5",
    ref: "PR-2026-005",
    title: "Cleaning supplies — Q1",
    department: "Executive Office",
    category: "Cleaning Supplies",
    requester: "Malinee Vongkham",
    status: "Returned",
    items: [
      {
        id: "i1",
        description: "General purpose cleaner",
        spec: "5L containers",
        quantity: 40,
        unit: "unit",
        estimatedPrice: 65_000,
        requiredDate: dateIn(7),
      },
    ],
    total: 2_600_000,
    documents: [],
    history: [
      {
        id: "h1",
        at: ago(900),
        action: "Created by Malinee Vongkham",
        actor: "Malinee Vongkham",
      },
      {
        id: "h2",
        at: ago(700),
        action: "Returned — adjust unit price",
        actor: "Finance",
      },
    ],
    createdAt: ago(900),
    updatedAt: ago(700),
  },
];

export const MOCK_PR_CATEGORIES = [
  "Office Supplies",
  "IT Equipment",
  "Construction",
  "Cleaning Supplies",
  "Machinery",
  "Transport",
  "Capital",
];

export const MOCK_PR_UNITS = ["unit", "ream", "ton", "m³", "box", "litre"];
