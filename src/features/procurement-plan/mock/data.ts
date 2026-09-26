import type { ProcurementPlan } from "../types";

function ago(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const MOCK_PLANS: ProcurementPlan[] = [
  {
    id: "plan_1",
    ref: "PLAN-2026-001",
    title: "Annual Procurement Plan 2026",
    fiscalYear: "2026",
    department: "Procurement",
    category: "Goods & Services",
    budget: 4_200_000_000,
    estimatedCost: 3_850_000_000,
    plannedDate: dateIn(30),
    items: [
      {
        id: "i1",
        description: "Office supplies (annual)",
        quantity: 1,
        estimatedCost: 95_000_000,
      },
      {
        id: "i2",
        description: "IT equipment refresh",
        quantity: 1,
        estimatedCost: 320_000_000,
      },
      {
        id: "i3",
        description: "Furniture",
        quantity: 1,
        estimatedCost: 180_000_000,
      },
    ],
    status: "Approved",
    owner: "Aloun Sisavath",
    createdAt: ago(70),
    updatedAt: ago(20),
  },
  {
    id: "plan_2",
    ref: "PLAN-2026-002",
    title: "Road Rehabilitation Materials",
    fiscalYear: "2026",
    department: "Public Works",
    category: "Construction",
    budget: 2_400_000_000,
    estimatedCost: 2_150_000_000,
    plannedDate: dateIn(60),
    items: [
      {
        id: "i1",
        description: "Asphalt mix",
        quantity: 650,
        estimatedCost: 1_300_000_000,
      },
      {
        id: "i2",
        description: "Aggregates",
        quantity: 900,
        estimatedCost: 700_000_000,
      },
    ],
    status: "In Progress",
    owner: "Kham Anoulack",
    createdAt: ago(40),
    updatedAt: ago(5),
  },
  {
    id: "plan_3",
    ref: "PLAN-2026-003",
    title: "Warehouse Racking & Storage",
    fiscalYear: "2026",
    department: "Warehouse & Inventory",
    category: "Capital",
    budget: 1_200_000_000,
    estimatedCost: 980_000_000,
    plannedDate: dateIn(45),
    items: [
      {
        id: "i1",
        description: "Racking systems",
        quantity: 40,
        estimatedCost: 650_000_000,
      },
    ],
    status: "Submitted",
    owner: "Phoutthasone Keomany",
    createdAt: ago(12),
    updatedAt: ago(3),
  },
  {
    id: "plan_4",
    ref: "PLAN-2026-004",
    title: "Vehicle Fleet Maintenance",
    fiscalYear: "2026",
    department: "Transport",
    category: "Services",
    budget: 400_000_000,
    estimatedCost: 320_000_000,
    plannedDate: dateIn(75),
    items: [
      {
        id: "i1",
        description: "Annual fleet service contract",
        quantity: 1,
        estimatedCost: 180_000_000,
      },
    ],
    status: "Draft",
    owner: "Somchai Keopaseuth",
    createdAt: ago(2),
    updatedAt: ago(1),
  },
  {
    id: "plan_5",
    ref: "PLAN-2026-005",
    title: "Cleaning Services Outsourcing",
    fiscalYear: "2026",
    department: "Executive Office",
    category: "Services",
    budget: 260_000_000,
    estimatedCost: 240_000_000,
    plannedDate: dateIn(15),
    items: [
      {
        id: "i1",
        description: "Cleaning contract (12 months)",
        quantity: 1,
        estimatedCost: 240_000_000,
      },
    ],
    status: "Rejected",
    owner: "Malina Phetxomphou",
    createdAt: ago(60),
    updatedAt: ago(35),
  },
];

export const MOCK_PLAN_CATEGORIES = [
  "Goods & Services",
  "Construction",
  "Capital",
  "Services",
  "Operational",
];
