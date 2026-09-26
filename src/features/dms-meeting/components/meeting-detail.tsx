"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarCheck,
  Circle,
  CircleCheck,
  Clock,
  FileText,
  Gavel,
  Loader2,
  Plus,
  Save,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  useAddActionItem,
  useAddAttendees,
  useAddDecision,
  useMeeting,
  useSaveMinutes,
} from "../api/meeting.queries";
import type { MeetingActionItem } from "../types";
import { formatBytes, formatDay } from "../utils";

const ACTION_BADGE: Record<
  MeetingActionItem["status"],
  "default" | "secondary" | "outline"
> = {
  Open: "outline",
  "In Progress": "secondary",
  Done: "default",
};

interface ListEntry {
  key: string;
  label: string;
  meta?: string;
}

function toList(
  meeting: NonNullable<ReturnType<typeof useMeeting>["data"]>
): ListEntry[] {
  return [
    { key: "date", label: formatDay(meeting.date), meta: "Date" },
    { key: "time", label: meeting.time, meta: "Time" },
    { key: "duration", label: `${meeting.duration} minutes`, meta: "Duration" },
    { key: "location", label: meeting.location, meta: "Location" },
  ];
}

export function MeetingDetail({ id }: { id: string }) {
  const { data: meeting, isPending, isError, refetch } = useMeeting(id);
  const saveMinutes = useSaveMinutes();
  const addAttendees = useAddAttendees();
  const addDecision = useAddDecision();
  const addActionItem = useAddActionItem();

  const [attendee, setAttendee] = React.useState("");
  const [minutes, setMinutes] = React.useState("");
  const [decision, setDecision] = React.useState("");
  const [newAction, setNewAction] = React.useState("");

  // Sync editable text when the meeting changes.
  const lastId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!meeting) return;
    if (lastId.current === meeting.id) return;
    lastId.current = meeting.id;
    setMinutes(meeting.minutes ?? "");
    setAttendee("");
    setDecision("");
    setNewAction("");
  }, [meeting]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading meeting…
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm font-medium">Unable to load meeting</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link
            href="/dms/meetings"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to meetings
          </Link>
        </div>
      </div>
    );
  }

  const quickList = toList(meeting);
  const currentMeeting = meeting;

  async function handleSaveMinutes() {
    try {
      await saveMinutes.mutateAsync({ id: currentMeeting.id, minutes });
      toast.success("Minutes saved (MEET-006)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    }
  }

  async function handleAddAttendee() {
    const trimmed = attendee.trim();
    if (!trimmed) return;
    try {
      await addAttendees.mutateAsync({
        id: currentMeeting.id,
        emails: [trimmed],
      });
      setAttendee("");
      toast.success("Participant added (MEET-003)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add.");
    }
  }

  async function handleAddDecision() {
    if (!decision.trim()) return;
    try {
      await addDecision.mutateAsync({
        id: currentMeeting.id,
        decision: { text: decision.trim(), owner: currentMeeting.organizer },
      });
      setDecision("");
      toast.success("Decision recorded (MEET-008)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add.");
    }
  }

  async function handleAddAction() {
    if (!newAction.trim()) return;
    try {
      await addActionItem.mutateAsync({
        id: currentMeeting.id,
        item: {
          text: newAction.trim(),
          assignee: currentMeeting.organizer,
          deadline: new Date(Date.now() + 7 * 86_400_000)
            .toISOString()
            .slice(0, 10),
          status: "Open",
        },
      });
      setNewAction("");
      toast.success("Action item added (MEET-009)");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add.");
    }
  }

  return (
    <div className="grid gap-6">
      <Link
        href="/dms/meetings"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to meetings
      </Link>

      <Card>
        <CardContent className="grid gap-4 sm:flex sm:items-start sm:justify-between">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {meeting.title}
              </h2>
              <StatusBadge status={meeting.status} />
            </div>
            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {quickList.map((entry) => (
                <div key={entry.key} className="flex items-center gap-2">
                  <dt className="text-xs text-muted-foreground">
                    {entry.meta}
                  </dt>
                  <dd className="font-medium">{entry.label}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-muted-foreground">
              Organized by {meeting.organizer}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                Attendees
              </CardTitle>
              <CardDescription>
                {meeting.attendees.length} invited.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ul className="grid gap-1.5">
                {meeting.attendees.map((attendeeName) => (
                  <li
                    key={attendeeName}
                    className="text-sm text-muted-foreground"
                  >
                    {attendeeName}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="name@acme.gov"
                  value={attendee}
                  onChange={(event) => setAttendee(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleAddAttendee();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleAddAttendee}
                  disabled={addAttendees.isPending}
                >
                  <Plus />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                Agenda (MEET-004)
              </CardTitle>
              <CardDescription>
                Materials uploaded are listed here (MEET-005).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <ol className="grid gap-1.5">
                {meeting.agenda.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm"
                  >
                    <span className="font-medium">
                      {index + 1}. {item.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.duration} min · {item.owner}
                    </span>
                  </li>
                ))}
              </ol>
              {meeting.materials && meeting.materials.length > 0 ? (
                <ul className="grid gap-1.5 pt-1">
                  {meeting.materials.map((material) => (
                    <li
                      key={material.id}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <FileText className="size-3.5" />
                      <span className="font-mono text-xs">{material.name}</span>
                      <span className="ml-auto font-mono text-xs">
                        {formatBytes(material.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="size-4 text-muted-foreground" />
                Decisions (MEET-008)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ul className="grid gap-2">
                {(meeting.decisions ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    {item.text}
                    {item.deadline ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        By {new Date(item.deadline).toLocaleDateString()}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="Decision reached…"
                  value={decision}
                  onChange={(event) => setDecision(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleAddDecision();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleAddDecision}
                  disabled={addDecision.isPending}
                >
                  <Gavel />
                  Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                Minutes (MEET-006)
              </CardTitle>
              <CardDescription>
                Write and save the meeting minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Textarea
                rows={6}
                placeholder="Notes, discussion summary, and outcomes…"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
              />
              {minutes.trim() || (meeting.minutes ?? "").trim() ? (
                <Button
                  onClick={handleSaveMinutes}
                  disabled={saveMinutes.isPending}
                  className="justify-self-end"
                >
                  {saveMinutes.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save />
                  )}
                  Save minutes
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleCheck className="size-4 text-muted-foreground" />
                Action items (MEET-009)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ul className="grid gap-2">
                {(meeting.actionItems ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
                  >
                    <Circle className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1">{item.text}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.assignee} · due{" "}
                        {new Date(item.deadline).toLocaleDateString()}
                      </span>
                    </span>
                    <Badge variant={ACTION_BADGE[item.status]}>
                      {item.status}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="New action item…"
                  value={newAction}
                  onChange={(event) => setNewAction(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleAddAction();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={handleAddAction}
                  disabled={addActionItem.isPending}
                >
                  <Plus />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
