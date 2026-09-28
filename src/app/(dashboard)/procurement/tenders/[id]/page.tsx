import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TenderDetail } from "@/features/procurement-tender/components/tender-detail";

export const metadata: Metadata = {
  title: "Tender details — e-Document",
};

export function generateStaticParams() {
  return [];
}

export default async function TenderDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Tender details"
        description="Schedule, documents, bids, evaluation, and award."
      />
      <TenderDetail id={id} />
    </div>
  );
}
