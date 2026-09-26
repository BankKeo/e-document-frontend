import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InboundListPage } from "@/features/warehouse-inbound/components/inbound-list-page";

export const metadata: Metadata = {
  title: "Inbound — e-Document",
};

export default function InboundRoute() {
  return (
    <div>
      <PageHeader
        title="Inbound"
        description="Receive goods, verify quantities, and put away stock."
      />
      <InboundListPage />
    </div>
  );
}
