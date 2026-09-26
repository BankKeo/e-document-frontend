# Notification Module UX/UI — Implementation Notes (Mock-first)

Covers NOTIF-001 … NOTIF-007. All flows run against an in-memory mock
notification store so the UX can be reviewed before real event delivery is
wired up.

---

## 1. Routes

All under `/notifications` (Workspace) with a shared sub-navigation
(`NotificationNav`). A bell with a live unread-count badge is added to the
topbar and links here.

| Route                          | Features                                  |
| ------------------------------ | ----------------------------------------- |
| `/notifications`               | NOTIF-001 in-app inbox (all notifications) |
| `/notifications/approvals`     | NOTIF-003 approval notifications (+ act)  |
| `/notifications/rejections`    | NOTIF-004 rejection notifications         |
| `/notifications/reminders`     | NOTIF-005 task reminders                  |
| `/notifications/contracts`     | NOTIF-006 contract expiration alerts      |
| `/notifications/stock`         | NOTIF-007 low stock alerts                |
| `/notifications/email`         | NOTIF-002 email notifications & preferences |

---

## 2. Architecture

```
src/features/notification/
├── types/              # AppNotification, NotificationKind, EmailNotification,
│                       #   EmailPreference
├── mock/
│   ├── data.ts         # 13 in-app notifications, 8 emails, 6 preferences
│   └── service.ts      # notificationService (swap point)
├── api/notification.queries.ts  # react-query hooks (shared by bell + pages)
└── components/
    ├── notification-nav.tsx     # module sub-navigation
    ├── kind-meta.tsx            # kind → icon/badge/label + relative time
    ├── notification-feed.tsx    # reusable row list (read state, actions slot)
    ├── inbox-page.tsx           # NOTIF-001 (kind filter chips + mark all read)
    ├── category-page.tsx        # NOTIF-003/004/005/006/007 filtered views
    └── email-notifications-page.tsx  # NOTIF-002
```

The topbar bell (`src/components/layout/bell-menu.tsx`) shares the same query
keys, so read-state changes stay consistent across the dropdown and pages.

---

## 3. Feature Walkthrough

### NOTIF-001 — In-App Notification
Inbox lists all notifications (approval, rejection, reminder, contract, stock,
system) with unread styling + dot, kind badges, reference codes, and relative
time. Filter chips, mark-one-read, **Mark all read**, and a live unread count in
the topbar bell dropdown.

### NOTIF-002 — Email Notification
Email center: 6 toggleable **email preferences** (immediate vs digest channels,
e.g. Approval required, Rejections, Task reminders, Contract expiry, Low stock,
Weekly digest) and a **recently sent** email log (recipient, subject, template,
status).

### NOTIF-003 — Approval Notification
Approval feed with inline **Approve** / **Reject** actions; resolving a request
marks it read and converts it (mock "Approved" → system, "Rejected" →
rejection).

### NOTIF-004 — Rejection Notification
Submissions returned for correction, with the sender's reason.

### NOTIF-005 — Task Reminder
Due-soon and overdue task reminders with reference codes.

### NOTIF-006 — Contract Expiration Alert
Contracts expiring within 14/30 days with reference codes.

### NOTIF-007 — Low Stock Alert
Items below their reorder level (item + SKU + warehouse context).

---

## 4. Sandbox Notes

- Read state lives in an in-memory store: it updates live across the bell
  dropdown and all pages, and resets on reload.
- Approval resolve action demonstrates a state transition on the same record.
- Data resets on full page reload.

---

## 5. Mock → Real Backend Swap

`notificationService` (`src/features/notification/mock/service.ts`) is the single
seam:

| Mock method                    | Expected endpoint                     |
| ------------------------------ | ------------------------------------- |
| `listNotifications`            | `GET /notifications`                  |
| `markRead` / `markAllRead`     | `POST /notifications/:id/read` / `read-all` |
| `unreadCount`                  | `GET /notifications/unread-count`     |
| `resolveNotification`          | `POST /notifications/:id/decide`      |
| `listEmails`                   | `GET /notifications/emails`           |
| `listEmailPreferences` / `updateEmailPreference` | `GET/PUT /notifications/email-preferences` |

---

## 6. Commands

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run build       # production build (all routes compile)
```

Verified green: `lint`, `typecheck`, `build` (Next 16, Turbopack). All seven
`/notifications*` routes smoke tested (200); dev server on port 3000.