import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { MetadataPage } from "@/features/dms-metadata/components/metadata-page";

export const metadata: Metadata = {
  title: "Document Metadata — e-Document",
};

export default function MetadataRoute() {
  return (
    <div>
      <PageHeader
        title="Document metadata"
        description="Review and edit document numbers, types, authors, and tags."
      />
      <MetadataPage />
    </div>
  );
}