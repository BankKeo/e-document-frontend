"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { FormField } from "@/features/auth/components/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_MEETING_ROOMS } from "../mock/data";
import { useCreateMeeting } from "../api/meeting.queries";

export function CreateMeetingDialog({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const create = useCreateMeeting();
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = React.useState("09:00");
  const [duration, setDuration] = React.useState("60");
  const [location, setLocation] = React.useState(MOCK_MEETING_ROOMS[0]);
  const [attendee, setAttendee] = React.useState("");
  const [attendees, setAttendees] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  function addAttendee() {
    const trimmed = attendee.trim();
    if (!trimmed) return;
    setAttendees((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setAttendee("");
  }

  async function submit() {
    if (!title.trim()) {
      setError("A meeting title is required.");
      return;
    }
    try {
      await create.mutateAsync({
        title,
        date,
        time,
        duration: Number(duration),
        location,
        attendees,
      });
      toast.success("Meeting scheduled");
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
          <DialogTitle>Schedule meeting</DialogTitle>
          <DialogDescription>
            Create a new meeting, pick a room, and invite participants.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <FormField id="meet-title" label="Title" error={error ?? undefined}>
            {({ id, ...fieldProps }) => (
              <Input
                id={id}
                placeholder="Q1 Procurement Review"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                {...fieldProps}
              />
            )}
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="meet-date">Date</Label>
              <Input
                id="meet-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meet-time">Time</Label>
              <Input
                id="meet-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meet-duration">Duration (min)</Label>
              <Input
                id="meet-duration"
                type="number"
                min={15}
                step={15}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meet-location">Location</Label>
            <Select
              value={location}
              onValueChange={(value) =>
                setLocation(value ?? MOCK_MEETING_ROOMS[0])
              }
            >
              <SelectTrigger id="meet-location" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_MEETING_ROOMS.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meet-attendee">Attendees</Label>
            <div className="flex gap-2">
              <Input
                id="meet-attendee"
                placeholder="name@acme.gov"
                value={attendee}
                onChange={(event) => setAttendee(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addAttendee();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addAttendee}>
                <Plus />
              </Button>
            </div>
            {attendees.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {attendees.map((entry) => (
                  <li
                    key={entry}
                    className="flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {entry}
                    <button
                      type="button"
                      onClick={() =>
                        setAttendees((prev) =>
                          prev.filter((item) => item !== entry)
                        )
                      }
                      aria-label={`Remove ${entry}`}
                    >
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
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
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
