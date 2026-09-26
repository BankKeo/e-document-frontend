import { MOCK_CAPTURE_DOCUMENTS, MOCK_CAPTURE_RUNS } from "./data";
import type { CaptureDocument, CaptureRun, ExtractedField } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let documents: CaptureDocument[] = [...MOCK_CAPTURE_DOCUMENTS];

const CURRENT_ACTOR = "Malina Phetxomphou";

export const captureService = {
  async listDocuments(): Promise<CaptureDocument[]> {
    await delay();
    return documents.map((entry) => ({
      ...entry,
      fields: entry.fields?.map((field) => ({ ...field })),
    }));
  },

  async getDocument(id: string): Promise<CaptureDocument> {
    await delay(200);
    const document = documents.find((entry) => entry.id === id);
    if (!document) throw new Error("Capture document not found.");
    return {
      ...document,
      fields: document.fields?.map((field) => ({ ...field })),
    };
  },

  async listRuns(): Promise<CaptureRun[]> {
    await delay(150);
    return [...MOCK_CAPTURE_RUNS];
  },

  // AI-001 — Upload a scanned document (starts the pipeline)
  async uploadDocument(file: {
    name: string;
    size: number;
  }): Promise<CaptureDocument> {
    await delay(400);
    const created: CaptureDocument = {
      id: randomId("cap"),
      fileName: file.name,
      size: file.size,
      status: "Uploaded",
      uploadedAt: new Date().toISOString(),
      uploadedBy: CURRENT_ACTOR,
      progress: 0,
      ocrConfidence: 0,
      pageCount: 1,
    };
    documents = [created, ...documents];
    return { ...created };
  },

  // AI-002 — AI-004 — run preprocessing and OCR (returns staged progress + text)
  async runOcr(id: string): Promise<CaptureDocument> {
    await delay(800);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Capture document not found.");
    const existing = documents[index];
    const next: CaptureDocument = {
      ...existing,
      status: "Processing",
      step: "OCR",
      progress: 100,
      ocrConfidence: existing.ocrConfidence || 94,
      text:
        existing.text ??
        "OCR-EXTRACTED TEXT\n\nDocument uploaded for processing. This placeholder represents the raw text output of the OCR engine.",
      fields: existing.fields ?? [
        {
          key: "documentNumber",
          label: "Document Number",
          value: randomId("DOC").toUpperCase(),
          confidence: 0.95,
          source: "OCR",
        },
      ],
    };
    documents = documents.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },

  // AI-009 — classification + AI-010 tags + AI-011 metadata extraction
  async classifyDocument(
    id: string,
    classification: string
  ): Promise<CaptureDocument> {
    await delay(600);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Capture document not found.");
    const existing = documents[index];
    const next: CaptureDocument = {
      ...existing,
      status: "Extracted",
      step: "Classify",
      progress: 100,
      classification: classification || existing.classification || "Report",
      ocrConfidence: existing.ocrConfidence || 92,
      tags: existing.tags ?? [classification.toLowerCase(), "auto-tagged"],
      fields: ensureBasicFields(existing.fields),
    };
    documents = documents.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },

  // AI-013 — manual correction of extracted fields
  async saveFields(
    id: string,
    fields: ExtractedField[]
  ): Promise<CaptureDocument> {
    await delay(350);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Capture document not found.");
    const existing = documents[index];
    const next: CaptureDocument = {
      ...existing,
      status: "Verified",
      step: "Extract",
      progress: 100,
      fields: fields.map((field) => ({
        ...field,
        source:
          field.source === "Manual"
            ? "Manual"
            : (field.source as ExtractedField["source"]),
      })),
      updatedBy: CURRENT_ACTOR,
    };
    documents = documents.map((entry, entryIndex) =>
      entryIndex === index ? next : entry
    );
    return { ...next };
  },
};

function ensureBasicFields(fields?: ExtractedField[]): ExtractedField[] {
  if (fields && fields.length > 0) return fields.map((field) => ({ ...field }));
  return [
    {
      key: "documentNumber",
      label: "Document Number",
      value: "DOC-" + Date.now().toString().slice(-6),
      confidence: 0.9,
      source: "OCR",
    },
    {
      key: "date",
      label: "Date",
      value: new Date().toISOString().slice(0, 10),
      confidence: 0.93,
      source: "OCR",
    },
  ];
}
