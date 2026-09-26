import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TaskListPage } from "@/features/dms-task/components/task-list-page";

export const metadata: Metadata = {
  title: "My Tasks — e-Document",
};

export default function TasksRoute() {
  return (
    <div>
      <PageHeader
        title="My Tasks"
        description="Create, assign, prioritize, and track tasks to completion."
      />
      <TaskListPage />
    </div>
  );
}
