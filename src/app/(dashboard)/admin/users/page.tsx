import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UsersPage } from "@/features/users/components/users-page";

export const metadata: Metadata = {
  title: "Users — e-Document",
};

export default function UsersRoute() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Create and manage user accounts, roles, and department access."
      />
      <UsersPage />
    </div>
  );
}