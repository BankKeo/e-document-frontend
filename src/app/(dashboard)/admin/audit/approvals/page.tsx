import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ApprovalHistoryPage } from "@/features/audit/components/approval-history-page";

export const metadata: Metadata = {
  title: "Approval History — e-Document",
};

export default function ApprovalHistoryRoute() {
  return (
    <div>
      <PageHeader
        title="Approval history"
        description="Every approval decision, level, and comment."
      />
      <ApprovalHistoryPage />
    </div>
  );
}