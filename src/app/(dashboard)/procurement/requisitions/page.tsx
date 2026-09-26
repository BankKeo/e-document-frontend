import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { RequisitionListPage } from "@/features/procurement-requisition/components/requisition-list-page";

export const metadata: Metadata = {
  title: "Purchase Requisitions — e-Document",
};

export default function RequisitionsRoute() {
  return (
    <div>
      <PageHeader
        title="Purchase requisitions"
        description="Request, approve, and track purchases from departments to procurement."
      />
      <RequisitionListPage />
    </div>
  );
}
