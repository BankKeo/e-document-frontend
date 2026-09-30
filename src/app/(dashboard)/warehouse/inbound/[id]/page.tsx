import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InboundDetail } from "@/features/warehouse-inbound/components/inbound-detail";
import { MOCK_INBOUND_ORDERS } from "@/features/warehouse-inbound/mock/data";

export const metadata: Metadata = {
  title: "Inbound details — e-Document",
};

export function generateStaticParams() {
  return MOCK_INBOUND_ORDERS.map((order) => ({ id: order.id }));
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
