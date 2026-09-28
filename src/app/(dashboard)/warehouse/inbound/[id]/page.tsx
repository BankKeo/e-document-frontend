import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InboundDetail } from "@/features/warehouse-inbound/components/inbound-detail";

export const metadata: Metadata = {
  title: "Inbound details — e-Document",
};

export function generateStaticParams() {
  return [];
}

export default async function InboundDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Receiving order"
        description="Arrival, verification, inspection, and put-away flow."
      />
      <InboundDetail id={id} />
    </div>
  );
}
