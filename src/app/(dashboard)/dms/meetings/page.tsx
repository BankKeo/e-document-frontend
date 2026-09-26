import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { MeetingListPage } from "@/features/dms-meeting/components/meeting-list-page";

export const metadata: Metadata = {
  title: "Meetings — e-Document",
};

export default function MeetingsRoute() {
  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Schedule meetings, record minutes, decisions, and action items."
      />
      <MeetingListPage />
    </div>
  );
}
