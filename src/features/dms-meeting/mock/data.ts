import type { Meeting } from "../types";

function dateIn(days: number, time: string): string {
  const d = new Date(Date.now() + days * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${time}`;
}

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: "meet_1",
    title: "Q1 Procurement Review",
    date: dateIn(1, "09:00"),
    time: "09:00",
    duration: 90,
    location: "Meeting Room B",
    organizer: "Aloun Sisavath",
    attendees: [
      "Aloun Sisavath",
      "Kham Anoulack",
      "Malina Phetxomphou",
      "Phoutthasone Keomany",
    ],
    status: "Scheduled",
    agenda: [
      {
        id: "a1",
        title: "Budget execution status",
        duration: 20,
        owner: "Aloun Sisavath",
      },
      {
        id: "a2",
        title: "Active tenders update",
        duration: 25,
        owner: "Kham Anoulack",
      },
      {
        id: "a3",
        title: "Supplier onboarding pipeline",
        duration: 25,
        owner: "Malina Phetxomphou",
      },
      {
        id: "a4",
        title: "Contract renewal watchlist",
        duration: 20,
        owner: "Phoutthasone Keomany",
      },
    ],
    materials: [{ id: "m1", name: "Q1-dashboard.pdf", size: 420_000 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meet_2",
    title: "Warehouse Inbound Test — UAT",
    date: dateIn(2, "14:00"),
    time: "14:00",
    duration: 60,
    location: "Warehouse Training Room",
    organizer: "Somchai Keopaseuth",
    attendees: [
      "Somchai Keopaseuth",
      "Phoutthasone Keomany",
      "Malinee Vongkham",
    ],
    status: "Scheduled",
    agenda: [
      {
        id: "a1",
        title: "Walkthrough of receiving flow",
        duration: 20,
        owner: "Somchai Keopaseuth",
      },
      {
        id: "a2",
        title: "Barcode scanning test",
        duration: 20,
        owner: "Malinee Vongkham",
      },
      {
        id: "a3",
        title: "Sign-off next steps",
        duration: 20,
        owner: "Phoutthasone Keomany",
      },
    ],
    materials: [{ id: "m1", name: "IN-001-test-plan.pdf", size: 180_000 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meet_3",
    title: "Tender Evaluation Committee",
    date: dateIn(-1, "10:00"),
    time: "10:00",
    duration: 120,
    location: "Boardroom",
    organizer: "Kham Anoulack",
    attendees: ["Kham Anoulack", "Aloun Sisavath", "Viengkham Saysana"],
    status: "Completed",
    agenda: [
      {
        id: "a1",
        title: "Bid compliance review",
        duration: 30,
        owner: "Kham Anoulack",
      },
      {
        id: "a2",
        title: "Technical scoring",
        duration: 45,
        owner: "Viengkham Saysana",
      },
      {
        id: "a3",
        title: "Financial evaluation",
        duration: 45,
        owner: "Aloun Sisavath",
      },
    ],
    materials: [{ id: "m1", name: "TENDER-011-bids.zip", size: 2_400_000 }],
    minutes:
      "Committee reviewed four compliant bids. Technical evaluation completed; financial scoring deferred to next session pending clarifications.",
    decisions: [
      {
        id: "d1",
        text: "Evaluate two bids for financial clarification",
        owner: "Aloun Sisavath",
        deadline: dateIn(3, "09:00"),
      },
      {
        id: "d2",
        text: "Invite top-2 suppliers to technical interview",
        owner: "Kham Anoulack",
        deadline: dateIn(5, "09:00"),
      },
    ],
    actionItems: [
      {
        id: "ac1",
        text: "Compile scoring matrix into report",
        assignee: "Viengkham Saysana",
        deadline: dateIn(3, "17:00"),
        status: "In Progress",
      },
      {
        id: "ac2",
        text: "Circulate minutes to committee",
        assignee: "Kham Anoulack",
        deadline: dateIn(1, "17:00"),
        status: "Open",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meet_4",
    title: "Monthly Staff & Safety Briefing",
    date: dateIn(-6, "08:30"),
    time: "08:30",
    duration: 45,
    location: "Staff Canteen",
    organizer: "Malina Phetxomphou",
    attendees: ["Malina Phetxomphou", "All Staff"],
    status: "Completed",
    agenda: [
      {
        id: "a1",
        title: "Monthly announcements",
        duration: 15,
        owner: "Malina Phetxomphou",
      },
      {
        id: "a2",
        title: "Safety reminders",
        duration: 15,
        owner: "Malina Phetxomphou",
      },
      { id: "a3", title: "Open questions", duration: 15, owner: "All Staff" },
    ],
    minutes:
      "General announcements made. Warehouse safety signs to be refreshed. Fire drill scheduled for next quarter.",
    decisions: [
      {
        id: "d1",
        text: "Refresh safety signage in warehouse",
        owner: "Somchai Keopaseuth",
      },
    ],
    actionItems: [
      {
        id: "ac1",
        text: "Order new safety signs",
        assignee: "Somchai Keopaseuth",
        deadline: dateIn(10, "17:00"),
        status: "Open",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meet_5",
    title: "Contract Renewal Review",
    date: dateIn(7, "11:00"),
    time: "11:00",
    duration: 60,
    location: "Meeting Room A",
    organizer: "Phoutthasone Keomany",
    attendees: ["Phoutthasone Keomany", "Malina Phetxomphou"],
    status: "Scheduled",
    agenda: [
      {
        id: "a1",
        title: "Review renewal terms",
        duration: 30,
        owner: "Phoutthasone Keomany",
      },
      {
        id: "a2",
        title: "Budget availability check",
        duration: 30,
        owner: "Malina Phetxomphou",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meet_6",
    title: "Cancelled — Vendor Demo",
    date: dateIn(3, "15:00"),
    time: "15:00",
    duration: 60,
    location: "Videoconference",
    organizer: "Aloun Sisavath",
    attendees: ["Aloun Sisavath", "Vendor Team"],
    status: "Cancelled",
    agenda: [
      { id: "a1", title: "Product demo", duration: 60, owner: "Vendor Team" },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_MEETING_ROOMS = [
  "Meeting Room A",
  "Meeting Room B",
  "Boardroom",
  "Warehouse Training Room",
  "Staff Canteen",
  "Videoconference",
];
