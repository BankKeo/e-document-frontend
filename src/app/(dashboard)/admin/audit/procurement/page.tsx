import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProcurementHistoryPage } from "@/features/audit/components/procurement-history-page";

export const metadata: Metadata = {
  title: "Procurement History — e-Document",
};

export default function ProcurementHistoryRoute() {
  return (
    <div>
      <PageHeader
        title="Procurement history"
        description="Requisition, tender, order, and contract events."
      />
      <ProcurementHistoryPage />
    </div>
  );
}