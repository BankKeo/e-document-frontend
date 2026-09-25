import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { HierarchyPage } from "@/features/organization/components/hierarchy-page";

export const metadata: Metadata = {
  title: "Organizational Hierarchy — e-Document",
};

export default function HierarchyRoute() {
  return (
    <div>
      <PageHeader
        title="Organizational hierarchy"
        description="Explore departments, teams, and reporting lines."
      />
      <HierarchyPage />
    </div>
  );
}