import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryPage } from "@/features/notification/components/category-page";

export const metadata: Metadata = {
  title: "Approval Notifications — e-Document",
};

export default function ApprovalNotificationsRoute() {
  return (
    <div>
      <PageHeader title="Approval Notifications" description="Requests waiting for your decision." />
      <CategoryPage kind="approval" />
    </div>
  );
}
