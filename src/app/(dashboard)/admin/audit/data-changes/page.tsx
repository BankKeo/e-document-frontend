import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { DataChangeHistoryPage } from "@/features/audit/components/data-change-history-page";

export const metadata: Metadata = {
  title: "Data Change History — e-Document",
};

export default function DataChangeHistoryRoute() {
  return (
    <div>
      <PageHeader
        title="Data change history"
        description="Field-level changes to records across the platform."
      />
      <DataChangeHistoryPage />
    </div>
  );
}