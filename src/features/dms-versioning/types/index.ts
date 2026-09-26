export type {
  DmsDocument,
  DocumentVersion,
} from "@/features/dms-document/types";

export interface VersionRegistryRow {
  documentId: string;
  documentTitle: string;
  docRef: string;
  category: string;
  versionId: string;
  version: string;
  at: string;
  actor: string;
  summary: string;
  fileName: string;
  size: number;
  content: string;
  isCurrent: boolean;
  index: number;
  total: number;
}

export interface VersionComparison {
  left: {
    id: string;
    version: string;
    fileName: string;
    size: number;
    content: string;
  };
  right: {
    id: string;
    version: string;
    fileName: string;
    size: number;
    content: string;
  };
}

export type DiffLineKind = "same" | "removed" | "added";

export interface DiffLine {
  kind: DiffLineKind;
  left?: string;
  right?: string;
}
