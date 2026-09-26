"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CalendarPlus, Clock, MapPin, Users } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMeetings } from "../api/meeting.queries";
import type { Meeting } from "../types";
import { formatDay } from "../utils";
import { CreateMeetingDialog } from "./create-meeting-dialog";

export function MeetingListPage() {
  const { data, isPending, isError, refetch } = useMeetings();
  const [createOpen, setCreateOpen] = React.useState(false);

  const upcoming = (data ?? []).filter(
    (m) => m.status === "Scheduled" || m.status === "In Progress"
  );
  const completed = (data ?? []).filter((m) => m.status === "Completed").length;
  const totalAttendees = (data ?? []).reduce(
    (sum, m) => sum + m.attendees.length,
    0
  );

  const columns = React.useMemo<ColumnDef<Meeting>[]>(() => {
    return [
      {
        accessorKey: "title",
        header: "Meeting",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={`/dms/meetings/${row.original.id}`}
              className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
            >
              {row.original.title}
            </Link>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatDay(row.original.date)} · {row.original.time}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5" />
            {row.original.location}
          </span>
        ),
      },
      {
        accessorKey: "organizer",
        header: "Organizer",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.organizer}
          </span>
        ),
      },
      {
        accessorKey: "attendees",
        header: "Attendees",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3.5" />
            {row.original.attendees.length}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.duration} min
          </span>
        ),
      },
    ];
  }, []);

  if (isError) {
    return (
      <div className="grid gap-2 text-sm">
        <p className="text-destructive">Unable to load meetings.</p>
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
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Meetings not yet finished.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{upcoming.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>
              Recorded meetings (MEET-006/008/009).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendees</CardTitle>
            <CardDescription>Across all recorded meetings.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalAttendees}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <CalendarPlus />
          Schedule meeting
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isPending}
        searchKey="title"
        searchPlaceholder="Search meetings..."
        emptyTitle="No meetings"
        emptyDescription="Schedule your first meeting to get started."
      />

      {createOpen ? (
        <CreateMeetingDialog
          key="create"
          onOpenChange={(open) => {
            if (!open) setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
