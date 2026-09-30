import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DeliveryDetail } from "@/features/procurement-delivery/components/delivery-detail";
import { MOCK_DELIVERIES } from "@/features/procurement-delivery/mock/data";

export const metadata: Metadata = {
  title: "Delivery details — e-Document",
};

export function generateStaticParams() {
  return MOCK_DELIVERIES.map((delivery) => ({ id: delivery.id }));
}

export default async function DeliveryDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Delivery details"
        description="Shipment status, expected vs received quantities, and confirmation."
      />
      <DeliveryDetail id={id} />
    </div>
  );
}
