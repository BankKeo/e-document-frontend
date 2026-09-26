import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmailNotificationsPage } from "@/features/notification/components/email-notifications-page";

export const metadata: Metadata = {
  title: "Email Notifications — e-Document",
};

export default function EmailNotificationsRoute() {
  return (
    <div>
      <PageHeader
        title="Email notifications"
        description="Watch what your users receive and tune delivery preferences."
      />
      <EmailNotificationsPage />
    </div>
  );
}