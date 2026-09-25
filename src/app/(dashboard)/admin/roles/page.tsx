import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { RolesPage } from "@/features/rbac/components/roles-page";

export const metadata: Metadata = {
  title: "Roles — e-Document",
};

export default function RolesRoute() {
  return (
    <div>
      <PageHeader
        title="Roles"
        description="Create roles and configure what they can do."
      />
      <RolesPage />
    </div>
  );
}