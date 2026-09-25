import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PositionsPage } from "@/features/organization/components/positions-page";

export const metadata: Metadata = {
  title: "Positions — e-Document",
};

export default function PositionsRoute() {
  return (
    <div>
      <PageHeader
        title="Positions"
        description="Manage the roles that employees can hold."
      />
      <PositionsPage />
    </div>
  );
}