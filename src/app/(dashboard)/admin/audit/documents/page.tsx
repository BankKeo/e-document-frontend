import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentHistoryPage } from "@/features/audit/components/document-history-page";

export const metadata: Metadata = {
  title: "Document History — e-Document",
};

export default function DocumentHistoryRoute() {
  return (
    <div>
      <PageHeader
        title="Document history"
        description="Lifecycle events of every document and version."
      />
      <DocumentHistoryPage />
    </div>
  );
}