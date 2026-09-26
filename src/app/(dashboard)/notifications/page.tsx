import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InboxPage } from "@/features/notification/components/inbox-page";

export const metadata: Metadata = {
  title: "Notifications — e-Document",
};

export default function NotificationsRoute() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="In-app updates, approvals, reminders, and alerts."
      />
      <InboxPage />
    </div>
  );
}