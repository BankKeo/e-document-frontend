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
        description="Manage users and their access to the platform."
      />
      <UsersPage />
    </div>
  );
}
