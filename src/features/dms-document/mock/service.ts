import { MOCK_DOCUMENTS, MOCK_DOCUMENT_CATEGORIES } from "./data";
import type {
  DmsDocument,
  DocumentClassification,
  DocumentVersion,
} from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let refCounter = 1008;

function nextRef(): string {
  return `DOC-2026-${refCounter++}`;
}

// In-memory mock store (resets on full reload). Swap `documentService` for real
// API calls later; the react-query layer in `api/document.queries.ts` stays.
let documents: DmsDocument[] = [...MOCK_DOCUMENTS];

const CURRENT_ACTOR = "Malina Phetxomphou";

export const documentService = {
  async listDocuments(): Promise<DmsDocument[]> {
    await delay();
    return documents.map((entry) => ({ ...entry, versions: [...entry.versions] }));
  },

  async getDocument(id: string): Promise<DmsDocument> {
    await delay(200);
    const document = documents.find((entry) => entry.id === id);
    if (!document) throw new Error("Document not found.");
    return { ...document, versions: [...document.versions] };
  },

  // DMS-DOC-001 — Create document (starts at version v1.0)
  async createDocument(input: {
    title: string;
    category: string;
    classification: DocumentClassification;
    description?: string;
  }): Promise<DmsDocument> {
    await delay(450);
    const version: DocumentVersion = {
      id: randomId("ver"),
      version: "v1.0",
      at: new Date().toISOString(),
      actor: CURRENT_ACTOR,
      summary: "Document created",
      fileName: `${slugify(input.title)}.pdf`,
      size: Math.round(Math.random() * 400_000) + 40_000,
      content: input.description?.trim() || "New document created.",
    };
    const created: DmsDocument = {
      id: randomId("doc"),
      title: input.title.trim(),
      docRef: nextRef(),
      category: input.category,
      classification: input.classification,
      status: "Active",
      trashed: false,
      owner: CURRENT_ACTOR,
      department: "Executive Office",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
      tags: [],
      versions: [version],
      sharedWith: [],
    };
    documents = [created, ...documents];
    return { ...created };
  },

  // DMS-DOC-004 — Edit (creates a new version when content changes)
  async updateDocument(
    id: string,
    input: {
      title?: string;
      category?: string;
      classification?: DocumentClassification;
      description?: string;
    }
  ): Promise<DmsDocument> {
    await delay(450);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Document not found.");
    const existing = documents[index];
    const latest = existing.versions[0];
    const contentChanged =
      input.description !== undefined && input.description !== latest.content;
    const version: DocumentVersion = {
      id: randomId("ver"),
      version: bumpVersion(latest.version),
      at: new Date().toISOString(),
      actor: CURRENT_ACTOR,
      summary: contentChanged ? "Metadata and content updated" : "Metadata updated",
      fileName: latest.fileName,
      size: latest.size,
      content: input.description?.trim() || latest.content,
    };
    const next: DmsDocument = {
      ...existing,
      title: input.title?.trim() ?? existing.title,
      category: input.category ?? existing.category,
      classification: input.classification ?? existing.classification,
      updatedAt: new Date().toISOString(),
      versions: contentChanged ? [version, ...existing.versions] : existing.versions,
    };
    documents = documents.map((entry, entryIndex) => (entryIndex === index ? next : entry));
    return { ...next };
  },

  // DMS-DOC-002 — Upload a new version
  async uploadVersion(
    id: string,
    file: { name: string; size: number },
    summary: string
  ): Promise<DmsDocument> {
    await delay(500);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Document not found.");
    const existing = documents[index];
    const latest = existing.versions[0];
    const version: DocumentVersion = {
      id: randomId("ver"),
      version: bumpVersion(latest.version),
      at: new Date().toISOString(),
      actor: CURRENT_ACTOR,
      summary: summary?.trim() || "New version uploaded",
      fileName: file.name,
      size: file.size,
      content: existing.versions[0].content,
    };
    const next: DmsDocument = {
      ...existing,
      updatedAt: new Date().toISOString(),
      versions: [version, ...existing.versions],
    };
    documents = documents.map((entry, entryIndex) => (entryIndex === index ? next : entry));
    return { ...next };
  },

  // DMS-DOC-005 — Soft delete (moves to trash)
  async deleteDocument(id: string): Promise<void> {
    await delay();
    documents = documents.map((entry) =>
      entry.id === id ? { ...entry, trashed: true, updatedAt: new Date().toISOString() } : entry
    );
  },

  async deleteForever(id: string): Promise<void> {
    await delay(300);
    documents = documents.filter((entry) => entry.id !== id);
  },

  // DMS-DOC-008 — Archive
  async archiveDocument(id: string): Promise<void> {
    await delay();
    documents = documents.map((entry) =>
      entry.id === id ? { ...entry, status: "Archived", updatedAt: new Date().toISOString() } : entry
    );
  },

  // DMS-DOC-009 — Restore (from archive or trash)
  async restoreDocument(id: string): Promise<void> {
    await delay();
    documents = documents.map((entry) =>
      entry.id === id
        ? { ...entry, status: "Active", trashed: false, updatedAt: new Date().toISOString() }
        : entry
    );
  },

  // DMS-DOC-006 — Download (returns latest content as text)
  async downloadContent(id: string): Promise<{ fileName: string; content: string }> {
    await delay(200);
    const document = documents.find((entry) => entry.id === id);
    if (!document) throw new Error("Document not found.");
    const latest = document.versions[0];
    return { fileName: `${document.title}-${latest.version}.txt`, content: latest.content };
  },

  // DMS-DOC-007 — Share
  async shareDocument(id: string, emails: string[]): Promise<DmsDocument> {
    await delay(350);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Document not found.");
    const existing = documents[index];
    const next: DmsDocument = {
      ...existing,
      sharedWith: Array.from(new Set([...existing.sharedWith, ...emails])),
      updatedAt: new Date().toISOString(),
    };
    documents = documents.map((entry, entryIndex) => (entryIndex === index ? next : entry));
    return { ...next };
  },

  async unshareDocument(id: string, email: string): Promise<DmsDocument> {
    await delay(200);
    const index = documents.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Document not found.");
    const existing = documents[index];
    const next: DmsDocument = {
      ...existing,
      sharedWith: existing.sharedWith.filter((entry) => entry !== email),
      updatedAt: new Date().toISOString(),
    };
    documents = documents.map((entry, entryIndex) => (entryIndex === index ? next : entry));
    return { ...next };
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_DOCUMENT_CATEGORIES];
  },
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function bumpVersion(version: string): string {
  const minor = Number(version.split(".")[1] ?? "0");
  return `v${Math.floor(minor / 10)}.${minor + 1}`;
}