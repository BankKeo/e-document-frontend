"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_TASK_USERS } from "../mock/data";
import type { TaskPriority } from "../types";
import { useCreateTask } from "../api/task.queries";

const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Urgent"];

const DEFAULT_DUE_DATE = new Date(Date.now() + 3 * 86_400_000)
  .toISOString()
  .slice(0, 10);

export function CreateTaskDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateTask();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [assignee, setAssignee] = React.useState(MOCK_TASK_USERS[0]);
  const [priority, setPriority] = React.useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = React.useState(DEFAULT_DUE_DATE);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    if (!title.trim()) {
      setError("A task title is required.");
      return;
    }
    try {
      await create.mutateAsync({
        title,
        description,
        assignee,
        priority,
        dueDate,
      });
      toast.success("Task created");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Assign the task, set a priority and due date (TASK-001…005).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Review tender clarifications"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={Boolean(error)}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              rows={3}
              placeholder="What needs to be done?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="task-assignee">Assign to (TASK-002)</Label>
              <Select
                value={assignee}
                onValueChange={(value) =>
                  setAssignee(value ?? MOCK_TASK_USERS[0])
                }
              >
                <SelectTrigger id="task-assignee" className="w-full">
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-priority">Priority (TASK-003)</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority((value ?? "Medium") as TaskPriority)
                }
              >
                <SelectTrigger id="task-priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((entry) => (
                    <SelectItem key={entry} value={entry}>
                      {entry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-due">Due date (TASK-004)</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending && <Loader2 className="animate-spin" />}
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
