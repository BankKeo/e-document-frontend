import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProcurementDashboard } from "@/features/procurement-analytics/components/procurement-dashboard";

export const metadata: Metadata = {
  title: "Procurement — e-Document",
};

export default function ProcurementRoute() {
  return (
    <div>
      <PageHeader
        title="Procurement"
        description="Pipeline, spend, and analytics across procurement modules."
      />
      <ProcurementDashboard />
    </div>
  );
}
