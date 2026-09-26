import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PlanListPage } from "@/features/procurement-plan/components/plan-list-page";

export const metadata: Metadata = {
  title: "Procurement Plans — e-Document",
};

export default function PlansRoute() {
  return (
    <div>
      <PageHeader
        title="Procurement plans"
        description="Plan annual procurement, budgets, and purchase schedules."
      />
      <PlanListPage />
    </div>
  );
}
