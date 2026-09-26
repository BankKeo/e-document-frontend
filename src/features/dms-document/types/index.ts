export type DocumentStatus = "Active" | "Archived";
export type DocumentClassification = "Internal" | "Confidential" | "Public";

export interface DocumentVersion {
  id: string;
  version: string;
  at: string;
  actor: string;
  summary: string;
  fileName: string;
  size: number;
  content: string;
}

export interface DmsDocument {
  id: string;
  title: string;
  docRef: string;
  category: string;
  classification: DocumentClassification;
  status: DocumentStatus;
  trashed: boolean;
  owner: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  versions: DocumentVersion[];
  sharedWith: string[];
}