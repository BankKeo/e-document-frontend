import type { Tender } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString().slice(0, 10);
}

function dateIn(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const MOCK_TENDERS: Tender[] = [
  {
    id: "tender_1",
    ref: "TENDER-011",
    title: "Supply of Office Furniture",
    category: "Office Supplies",
    status: "Under Evaluation",
    description:
      "Supply and delivery of office furniture (desks, chairs, shelving) for the new office wing.",
    estimatedValue: 480_000_000,
    owner: "Kham Anoulack",
    createdAt: ago(15000),
    updatedAt: ago(120),
    documents: [
      {
        id: "d1",
        name: "tender-specification.pdf",
        type: "Specification",
        size: 640_000,
      },
      { id: "d2", name: "terms-of-reference.pdf", type: "TER", size: 310_000 },
    ],
    schedule: {
      publish: dateIn(-20),
      bidSubmission: dateIn(-2),
      bidOpening: dateIn(-1),
      evaluation: dateIn(8),
      award: dateIn(15),
    },
    bids: [
      {
        id: "b1",
        supplier: "Vientiane Office Supplies Co., Ltd",
        amount: 442_000_000,
        submittedAt: ago(500),
        technicalScore: 92,
        financialScore: 88,
        totalScore: 90,
        status: "Shortlisted",
      },
      {
        id: "b2",
        supplier: "Peninsula Hardware Trading",
        amount: 398_000_000,
        submittedAt: ago(600),
        technicalScore: 81,
        financialScore: 95,
        totalScore: 88,
        status: "Shortlisted",
      },
      {
        id: "b3",
        supplier: "Golden Mekong Logistics",
        amount: 465_000_000,
        submittedAt: ago(700),
        technicalScore: 70,
        financialScore: 84,
        totalScore: 77,
        status: "Compliant",
      },
      {
        id: "b4",
        supplier: "TechNet Solutions",
        amount: 0,
        submittedAt: ago(800),
        status: "Non-Compliant",
      },
    ],
    evaluationCommittee: [
      "Aloun Sisavath",
      "Kham Anoulack",
      "Viengkham Saysana",
    ],
  },
  {
    id: "tender_2",
    ref: "TENDER-012",
    title: "Annual IT Equipment Refresh",
    category: "IT Equipment",
    status: "Open for Bids",
    description:
      "Annual refresh of workplace computing equipment across all departments.",
    estimatedValue: 1_150_000_000,
    owner: "Aloun Sisavath",
    createdAt: ago(4000),
    updatedAt: ago(400),
    documents: [
      {
        id: "d1",
        name: "it-spec-list.xlsx",
        type: "Specification",
        size: 420_000,
      },
    ],
    schedule: {
      publish: dateIn(-2),
      bidSubmission: dateIn(12),
      bidOpening: dateIn(13),
      evaluation: dateIn(20),
      award: dateIn(28),
    },
    bids: [
      {
        id: "b1",
        supplier: "TechNet Solutions",
        amount: 1_080_000_000,
        submittedAt: ago(200),
        status: "Submitted",
      },
    ],
    evaluationCommittee: ["Aloun Sisavath", "Phoutthasone Keomany"],
  },
  {
    id: "tender_3",
    ref: "TENDER-009",
    title: "Road Rehabilitation — Package B",
    category: "Construction",
    status: "Awarded",
    description:
      "Rehabilitation of 12 km of arterial road including drainage and resurfacing.",
    estimatedValue: 2_400_000_000,
    owner: "Viengkham Saysana",
    createdAt: ago(40000),
    updatedAt: ago(9000),
    documents: [
      {
        id: "d1",
        name: "specification-b.pdf",
        type: "Specification",
        size: 1_200_000,
      },
      { id: "d2", name: "award-letter.pdf", type: "Award", size: 180_000 },
    ],
    schedule: {
      publish: dateIn(-60),
      bidSubmission: dateIn(-30),
      bidOpening: dateIn(-29),
      evaluation: dateIn(-15),
      award: dateIn(-9),
    },
    bids: [
      {
        id: "b1",
        supplier: "Phousy Construction & Trading",
        amount: 2_210_000_000,
        submittedAt: ago(15000),
        technicalScore: 94,
        financialScore: 90,
        totalScore: 92,
        status: "Awarded",
      },
      {
        id: "b2",
        supplier: "Lao Tractor & Machinery",
        amount: 2_490_000_000,
        submittedAt: ago(15500),
        technicalScore: 85,
        financialScore: 82,
        totalScore: 83,
        status: "Compliant",
      },
    ],
    evaluationCommittee: ["Viengkham Saysana", "Kham Anoulack"],
  },
  {
    id: "tender_4",
    ref: "TENDER-013",
    title: "Cleaning Services Contract",
    category: "Services",
    status: "Draft",
    description:
      "Outsourced cleaning services for office and warehouse premises for 24 months.",
    estimatedValue: 260_000_000,
    owner: "Malina Phetxomphou",
    createdAt: ago(700),
    updatedAt: ago(200),
    documents: [],
    schedule: {
      publish: dateIn(10),
      bidSubmission: dateIn(30),
      bidOpening: dateIn(31),
      evaluation: dateIn(40),
      award: dateIn(45),
    },
    bids: [],
    evaluationCommittee: ["Malina Phetxomphou"],
  },
  {
    id: "tender_5",
    ref: "TENDER-010",
    title: "Warehouse Racking Systems",
    category: "Capital",
    status: "Cancelled",
    description:
      "Supply and installation of heavy-duty pallet racking. Cancelled pending rebudget.",
    estimatedValue: 650_000_000,
    owner: "Phoutthasone Keomany",
    createdAt: ago(30000),
    updatedAt: ago(20000),
    documents: [],
    schedule: {
      publish: dateIn(-30),
      bidSubmission: dateIn(-10),
      bidOpening: dateIn(-9),
      evaluation: dateIn(-1),
      award: dateIn(5),
    },
    bids: [
      {
        id: "b1",
        supplier: "Lao Tractor & Machinery",
        amount: 610_000_000,
        submittedAt: ago(15000),
        status: "Submitted",
      },
    ],
    evaluationCommittee: [],
  },
];

export const MOCK_TENDER_CATEGORIES = [
  "Office Supplies",
  "IT Equipment",
  "Construction",
  "Services",
  "Capital",
  "Machinery",
  "Transport",
];
