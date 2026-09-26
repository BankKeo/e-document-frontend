import { documentService } from "@/features/dms-document/mock/service";
import type {
  DmsDocument,
  VersionComparison,
  VersionRegistryRow,
} from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory version registry derived from the shared document mock store.
// Swap the methods below for real endpoints later; the react-query layer in
// `api/versioning.queries.ts` stays unchanged.
export const versioningService = {
  // DMS-VER-005 — Version history across all documents (newest first)
  async listVersionRegistry(): Promise<VersionRegistryRow[]> {
    await delay();
    const documents = await documentService.listDocuments();
    const rows: VersionRegistryRow[] = [];
    for (const document of documents) {
      document.versions.forEach((version, index) => {
        rows.push({
          documentId: document.id,
          documentTitle: document.title,
          docRef: document.docRef,
          category: document.category,
          versionId: version.id,
          version: version.version,
          at: version.at,
          actor: version.actor,
          summary: version.summary,
          fileName: version.fileName,
          size: version.size,
          content: version.content,
          isCurrent: index === 0,
          index,
          total: document.versions.length,
        });
      });
    }
    return rows.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );
  },

  async listDocuments(): Promise<DmsDocument[]> {
    return documentService.listDocuments();
  },

  async getDocument(id: string): Promise<DmsDocument> {
    return documentService.getDocument(id);
  },

  // DMS-VER-001 — Create version
  async createVersion(
    id: string,
    file: { name: string; size: number },
    summary: string
  ): Promise<DmsDocument> {
    return documentService.uploadVersion(id, file, summary);
  },

  // DMS-VER-003 — Compare versions
  async compareVersions(
    id: string,
    leftId: string,
    rightId: string
  ): Promise<VersionComparison> {
    const { left, right } = await documentService.compareVersions(
      id,
      leftId,
      rightId
    );
    return {
      left: {
        id: left.id,
        version: left.version,
        fileName: left.fileName,
        size: left.size,
        content: left.content,
      },
      right: {
        id: right.id,
        version: right.version,
        fileName: right.fileName,
        size: right.size,
        content: right.content,
      },
    };
  },

  // DMS-VER-004 — Restore version
  async restoreVersion(id: string, versionId: string): Promise<DmsDocument> {
    return documentService.restoreVersion(id, versionId);
  },
};
