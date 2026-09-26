import type { EFormTemplate, EFormSubmission } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_FORMS: EFormTemplate[] = [
  {
    id: "form_req",
    name: "Stationery Request",
    description: "Internal request for office stationery and supplies.",
    category: "Warehouse",
    status: "Published",
    version: "v1.2",
    owner: "Malina Phetxomphou",
    createdAt: "2025-12-05",
    updatedAt: ago(200),
    fields: [
      { id: "f1", type: "Text", label: "Requested by", required: true },
      { id: "f2", type: "Text", label: "Department", required: true },
      {
        id: "f3",
        type: "Dropdown",
        label: "Item",
        required: true,
        options: ["Paper A4", "Ink toner", "Pens", "Folders"],
      },
      { id: "f4", type: "Number", label: "Quantity", required: true },
      { id: "f5", type: "Date", label: "Needed by", required: false },
      { id: "f6", type: "Text", label: "Notes", required: false },
      {
        id: "f7",
        type: "Signature",
        label: "Approver signature",
        required: true,
      },
    ],
  },
  {
    id: "form_pr",
    name: "Vehicle Booking",
    description: "Reserve a pool vehicle for official travel.",
    category: "Transport",
    status: "Published",
    version: "v1.0",
    owner: "Kham Anoulack",
    createdAt: "2026-01-12",
    updatedAt: ago(400),
    fields: [
      { id: "f1", type: "Text", label: "Full name", required: true },
      { id: "f2", type: "Text", label: "Destination", required: true },
      { id: "f3", type: "Date", label: "Departure date", required: true },
      { id: "f4", type: "Date", label: "Return date", required: false },
      {
        id: "f5",
        type: "Dropdown",
        label: "Vehicle type",
        required: true,
        options: ["Sedan", "SUV", "Minivan", "Truck"],
      },
      { id: "f6", type: "Checkbox", label: "Driver required", required: false },
      {
        id: "f7",
        type: "File Upload",
        label: "Travel approval letter",
        required: true,
      },
    ],
  },
  {
    id: "form_feedback",
    name: "IT Support Feedback",
    description: "Rate the resolution of a recent IT support ticket.",
    category: "IT",
    status: "Draft",
    version: "v0.1",
    owner: "Anousone Vongsa",
    createdAt: "2026-02-20",
    updatedAt: ago(50),
    fields: [
      { id: "f1", type: "Text", label: "Ticket number", required: true },
      {
        id: "f2",
        type: "Dropdown",
        label: "Rating",
        required: true,
        options: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Excellent"],
      },
      { id: "f3", type: "Text", label: "Comments", required: false },
    ],
  },
  {
    id: "form_leave",
    name: "Leave Request",
    description: "Apply for annual, sick, or unpaid leave.",
    category: "HR",
    status: "Published",
    version: "v1.3",
    owner: "Phonesavanh Chanthavong",
    createdAt: "2025-10-01",
    updatedAt: ago(1500),
    fields: [
      { id: "f1", type: "Text", label: "Employee name", required: true },
      {
        id: "f2",
        type: "Dropdown",
        label: "Leave type",
        required: true,
        options: ["Annual", "Sick", "Unpaid", "Family"],
      },
      { id: "f3", type: "Date", label: "Start date", required: true },
      { id: "f4", type: "Date", label: "End date", required: true },
      { id: "f5", type: "Text", label: "Reason", required: false },
      {
        id: "f6",
        type: "Signature",
        label: "Manager signature",
        required: true,
      },
    ],
  },
];

export const MOCK_FORM_SUBMISSIONS: EFormSubmission[] = [
  {
    id: "sub_1",
    formId: "form_req",
    at: ago(90),
    actor: "Somchai Keopaseuth",
    values: {
      "Requested by": "Somchai Keopaseuth",
      Item: "Paper A4",
      Quantity: "500",
    },
  },
  {
    id: "sub_2",
    formId: "form_req",
    at: ago(500),
    actor: "Malinee Vongkham",
    values: {
      "Requested by": "Malinee Vongkham",
      Item: "Ink toner",
      Quantity: "3",
    },
  },
  {
    id: "sub_3",
    formId: "form_leave",
    at: ago(700),
    actor: "Viengkham Saysana",
    values: {
      "Employee name": "Viengkham Saysana",
      "Leave type": "Annual",
      "Start date": "2026-03-02",
    },
  },
  {
    id: "sub_4",
    formId: "form_leave",
    at: ago(1200),
    actor: "Phoutthasone Keomany",
    values: {
      "Employee name": "Phoutthasone Keomany",
      "Leave type": "Sick",
      "Start date": "2026-01-20",
    },
  },
];
