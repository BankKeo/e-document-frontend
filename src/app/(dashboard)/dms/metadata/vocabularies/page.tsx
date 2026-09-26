import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { VocabularyPage } from "@/features/dms-metadata/components/vocabulary-page";

export const metadata: Metadata = {
  title: "Metadata Vocabularies — e-Document",
};

export default function VocabularyRoute() {
  return (
    <div>
      <PageHeader
        title="Metadata vocabularies"
        description="Manage document types, categories, authors, tags, and numbering."
      />
      <VocabularyPage />
    </div>
  );
}