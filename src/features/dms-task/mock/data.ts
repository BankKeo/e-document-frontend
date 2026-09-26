import type { Task } from "../types";

function daysFromNow(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_TASKS: Task[] = [
  {
    id: "task_1",
    ref: "TASK-2026-001",
    title: "Review Tender-011 financial clarifications",
    description:
      "Two suppliers submitted clarification responses. Review and finalize the financial scoring.",
    assignee: "Aloun Sisavath",
    creator: "Kham Anoulack",
    priority: "Urgent",
    status: "In Progress",
    dueDate: daysFromNow(1),
    reminderAt: daysFromNow(0),
    attachments: [
      { id: "att_1", name: "tender-011-clarifications.pdf", size: 320_000 },
    ],
    comments: [
      {
        id: "c1",
        at: ago(400),
        author: "Viengkham Saysana",
        text: "Response from Supplier B received.",
      },
    ],
    relatedTo: "Tender-011",
    createdAt: ago(600),
    updatedAt: ago(120),
  },
  {
    id: "task_2",
    ref: "TASK-2026-002",
    title: "Compile Q1 spend by department",
    description:
      "Pull procurement spend for Q1 and break down by department for the analytics review.",
    assignee: "Malina Phetxomphou",
    creator: "Aloun Sisavath",
    priority: "High",
    status: "Open",
    dueDate: daysFromNow(3),
    attachments: [],
    comments: [],
    relatedTo: "Analytics",
    createdAt: ago(700),
    updatedAt: ago(700),
  },
  {
    id: "task_3",
    ref: "TASK-2026-003",
    title: "Renew framework contract for office supplies",
    description:
      "Prepare renewal terms and circulate to legal before the current contract expires.",
    assignee: "Phoutthasone Keomany",
    creator: "Malina Phetxomphou",
    priority: "High",
    status: "Overdue",
    dueDate: daysFromNow(-2),
    reminderAt: daysFromNow(-3),
    attachments: [
      { id: "att_2", name: "framework-contract-office.pdf", size: 900_000 },
    ],
    comments: [],
    relatedTo: "DOC-2026-0003",
    createdAt: ago(3000),
    updatedAt: ago(1800),
  },
  {
    id: "task_4",
    ref: "TASK-2026-004",
    title: "Register new supplier — Vientiane Office Supplies",
    description:
      "Complete vendor registration form, verification, and bank information for the new supplier.",
    assignee: "Somchai Keopaseuth",
    creator: "Aloun Sisavath",
    priority: "Medium",
    status: "Open",
    dueDate: daysFromNow(5),
    attachments: [
      { id: "att_3", name: "supplier-registration.pdf", size: 455_000 },
    ],
    comments: [
      {
        id: "c2",
        at: ago(2200),
        author: "Aloun Sisavath",
        text: "Bank details received, verify account.",
      },
    ],
    relatedTo: "SUP-2026-012",
    createdAt: ago(2400),
    updatedAt: ago(2000),
  },
  {
    id: "task_5",
    ref: "TASK-2026-005",
    title: "Upload Q1 count sheet to documents",
    description:
      "Publish the quarterly inventory count sheet as a versioned document.",
    assignee: "Malinee Vongkham",
    creator: "Phoutthasone Keomany",
    priority: "Low",
    status: "Done",
    dueDate: daysFromNow(-4),
    attachments: [{ id: "att_4", name: "q1-count-sheet.xlsx", size: 88_120 }],
    comments: [],
    relatedTo: "DOC-2026-0005",
    createdAt: ago(6000),
    updatedAt: ago(4000),
  },
  {
    id: "task_6",
    ref: "TASK-2026-006",
    title: "Check warehouse stock below reorder level",
    description:
      "Review items flagged under reorder point and prepare a purchase recommendation.",
    assignee: "Phoutthasone Keomany",
    creator: "Somchai Keopaseuth",
    priority: "Medium",
    status: "In Progress",
    dueDate: daysFromNow(2),
    attachments: [],
    comments: [
      {
        id: "c3",
        at: ago(900),
        author: "Somchai Keopaseuth",
        text: "8 SKUs flagged so far.",
      },
    ],
    relatedTo: "Inventory",
    createdAt: ago(1400),
    updatedAt: ago(300),
  },
];

export const MOCK_TASK_USERS = [
  "Aloun Sisavath",
  "Kham Anoulack",
  "Malina Phetxomphou",
  "Phoutthasone Keomany",
  "Somchai Keopaseuth",
  "Malinee Vongkham",
];
