import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TaskDetail } from "@/features/dms-task/components/task-detail";
import { MOCK_TASKS } from "@/features/dms-task/mock/data";

export const metadata: Metadata = {
  title: "Task details — e-Document",
};

export function generateStaticParams() {
  return MOCK_TASKS.map((task) => ({ id: task.id }));
}

export default async function TaskDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Task details"
        description="Assignment, status, attachments, reminders, and comments."
      />
      <TaskDetail id={id} />
    </div>
  );
}
