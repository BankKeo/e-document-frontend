import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentListPage } from "@/features/dms-document/components/document-list-page";

export const metadata: Metadata = {
  title: "Documents — e-Document",
};

export default function DocumentsRoute() {
  return (
    <div>
      <PageHeader
        title="Documents"
        description="Create, version, share, and archive electronic documents."
      />
      <DocumentListPage />
    </div>
  );
}