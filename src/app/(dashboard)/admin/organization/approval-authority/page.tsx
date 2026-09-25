import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ApprovalAuthorityPage } from "@/features/organization/components/approval-authority-page";

export const metadata: Metadata = {
  title: "Approval Authority — e-Document",
};

export default function ApprovalAuthorityRoute() {
  return (
    <div>
      <PageHeader
        title="Approval authority"
        description="Control who can approve documents, by type and amount."
      />
      <ApprovalAuthorityPage />
    </div>
  );
}