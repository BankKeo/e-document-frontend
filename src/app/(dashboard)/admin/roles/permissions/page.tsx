import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionsPage } from "@/features/rbac/components/permissions-page";

export const metadata: Metadata = {
  title: "Permissions — e-Document",
};

export default function PermissionsRoute() {
  return (
    <div>
      <PageHeader
        title="Permissions"
        description="The granular actions available across modules."
      />
      <PermissionsPage />
    </div>
  );
}