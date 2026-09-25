import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { OrganizationOverview } from "@/features/organization/components/organization-overview";

export const metadata: Metadata = {
  title: "Organization — e-Document",
};

export default function OrganizationRoute() {
  return (
    <div>
      <PageHeader
        title="Organization"
        description="Entity profile, structure, and approval authority."
      />
      <OrganizationOverview />
    </div>
  );
}