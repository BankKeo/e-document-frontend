"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CircleDot,
  ClipboardCheck,
  Flag,
  GripVertical,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskStatus } from "../types";
import {
  useRequestReminder,
  useSetTaskStatus,
  useTasks,
} from "../api/task.queries";
import { CreateTaskDialog } from "./create-task-dialog";

const STATUS_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "Open", label: "Open" },
  { status: "In Progress", label: "In progress" },
  { status: "Done", label: "Done" },
  { status: "Overdue", label: "Overdue" },
];

const PRIORITY_TONE: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  High: "bg-primary/10 text-primary",
  Urgent: "bg-red-500/10 text-destructive",
};

function isOverdue(task: Task): boolean {
  return (
    task.status !== "Done" && new Date(task.dueDate).getTime() < Date.now()
  );
}

export function TaskColumn({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <section className="grid gap-3 rounded-lg border bg-muted/30 p-3">
      <header className="flex items-center justify-between gap-2 px-1">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <GripVertical className="size-3.5 text-muted-foreground" />
          {title}
          <Badge variant="outline" className="font-mono tabular-nums">
            {tasks.length}
          </Badge>
        </h3>
      </header>
      {tasks.length === 0 ? (
        <p className="px-1 py-4 text-center text-xs text-muted-foreground">
          No tasks.
        </p>
      ) : (
        <ol className="grid gap-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function TaskCard({ task }: { task: Task }) {
  const setStatus = useSetTaskStatus();
  const reminder = useRequestReminder();
  const active = isOverdue(task);

  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/dms/tasks/${task.id}`}
          className="line-clamp-2 text-sm font-medium hover:underline hover:underline-offset-4"
        >
          {task.title}
        </Link>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_TONE[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{task.ref}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CircleDot className="size-3" />
          {task.assignee}
        </span>
        <span className="flex items-center gap-1">
          <Flag className="size-3" />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
        {task.comments.length > 0 ? (
          <span className="flex items-center gap-1">
            <ClipboardCheck className="size-3" />
            {task.comments.length}
          </span>
        ) : null}
      </div>
      {task.status !== "Done" ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2">
          <select
            aria-label={`Set status for ${task.title}`}
            className="h-7 rounded-md border bg-background px-1.5 text-xs"
            value={task.status}
            onChange={(event) =>
              void setStatus.mutateAsync({
                id: task.id,
                status: event.target.value as TaskStatus,
              })
            }
          >
            {STATUS_COLUMNS.map((column) => (
              <option key={column.status} value={column.status}>
                {column.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            {active ? (
              <Badge variant="outline" className="text-destructive">
                Overdue
              </Badge>
            ) : null}
            <Button
              variant="ghost"
              size="icon-sm"
              title="Request reminder (TASK-008)"
              onClick={() => void reminder.mutateAsync(task.id)}
              disabled={reminder.isPending}
            >
              <Bell />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function TaskListPage() {
  const { data, isError, refetch } = useTasks();
  const [createOpen, setCreateOpen] = React.useState(false);

  const openTasks = (data ?? []).filter((task) => task.status === "Open");
  const inProgressTasks = (data ?? []).filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = (data ?? []).filter((task) => task.status === "Done");
  const overdueTasks = (data ?? []).filter(isOverdue);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load tasks.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="justify-self-start text-sm text-primary underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data?.length ?? 0} tasks · {overdueTasks.length} overdue
        </p>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TaskColumn title="Open" tasks={openTasks} />
        <TaskColumn title="In progress" tasks={inProgressTasks} />
        <TaskColumn title="Done" tasks={doneTasks} />
        <TaskColumn title="Overdue" tasks={overdueTasks} />
      </div>

      {createOpen ? (
        <CreateTaskDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
