import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryPage } from "@/features/notification/components/category-page";

export const metadata: Metadata = {
  title: "Task Reminders — e-Document",
};

export default function TaskRemindersRoute() {
  return (
    <div>
      <PageHeader title="Task Reminders" description="Deadlines and overdue tasks." />
      <CategoryPage kind="reminder" />
    </div>
  );
}
