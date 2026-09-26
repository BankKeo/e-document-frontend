import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OutboundDetail } from "@/features/warehouse-outbound/components/outbound-detail";

export const metadata: Metadata = {
  title: "Outbound issue — e-Document",
};

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
