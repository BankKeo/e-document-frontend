export type MeetingStatus =
  "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export interface MeetingAgendaItem {
  id: string;
  title: string;
  duration: number;
  owner: string;
}

export interface MeetingDecision {
  id: string;
  text: string;
  owner: string;
  deadline?: string;
}

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee: string;
  deadline: string;
  status: "Open" | "In Progress" | "Done";
}

export interface MeetingAttachment {
  id: string;
  name: string;
  size: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  organizer: string;
  attendees: string[];
  status: MeetingStatus;
  agenda: MeetingAgendaItem[];
  materials?: MeetingAttachment[];
  minutes?: string;
  decisions?: MeetingDecision[];
  actionItems?: MeetingActionItem[];
  createdAt: string;
}
