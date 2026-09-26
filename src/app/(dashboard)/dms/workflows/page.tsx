import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WorkflowListPage } from "@/features/dms-workflow/components/workflow-list-page";

export const metadata: Metadata = {
  title: "Workflows — e-Document",
};

export default function WorkflowsRoute() {
  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Design and monitor approval workflows and their nodes."
      />
      <WorkflowListPage />
    </div>
  );
}
