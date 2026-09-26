import type {
  Author,
  Category,
  ConfidentialityLevel,
  DocumentType,
  MetaRecord,
  NumberingScheme,
  TagDefinition,
} from "../types";

const DAY = 24 * 60 * 60 * 1000;
function dayAgo(days: number): string {
  return new Date(Date.now() - days * DAY).toISOString().slice(0, 10);
}

export const MOCK_META_RECORDS: MetaRecord[] = [
  { id: "doc_1", documentTitle: "Annual Procurement Plan 2026", documentNumber: "DOC-2026-0001", documentType: "Plan", category: "Procurement", department: "Procurement", author: "Aloun Sisavath", createdAt: dayAgo(70), confidentiality: "Confidential", tags: ["procurement", "planning"] },
  { id: "doc_2", documentTitle: "Technical Specification — Road Rehabilitation", documentNumber: "DOC-2026-0002", documentType: "Specification", category: "Technical", department: "Procurement", author: "Kham Anoulack", createdAt: dayAgo(64), confidentiality: "Internal", tags: ["spec", "road"] },
  { id: "doc_3", documentTitle: "Framework Contract — Office Supplies", documentNumber: "DOC-2026-0003", documentType: "Contract", category: "Legal", department: "Executive Office", author: "Malina Phetxomphou", createdAt: dayAgo(18), confidentiality: "Confidential", tags: ["contract", "framework"] },
  { id: "doc_4", documentTitle: "Board Meeting Minutes — January", documentNumber: "DOC-2026-0004", documentType: "Minutes", category: "Administrative", department: "Executive Office", author: "Phonesavanh Chanthavong", createdAt: dayAgo(40), confidentiality: "Internal", tags: ["minutes", "board"] },
  { id: "doc_5", documentTitle: "Inventory Count Sheet — Q1", documentNumber: "DOC-2026-0005", documentType: "Report", category: "Operational", department: "Warehouse & Inventory", author: "Somchai Keopaseuth", createdAt: dayAgo(30), confidentiality: "Internal", tags: ["inventory", "report"] },
  { id: "doc_6", documentTitle: "Supplier Evaluation Report — RFQ-2026-011", documentNumber: "DOC-2026-0006", documentType: "Report", category: "Procurement", department: "Procurement", author: "Aloun Sisavath", createdAt: dayAgo(22), confidentiality: "Confidential", tags: ["rfq", "evaluation"] },
  { id: "doc_7", documentTitle: "Budget Concept Note — FY2027", documentNumber: "DOC-2026-0007", documentType: "Memo", category: "Financial", department: "Finance", author: "Anousone Vongsa", createdAt: dayAgo(12), confidentiality: "Public", tags: ["budget", "memo"] },
  { id: "doc_8", documentTitle: "Old Inventory Procedures (superseded)", documentNumber: "DOC-2025-0099", documentType: "Manual", category: "Operational", department: "Warehouse & Inventory", author: "Sengphet Vongdara", createdAt: dayAgo(340), confidentiality: "Internal", tags: ["manual"] },
];

export const MOCK_DOCUMENT_TYPES: DocumentType[] = [
  { id: "type_plan", name: "Plan", description: "Strategic and operational plans." },
  { id: "type_spec", name: "Specification", description: "Technical requirements and specs." },
  { id: "type_contract", name: "Contract", description: "Binding agreements." },
  { id: "type_report", name: "Report", description: "Analytical and status reports." },
  { id: "type_minutes", name: "Minutes", description: "Meeting records." },
  { id: "type_memo", name: "Memo", description: "Internal correspondence." },
  { id: "type_form", name: "Form", description: "Structured forms." },
  { id: "type_manual", name: "Manual", description: "Procedure and policy manuals." },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat_proc", name: "Procurement", description: "Sourcing and contracts." },
  { id: "cat_technical", name: "Technical", description: "Engineering and specifications." },
  { id: "cat_legal", name: "Legal", description: "Compliance and agreements." },
  { id: "cat_administrative", name: "Administrative", description: "Office administration." },
  { id: "cat_operational", name: "Operational", description: "Day-to-day operations." },
  { id: "cat_financial", name: "Financial", description: "Budgets and accounts." },
  { id: "cat_hr", name: "Human Resources", description: "People operations." },
];

export const MOCK_AUTHORS: Author[] = [
  { id: "auth_01", name: "Malina Phetxomphou", email: "malina@acme.gov", department: "Executive Office" },
  { id: "auth_02", name: "Kham Anoulack", email: "kham@acme.gov", department: "Procurement" },
  { id: "auth_03", name: "Anousone Vongsa", email: "anousone@acme.gov", department: "Finance" },
  { id: "auth_04", name: "Aloun Sisavath", email: "aloun@acme.gov", department: "Procurement" },
  { id: "auth_05", name: "Viengkham Saysana", email: "viengkham@acme.gov", department: "Procurement" },
  { id: "auth_06", name: "Phonesavanh Chanthavong", email: "phonesavanh@acme.gov", department: "Human Resources" },
  { id: "auth_07", name: "Somchai Keopaseuth", email: "somchai@acme.gov", department: "Warehouse & Inventory" },
  { id: "auth_08", name: "Sengphet Vongdara", email: "sengphet@acme.gov", department: "Warehouse & Inventory" },
];

export const MOCK_CONFIDENTIALITY: ConfidentialityLevel[] = [
  { id: "conf_internal", label: "Internal", description: "Visible to all staff." },
  { id: "conf_confidential", label: "Confidential", description: "Restricted to authorized roles and shared recipients." },
  { id: "conf_public", label: "Public", description: "Available to the public." },
];

export const MOCK_NUMBERING: NumberingScheme = {
  prefix: "DOC",
  includeYear: true,
  counter: 1008,
};

export const MOCK_TAGS: TagDefinition[] = [
  { id: "tag_procurement", name: "procurement", count: 2 },
  { id: "tag_planning", name: "planning", count: 1 },
  { id: "tag_spec", name: "spec", count: 1 },
  { id: "tag_road", name: "road", count: 1 },
  { id: "tag_contract", name: "contract", count: 1 },
  { id: "tag_framework", name: "framework", count: 1 },
  { id: "tag_report", name: "report", count: 2 },
  { id: "tag_budget", name: "budget", count: 1 },
  { id: "tag_memo", name: "memo", count: 1 },
];

export const MOCK_DEPARTMENTS = [
  "Executive Office",
  "Finance",
  "Procurement",
  "Warehouse & Inventory",
  "Human Resources",
  "IT",
  "Legal",
];