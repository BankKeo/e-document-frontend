import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OutboundListPage } from "@/features/warehouse-outbound/components/outbound-list-page";

export const metadata: Metadata = {
  title: "Outbound — e-Document",
};

export default function OutboundRoute() {
  return (
    <div>
      <PageHeader
        title="Outbound"
        description="Issue stock to departments: request, pick, pack, and deliver."
      />
      <OutboundListPage />
    </div>
  );
}
