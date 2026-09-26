"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Clock,
  Loader2,
  MessageCircle,
  Paperclip,
  Send,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_TASK_USERS } from "../mock/data";
import type { TaskStatus } from "../types";
import {
  useAddTaskComment,
  useAssignTask,
  useRequestReminder,
  useSetTaskStatus,
  useTask,
} from "../api/task.queries";

const STATUS_TONE: Record<string, string> = {
  Open: "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/10 text-primary",
  Done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Overdue: "bg-red-500/10 text-destructive",
};

export function TaskDetail({ id }: { id: string }) {
  const { data: task, isPending, isError, refetch } = useTask(id);
  const setStatus = useSetTaskStatus();
  const assign = useAssignTask();
  const comment = useAddTaskComment();
  const reminder = useRequestReminder();
  const [commentText, setCommentText] = React.useState("");

  // Reset the comment box when the task changes.
  const lastId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!task) return;
    if (lastId.current === task.id) return;
    lastId.current = task.id;
    setCommentText("");
  }, [task]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading task…
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load task</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/dms/tasks"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to tasks
          </Link>
        </div>
      </div>
    );
  }

  const currentTask = task;

  async function handleAddComment() {
    if (!commentText.trim()) return;
    try {
      await comment.mutateAsync({ id: currentTask.id, text: commentText });
      setCommentText("");
      toast.success("Comment added (TASK-006)");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to comment."
      );
    }
  }

  async function handleReminder() {
    try {
      await reminder.mutateAsync(currentTask.id);
      toast.success("Reminder requested (TASK-008)");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to set reminder."
      );
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/dms/tasks"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to tasks
      </Link>

      <Card>
        <CardContent className="grid gap-4 sm:flex sm:items-start sm:justify-between">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {currentTask.title}
              </h2>
              <Badge className={STATUS_TONE[currentTask.status]}>
                {currentTask.status}
              </Badge>
              <Badge variant="outline" className="font-mono">
                {currentTask.ref}
              </Badge>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              {currentTask.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <UserRound className="size-3.5" />
                Assigned to {currentTask.assignee}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                Due {new Date(currentTask.dueDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {currentTask.comments.length} comment
                {currentTask.comments.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Select
              value={currentTask.status}
              onValueChange={(value) =>
                void setStatus.mutateAsync({
                  id: currentTask.id,
                  status: value as TaskStatus,
                })
              }
            >
              <SelectTrigger
                size="sm"
                className="w-36"
                aria-label="Task status"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReminder}
              disabled={reminder.isPending}
            >
              <Bell />
              Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-4 text-muted-foreground" />
                Assignment (TASK-002)
              </CardTitle>
              <CardDescription>Reassign to another person.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={currentTask.assignee}
                onValueChange={(value) =>
                  void assign.mutateAsync({
                    id: currentTask.id,
                    assignee: value ?? "",
                  })
                }
              >
                <SelectTrigger className="w-full" aria-label="Assign task">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TASK_USERS.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="size-4 text-muted-foreground" />
                Attachments (TASK-007)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTask.attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No attachments yet.
                </p>
              ) : (
                <ul className="grid gap-1.5">
                  {currentTask.attachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Paperclip className="size-3.5" />
                      <span className="font-mono text-xs">
                        {attachment.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {currentTask.relatedTo ? (
            <Card>
              <CardHeader>
                <CardTitle>Related record</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{currentTask.relatedTo}</Badge>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-4 text-muted-foreground" />
              Comments (TASK-006)
            </CardTitle>
            <CardDescription>
              Discussion and updates on this task.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {currentTask.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              <ul className="grid gap-3">
                {currentTask.comments.map((commentItem) => (
                  <li key={commentItem.id} className="rounded-lg border p-3">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {commentItem.author}
                      </span>
                      {new Date(commentItem.at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-sm">{commentItem.text}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Textarea
                rows={2}
                placeholder="Add a comment…"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              <Button
                variant="outline"
                onClick={handleAddComment}
                disabled={comment.isPending || !commentText.trim()}
              >
                <Send />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
