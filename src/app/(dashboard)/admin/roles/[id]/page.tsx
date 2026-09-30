import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { RoleDetail } from "@/features/rbac/components/role-detail";
import { MOCK_ROLES } from "@/features/rbac/mock/data";

export const metadata: Metadata = {
  title: "Role details — e-Document",
};

export function generateStaticParams() {
  return MOCK_ROLES.map((role) => ({ id: role.id }));
}

export default async function RoleDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Configure role"
        description="Permissions, department access, and data level."
      />
      <RoleDetail id={id} />
    </div>
  );
}