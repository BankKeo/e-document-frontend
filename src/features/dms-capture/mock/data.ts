import type { CaptureDocument, CaptureRun } from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const fullText = `INVOICE\n\nSupplier: Vientiane Office Supplies Co., Ltd\nAddress: 12 Nongbone Road, Vientiane\nTax ID: 002/2025/LA\n\nINV-2026-0142\nDate: 2026-02-18\nDue Date: 2026-03-18\n\nDescription           Qty    Unit Price     Amount\nPaper A4 80gsm         200        45,000   9,000,000\nInk Toner HP 63        10       280,000   2,800,000\nFolders               300         8,000   2,400,000\n\nSubtotal                            14,200,000\nVAT (10%)                             1,420,000\nTotal LAK                          15,620,000\n\nTerms: Net 30 days. Payment to bank account 020-102-9845.`;

export const MOCK_CAPTURE_DOCUMENTS: CaptureDocument[] = [
  {
    id: "cap_1",
    fileName: "INV-2026-0142-vientiane-office.pdf",
    size: 842_311,
    status: "Verified",
    uploadedAt: ago(90),
    uploadedBy: "Aloun Sisavath",
    progress: 100,
    ocrConfidence: 96,
    classification: "Invoice",
    pageCount: 2,
    text: fullText,
    keywords: ["invoice", "paper", "toner", "net 30"],
    tags: ["supplier-invoice", "vientiane-office"],
    fields: [
      {
        key: "documentNumber",
        label: "Document Number",
        value: "INV-2026-0142",
        confidence: 0.98,
        source: "OCR",
      },
      {
        key: "date",
        label: "Date",
        value: "2026-02-18",
        confidence: 0.99,
        source: "OCR",
      },
      {
        key: "organization",
        label: "Supplier",
        value: "Vientiane Office Supplies Co., Ltd",
        confidence: 0.97,
        source: "AI",
      },
      {
        key: "amount",
        label: "Total Amount",
        value: "15,620,000 LAK",
        confidence: 0.95,
        source: "AI",
      },
      {
        key: "taxId",
        label: "Tax ID",
        value: "002/2025/LA",
        confidence: 0.88,
        source: "AI",
      },
    ],
  },
  {
    id: "cap_2",
    fileName: "procurement-plan-draft-scan.tiff",
    size: 1_302_500,
    status: "Extracted",
    uploadedAt: ago(300),
    uploadedBy: "Kham Anoulack",
    progress: 100,
    ocrConfidence: 91,
    classification: "Plan",
    pageCount: 3,
    text: "Annual Procurement Plan 2026 - Draft for circulation. Budget envelope LAK 4.2 billion.",
    keywords: ["procurement", "plan", "budget"],
    tags: ["procurement-plan"],
    fields: [
      {
        key: "documentNumber",
        label: "Document Number",
        value: "DOC-2026-0001",
        confidence: 0.85,
        source: "OCR",
      },
      {
        key: "amount",
        label: "Total Budget",
        value: "4,200,000,000 LAK",
        confidence: 0.92,
        source: "AI",
      },
      {
        key: "organization",
        label: "Issued by",
        value: "Procurement Department",
        confidence: 0.9,
        source: "AI",
      },
    ],
  },
  {
    id: "cap_3",
    fileName: "supplier-registration-form.pdf",
    size: 455_800,
    status: "Classified",
    uploadedAt: ago(700),
    uploadedBy: "Malina Phetxomphou",
    progress: 70,
    ocrConfidence: 89,
    classification: "Form",
    pageCount: 1,
    keywords: ["supplier", "registration"],
    tags: ["supplier-onboarding"],
  },
  {
    id: "cap_4",
    fileName: "unclear-photo-2026-02-22.jpg",
    size: 218_400,
    status: "Failed",
    uploadedAt: ago(1400),
    uploadedBy: "Somchai Keopaseuth",
    progress: 30,
    ocrConfidence: 34,
    error: "Low contrast — consider rescanning at 300 DPI.",
    pageCount: 1,
  },
];

export const MOCK_CAPTURE_RUNS: CaptureRun[] = [
  {
    id: "run_1",
    name: "Upload Invoice Batch",
    description: "Supplier invoices dropped into the capture inbox.",
    lastRun: ago(90),
    documents: 12,
    success: 11,
  },
  {
    id: "run_2",
    name: "Q1 Procurement Plan Scans",
    description: "Hand-drafted plans captured on the office scanner.",
    lastRun: ago(300),
    documents: 4,
    success: 3,
  },
  {
    id: "run_3",
    name: "Supplier Onboarding Pack",
    description: "Registration forms and certificates from new suppliers.",
    lastRun: ago(700),
    documents: 9,
    success: 8,
  },
];

export const MOCK_CLASSIFICATIONS = [
  "Invoice",
  "Contract",
  "Plan",
  "Report",
  "Form",
  "Memo",
  "Specification",
];
