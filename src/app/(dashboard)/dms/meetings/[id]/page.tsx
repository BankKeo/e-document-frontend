import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { MeetingDetail } from "@/features/dms-meeting/components/meeting-detail";

export const metadata: Metadata = {
  title: "Meeting details — e-Document",
};

export function generateStaticParams() {
  return [];
}

export default async function MeetingDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Meeting details"
        description="Attendees, agenda, minutes, decisions, and action items."
      />
      <MeetingDetail id={id} />
    </div>
  );
}
