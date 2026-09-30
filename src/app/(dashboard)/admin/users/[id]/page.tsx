import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UserDetail } from "@/features/users/components/user-detail";
import { MOCK_USERS } from "@/features/users/mock/data";

export const metadata: Metadata = {
  title: "User details — e-Document",
};

export function generateStaticParams() {
  return MOCK_USERS.map((user) => ({ id: user.id }));
}

export default async function UserDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="User details"
        description="Review and manage a single user account."
      />
      <UserDetail id={id} />
    </div>
  );
}