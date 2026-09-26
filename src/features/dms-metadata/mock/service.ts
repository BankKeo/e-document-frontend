import {
  MOCK_AUTHORS,
  MOCK_CATEGORIES,
  MOCK_CONFIDENTIALITY,
  MOCK_DEPARTMENTS,
  MOCK_DOCUMENT_TYPES,
  MOCK_META_RECORDS,
  MOCK_NUMBERING,
  MOCK_TAGS,
} from "./data";
import type {
  Author,
  Category,
  ConfidentialityLevel,
  DocumentType,
  MetaRecord,
  NumberingScheme,
  TagDefinition,
} from "../types";
import type {
  AuthorInput,
  CategoryInput,
  DocumentTypeInput,
  MetaRecordInput,
} from "../schemas/metadata.schemas";

function delay(ms = 260) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const metaRecords: MetaRecord[] = [...MOCK_META_RECORDS];
let documentTypes: DocumentType[] = [...MOCK_DOCUMENT_TYPES];
let categories: Category[] = [...MOCK_CATEGORIES];
let authors: Author[] = [...MOCK_AUTHORS];
let tags: TagDefinition[] = [...MOCK_TAGS];
let numbering: NumberingScheme = { ...MOCK_NUMBERING };

export const metadataService = {
  // DMS-META-001..008 — document metadata records
  async listMetaRecords(): Promise<MetaRecord[]> {
    await delay();
    return metaRecords.map((entry) => ({ ...entry, tags: [...entry.tags] }));
  },

  async updateMetaRecord(id: string, input: MetaRecordInput): Promise<MetaRecord> {
    await delay(400);
    const index = metaRecords.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Document not found.");
    metaRecords[index] = { ...metaRecords[index], ...input, tags: [...input.tags] };
    tags = tags.map((tag) => ({
      ...tag,
      count: metaRecords.filter((entry) => entry.tags.includes(tag.name)).length,
    }));
    return { ...metaRecords[index] };
  },

  // DMS-META-005 — authors
  async listAuthors(): Promise<Author[]> {
    await delay();
    return [...authors];
  },

  async createAuthor(input: AuthorInput): Promise<Author> {
    await delay();
    const created: Author = {
      id: randomId("auth"),
      name: input.name.trim(),
      email: input.email.trim(),
      department: input.department,
    };
    authors = [...authors, created];
    return { ...created };
  },

  async deleteAuthor(id: string): Promise<void> {
    await delay();
    authors = authors.filter((entry) => entry.id !== id);
  },

  // DMS-META-002 — document types
  async listDocumentTypes(): Promise<DocumentType[]> {
    await delay();
    return [...documentTypes];
  },

  async createDocumentType(input: DocumentTypeInput): Promise<DocumentType> {
    await delay();
    const created: DocumentType = {
      id: randomId("type"),
      name: input.name.trim(),
      description: input.description?.trim() ?? "",
    };
    documentTypes = [...documentTypes, created];
    return { ...created };
  },

  async deleteDocumentType(id: string): Promise<void> {
    await delay();
    documentTypes = documentTypes.filter((entry) => entry.id !== id);
  },

  // DMS-META-003 — categories
  async listCategories(): Promise<Category[]> {
    await delay();
    return [...categories];
  },

  async createCategory(input: CategoryInput): Promise<Category> {
    await delay();
    const created: Category = {
      id: randomId("cat"),
      name: input.name.trim(),
      description: input.description?.trim() ?? "",
    };
    categories = [...categories, created];
    return { ...created };
  },

  async deleteCategory(id: string): Promise<void> {
    await delay();
    categories = categories.filter((entry) => entry.id !== id);
  },

  // DMS-META-004 — departments (reference, managed in Organization)
  async listDepartments(): Promise<string[]> {
    await delay(120);
    return [...MOCK_DEPARTMENTS];
  },

  // DMS-META-007 — confidentiality levels (fixed)
  async listConfidentialityLevels(): Promise<ConfidentialityLevel[]> {
    await delay(100);
    return [...MOCK_CONFIDENTIALITY];
  },

  // DMS-META-008 — tags
  async listTags(): Promise<TagDefinition[]> {
    await delay();
    return tags.map((entry) => ({ ...entry }));
  },

  async addTag(name: string): Promise<TagDefinition> {
    await delay(200);
    const existing = tags.find(
      (entry) => entry.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) return { ...existing };
    const created: TagDefinition = {
      id: randomId("tag"),
      name: name.trim().toLowerCase(),
      count: 0,
    };
    tags = [...tags, created];
    return { ...created };
  },

  async deleteTag(id: string): Promise<void> {
    await delay(200);
    tags = tags.filter((entry) => entry.id !== id);
  },

  // DMS-META-001 — numbering scheme
  async getNumberingScheme(): Promise<NumberingScheme> {
    await delay(120);
    return { ...numbering };
  },

  async saveNumberingScheme(input: NumberingScheme): Promise<NumberingScheme> {
    await delay(300);
    numbering = { ...input, counter: Math.max(1, Math.floor(input.counter)) };
    return { ...numbering };
  },
};