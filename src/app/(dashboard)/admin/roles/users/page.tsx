import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UserRolesPage } from "@/features/rbac/components/user-roles-page";

export const metadata: Metadata = {
  title: "User Roles — e-Document",
};

export default function UserRolesRoute() {
  return (
    <div>
      <PageHeader
        title="User roles"
        description="Assign roles to users to grant access."
      />
      <UserRolesPage />
    </div>
  );
}