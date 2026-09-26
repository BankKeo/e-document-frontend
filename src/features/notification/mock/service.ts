import {
  MOCK_EMAILS,
  MOCK_EMAIL_PREFERENCES,
  MOCK_NOTIFICATIONS,
} from "./data";
import type {
  AppNotification,
  EmailNotification,
  EmailPreference,
  NotificationKind,
} from "../types";

function delay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory mock store (resets on full reload). Swap `notificationService` for
// real API calls later; the react-query layer in `api/notification.queries.ts`
// stays unchanged.
let notifications: AppNotification[] = [...MOCK_NOTIFICATIONS];
const emails: EmailNotification[] = [...MOCK_EMAILS];
let preferences: EmailPreference[] = [...MOCK_EMAIL_PREFERENCES];

export const notificationService = {
  // NOTIF-001 — In-app notifications
  async listNotifications(): Promise<AppNotification[]> {
    await delay();
    return notifications.map((entry) => ({ ...entry }));
  },

  async markRead(id: string): Promise<void> {
    await delay(80);
    notifications = notifications.map((entry) =>
      entry.id === id ? { ...entry, read: true } : entry
    );
  },

  async markAllRead(): Promise<void> {
    await delay(150);
    notifications = notifications.map((entry) => ({ ...entry, read: true }));
  },

  async unreadCount(): Promise<number> {
    await delay(60);
    return notifications.filter((entry) => !entry.read).length;
  },

  async resolveNotification(
    id: string,
    resolution: "approved" | "rejected"
  ): Promise<void> {
    await delay(250);
    notifications = notifications.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            read: true,
            title:
              resolution === "approved" ? "Approved" : "Rejected",
            body: `You ${resolution} this request.`,
            kind: resolution === "approved" ? "system" : "rejection",
          }
        : entry
    );
  },

  // NOTIF-002 — Email notifications
  async listEmails(): Promise<EmailNotification[]> {
    await delay();
    return emails.map((entry) => ({ ...entry }));
  },

  async listEmailPreferences(): Promise<EmailPreference[]> {
    await delay();
    return preferences.map((entry) => ({ ...entry }));
  },

  async updateEmailPreference(key: string, enabled: boolean): Promise<void> {
    await delay(120);
    preferences = preferences.map((entry) =>
      entry.key === key ? { ...entry, enabled } : entry
    );
  },
};

export type { NotificationKind };