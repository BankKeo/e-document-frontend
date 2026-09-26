import type { Contract } from "../types";

function ago(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "con_1",
    ref: "CON-2026-001",
    title: "Framework Contract — Office Supplies",
    type: "Framework",
    supplier: "Vientiane Office Supplies Co., Ltd",
    value: 320_000_000,
    startDate: dateIn(-60),
    endDate: dateIn(300),
    owner: "Malina Phetxomphou",
    status: "Active",
    signed: true,
    documents: [
      { id: "d1", name: "framework-contract-office.pdf", size: 900_000 },
    ],
    versions: [
      {
        id: "v1",
        version: "v1.0",
        at: ago(70),
        actor: "Malina Phetxomphou",
        summary: "Signed version",
      },
    ],
    createdAt: ago(70),
    updatedAt: ago(2),
  },
  {
    id: "con_2",
    ref: "CON-2026-002",
    title: "Road Rehabilitation — Package B",
    type: "Works",
    supplier: "Phousy Construction & Trading",
    value: 2_210_000_000,
    startDate: dateIn(-30),
    endDate: dateIn(330),
    owner: "Viengkham Saysana",
    status: "Active",
    signed: true,
    documents: [
      { id: "d1", name: "construction-contract.pdf", size: 1_400_000 },
    ],
    versions: [
      {
        id: "v1",
        version: "v1.0",
        at: ago(32),
        actor: "Viengkham Saysana",
        summary: "Executed",
      },
    ],
    amendments: [
      {
        id: "a1",
        at: ago(5),
        title: "Variation 1",
        note: "Drainage scope increased by 8%",
      },
    ],
    createdAt: ago(32),
    updatedAt: ago(5),
  },
  {
    id: "con_3",
    ref: "CON-2026-003",
    title: "IT Equipment Lease — 24 months",
    type: "Lease",
    supplier: "TechNet Solutions",
    value: 480_000_000,
    startDate: dateIn(15),
    endDate: dateIn(745),
    owner: "Aloun Sisavath",
    status: "Signing",
    signed: false,
    documents: [{ id: "d1", name: "lease-agreement-draft.pdf", size: 200_000 }],
    versions: [
      {
        id: "v1",
        version: "v1.0",
        at: ago(20),
        actor: "Aloun Sisavath",
        summary: "Draft",
      },
      {
        id: "v2",
        version: "v1.2",
        at: ago(3),
        actor: "Aloun Sisavath",
        summary: "Legal comments incorporated",
      },
    ],
    createdAt: ago(20),
    updatedAt: ago(3),
  },
  {
    id: "con_4",
    ref: "CON-2026-004",
    title: "Cleaning Services — Annual",
    type: "Services",
    supplier: "Golden Mekong Logistics",
    value: 240_000_000,
    startDate: dateIn(-300),
    endDate: dateIn(-4),
    owner: "Malina Phetxomphou",
    status: "Expired",
    signed: true,
    documents: [
      { id: "d1", name: "cleaning-services-2025.pdf", size: 120_000 },
    ],
    versions: [
      {
        id: "v1",
        version: "v1.0",
        at: ago(320),
        actor: "Malina Phetxomphou",
        summary: "Signed",
      },
    ],
    createdAt: ago(320),
    updatedAt: ago(4),
  },
  {
    id: "con_5",
    ref: "CON-2026-005",
    title: "Consulting — Procurement Reform",
    type: "Services",
    supplier: "Phousy Construction & Trading",
    value: 150_000_000,
    startDate: dateIn(-400),
    endDate: dateIn(-100),
    owner: "Aloun Sisavath",
    status: "Terminated",
    signed: true,
    documents: [{ id: "d1", name: "consulting-termination.pdf", size: 80_000 }],
    createdAt: ago(400),
    updatedAt: ago(100),
  },
  {
    id: "con_6",
    ref: "CON-2026-006",
    title: "Warehouse Racking Supply",
    type: "Supply",
    supplier: "Lao Tractor & Machinery",
    value: 610_000_000,
    startDate: dateIn(20),
    endDate: dateIn(400),
    owner: "Phoutthasone Keomany",
    status: "Review",
    signed: false,
    documents: [{ id: "d1", name: "racking-supply-draft.docx", size: 300_000 }],
    versions: [
      {
        id: "v1",
        version: "v0.5",
        at: ago(1),
        actor: "Phoutthasone Keomany",
        summary: "Terms under review",
      },
    ],
    createdAt: ago(6),
    updatedAt: ago(1),
  },
];

export const MOCK_CONTRACT_TYPES = [
  "Framework",
  "Works",
  "Lease",
  "Services",
  "Supply",
  "Consulting",
];
