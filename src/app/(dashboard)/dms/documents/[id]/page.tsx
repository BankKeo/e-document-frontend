import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DocumentDetail } from "@/features/dms-document/components/document-detail";

export const metadata: Metadata = {
  title: "Document details — e-Document",
};

export function generateStaticParams() {
  return [];
}

export default async function DocumentDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Document details"
        description="Versions, sharing, and lifecycle actions."
      />
      <DocumentDetail id={id} />
    </div>
  );
}