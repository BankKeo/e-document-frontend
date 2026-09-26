export type NotificationKind =
  | "approval"
  | "rejection"
  | "reminder"
  | "contract"
  | "stock"
  | "system";

export type NotificationPriority = "low" | "normal" | "high";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  ref?: string;
  priority: NotificationPriority;
}

export type EmailStatus = "Delivered" | "Failed" | "Queued";

export interface EmailNotification {
  id: string;
  toName: string;
  to: string;
  subject: string;
  template: string;
  at: string;
  status: EmailStatus;
}

export interface EmailPreference {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  channel: "immediate" | "digest";
}