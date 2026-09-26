import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryPage } from "@/features/notification/components/category-page";

export const metadata: Metadata = {
  title: "Rejection Notifications — e-Document",
};

export default function RejectionNotificationsRoute() {
  return (
    <div>
      <PageHeader title="Rejection Notifications" description="Submissions returned for correction." />
      <CategoryPage kind="rejection" />
    </div>
  );
}
