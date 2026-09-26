import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PlanDetail } from "@/features/procurement-plan/components/plan-detail";

export const metadata: Metadata = {
  title: "Procurement plan details — e-Document",
};

export default async function PlanDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Procurement plan details"
        description="Line items, budget, and approval state."
      />
      <PlanDetail id={id} />
    </div>
  );
}
