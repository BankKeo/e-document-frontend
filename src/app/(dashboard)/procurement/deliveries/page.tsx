import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DeliveryListPage } from "@/features/procurement-delivery/components/delivery-list-page";

export const metadata: Metadata = {
  title: "Deliveries — e-Document",
};

export default function DeliveriesRoute() {
  return (
    <div>
      <PageHeader
        title="Deliveries"
        description="Schedule, track, and receive deliveries from suppliers."
      />
      <DeliveryListPage />
    </div>
  );
}
