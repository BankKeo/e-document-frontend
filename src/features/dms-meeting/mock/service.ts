import { MOCK_MEETINGS } from "./data";
import type { Meeting, MeetingActionItem, MeetingDecision } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let meetings: Meeting[] = [...MOCK_MEETINGS];

const CURRENT_ACTOR = "Malina Phetxomphou";

export const meetingService = {
  async listMeetings(): Promise<Meeting[]> {
    await delay();
    return meetings.map((entry) => ({
      ...entry,
      attendees: [...entry.attendees],
    }));
  },

  async getMeeting(id: string): Promise<Meeting> {
    await delay(200);
    const meeting = meetings.find((entry) => entry.id === id);
    if (!meeting) throw new Error("Meeting not found.");
    return { ...meeting, attendees: [...meeting.attendees] };
  },

  async createMeeting(input: {
    title: string;
    date: string;
    time: string;
    duration: number;
    location: string;
    attendees: string[];
  }): Promise<Meeting> {
    await delay(450);
    const created: Meeting = {
      id: randomId("meet"),
      title: input.title.trim(),
      date: `${input.date}T${input.time}`,
      time: input.time,
      duration: input.duration,
      location: input.location,
      organizer: CURRENT_ACTOR,
      attendees: input.attendees,
      status: "Scheduled",
      agenda: [],
      createdAt: new Date().toISOString(),
    };
    meetings = [created, ...meetings];
    return { ...created };
  },

  // MEET-003 — invite participants
  async addAttendees(id: string, emails: string[]): Promise<Meeting> {
    await delay(300);
    const index = meetings.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Meeting not found.");
    const existing = meetings[index];
    const next: Meeting = {
      ...existing,
      attendees: Array.from(new Set([...existing.attendees, ...emails])),
    };
    meetings = meetings.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },

  // MEET-006 — save minutes
  async saveMinutes(id: string, minutes: string): Promise<Meeting> {
    await delay(350);
    const index = meetings.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Meeting not found.");
    const existing = meetings[index];
    const next: Meeting = { ...existing, minutes };
    meetings = meetings.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },

  // MEET-008 — add decisions
  async addDecision(
    id: string,
    decision: Omit<MeetingDecision, "id">
  ): Promise<Meeting> {
    await delay(300);
    const index = meetings.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Meeting not found.");
    const existing = meetings[index];
    const next: Meeting = {
      ...existing,
      decisions: [
        ...(existing.decisions ?? []),
        { ...decision, id: randomId("d") },
      ],
    };
    meetings = meetings.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },

  // MEET-009 — add action items
  async addActionItem(
    id: string,
    item: Omit<MeetingActionItem, "id">
  ): Promise<Meeting> {
    await delay(300);
    const index = meetings.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Meeting not found.");
    const existing = meetings[index];
    const next: Meeting = {
      ...existing,
      actionItems: [
        ...(existing.actionItems ?? []),
        { ...item, id: randomId("ac") },
      ],
    };
    meetings = meetings.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },

  async setStatus(id: string, status: Meeting["status"]): Promise<Meeting> {
    await delay(300);
    const index = meetings.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Meeting not found.");
    const existing = meetings[index];
    const next: Meeting = { ...existing, status };
    meetings = meetings.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },
};
