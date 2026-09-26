import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProcurementDashboard } from "@/features/procurement-analytics/components/procurement-dashboard";

export const metadata: Metadata = {
  title: "Analytics — e-Document",
};

export default function AnalyticsRoute() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Trends and reports across the organization (ANA-001…010)."
      />
      <ProcurementDashboard />
    </div>
  );
}
