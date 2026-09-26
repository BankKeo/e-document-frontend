import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UserActivityPage } from "@/features/audit/components/user-activity-page";

export const metadata: Metadata = {
  title: "User Activity — e-Document",
};

export default function UserActivityRoute() {
  return (
    <div>
      <PageHeader
        title="User activity"
        description="Every action users performed across modules."
      />
      <UserActivityPage />
    </div>
  );
}