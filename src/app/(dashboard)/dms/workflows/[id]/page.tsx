import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WorkflowDetail } from "@/features/dms-workflow/components/workflow-detail";
import { MOCK_WORKFLOWS } from "@/features/dms-workflow/mock/data";

export const metadata: Metadata = {
  title: "Workflow details — e-Document",
};

export function generateStaticParams() {
  return MOCK_WORKFLOWS.map((workflow) => ({ id: workflow.id }));
}

export default async function WorkflowDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Workflow details"
        description="Node sequence, version history, and configuration."
      />
      <WorkflowDetail id={id} />
    </div>
  );
}
