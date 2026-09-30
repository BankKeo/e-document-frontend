import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OutboundDetail } from "@/features/warehouse-outbound/components/outbound-detail";
import { MOCK_OUTBOUND } from "@/features/warehouse-outbound/mock/data";

export const metadata: Metadata = {
  title: "Outbound details — e-Document",
};

export function generateStaticParams() {
  return MOCK_OUTBOUND.map((issue) => ({ id: issue.id }));
}

export default async function OutboundDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Outbound issue"
        description="Request, approval, picking, packing, and issue flow."
      />
      <OutboundDetail id={id} />
    </div>
  );
}
