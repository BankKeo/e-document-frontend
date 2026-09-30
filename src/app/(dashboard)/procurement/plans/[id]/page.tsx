import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PlanDetail } from "@/features/procurement-plan/components/plan-detail";
import { MOCK_PLANS } from "@/features/procurement-plan/mock/data";

export const metadata: Metadata = {
  title: "Plan details — e-Document",
};

export function generateStaticParams() {
  return MOCK_PLANS.map((plan) => ({ id: plan.id }));
}

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
