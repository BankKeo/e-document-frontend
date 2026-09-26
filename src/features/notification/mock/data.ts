import type {
  AppNotification,
  EmailNotification,
  EmailPreference,
} from "../types";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n_01", kind: "approval", title: "Approval required", body: "PR-2026-0142 · Purchase Requisition from Kham Anoulack is waiting for your approval.", at: ago(5), read: false, ref: "PR-2026-0142", priority: "high" },
  { id: "n_02", kind: "rejection", title: "PR-2026-0137 sent back", body: "Latsamy Vongsak: 'Missing justification for unit price.'", at: ago(12), read: false, ref: "PR-2026-0137", priority: "normal" },
  { id: "n_03", kind: "reminder", title: "Task due soon", body: "Review and approve RFQ evaluation report — due in 2 hours.", at: ago(18), read: false, ref: "RFQ-2026-011", priority: "high" },
  { id: "n_04", kind: "contract", title: "Contract expiring", body: "CON-2026-0018 with Vientiane Construction expires in 14 days.", at: ago(40), read: false, ref: "CON-2026-0018", priority: "high" },
  { id: "n_05", kind: "stock", title: "Low stock alert", body: "Bolt M12 x 60 (SKU-501) is below reorder level (200 left of 500).", at: ago(60), read: false, ref: "SKU-501", priority: "high" },
  { id: "n_06", kind: "approval", title: "Approval required", body: "Stock Adjustment ADJ-2026-078 from Phoutthasone needs level 2 approval.", at: ago(90), read: false, ref: "ADJ-2026-078", priority: "normal" },
  { id: "n_07", kind: "system", title: "Security notice", body: "New passkey added to your account on this device.", at: ago(130), read: true, priority: "low" },
  { id: "n_08", kind: "reminder", title: "Task overdue", body: "Approve Contract CON-2026-0016 — was due yesterday.", at: ago(260), read: true, ref: "CON-2026-0016", priority: "high" },
  { id: "n_09", kind: "contract", title: "Contract expiring", body: "CON-2026-0009 software license expires in 30 days.", at: ago(360), read: true, ref: "CON-2026-0009", priority: "normal" },
  { id: "n_10", kind: "stock", title: "Low stock alert", body: "Paint Thinner 5L (SKU-442) below reorder level at Regional Depot (24 left of 40).", at: ago(500), read: true, ref: "SKU-442", priority: "normal" },
  { id: "n_11", kind: "rejection", title: "DOC-2026-0085 rejected", body: "Malina: 'Refer back to Legal for the liquidated damages clause.'", at: ago(700), read: true, ref: "DOC-2026-0085", priority: "high" },
  { id: "n_12", kind: "system", title: "Weekly digest ready", body: "18 actions needed your attention this week.", at: ago(900), read: true, priority: "low" },
  { id: "n_13", kind: "approval", title: "Approval required", body: "Contract CON-2026-0020 is awaiting your level 3 approval.", at: ago(1200), read: true, ref: "CON-2026-0020", priority: "normal" },
];

export const MOCK_EMAILS: EmailNotification[] = [
  { id: "em_01", toName: "Malina Phetxomphou", to: "malina@acme.gov", subject: "Approval required: PR-2026-0142", template: "Approval Required", at: ago(5), status: "Delivered" },
  { id: "em_02", toName: "Latsamy Vongsak", to: "latsamy@acme.gov", subject: "Your request PR-2026-0137 was sent back", template: "Request Sent Back", at: ago(12), status: "Delivered" },
  { id: "em_03", toName: "Malina Phetxomphou", to: "malina@acme.gov", subject: "Reminder: RFQ-2026-011 evaluation due", template: "Task Reminder", at: ago(18), status: "Delivered" },
  { id: "em_04", toName: "Kham Anoulack", to: "kham@acme.gov", subject: "Contract CON-2026-0018 expiring soon", template: "Contract Expiry", at: ago(40), status: "Delivered" },
  { id: "em_05", toName: "Malina Phetxomphou", to: "malina@acme.gov", subject: "Low stock: SKU-501 below reorder level", template: "Low Stock Alert", at: ago(60), status: "Delivered" },
  { id: "em_06", toName: "Malina Phetxomphou", to: "malina@acme.gov", subject: "Weekly digest — 18 actions", template: "Weekly Digest", at: ago(900), status: "Delivered" },
  { id: "em_07", toName: "Aloun Sisavath", to: "aloun@acme.gov", subject: "CON-2026-0016 approval required", template: "Approval Required", at: ago(700), status: "Failed" },
  { id: "em_08", toName: "Malina Phetxomphou", to: "malina@acme.gov", subject: "Low stock: SKU-442 at Regional Depot", template: "Low Stock Alert", at: ago(500), status: "Delivered" },
];

export const MOCK_EMAIL_PREFERENCES: EmailPreference[] = [
  { key: "approval", label: "Approval required", description: "When something needs your approval.", enabled: true, channel: "immediate" },
  { key: "rejection", label: "Rejections & sent back", description: "When a request you submitted is rejected or returned.", enabled: true, channel: "immediate" },
  { key: "reminder", label: "Task reminders", description: "Reminders for tasks due or overdue.", enabled: false, channel: "immediate" },
  { key: "contract", label: "Contract expiry", description: "Contracts expiring within 30 days.", enabled: true, channel: "digest" },
  { key: "stock", label: "Low stock alerts", description: "Items below reorder level.", enabled: true, channel: "digest" },
  { key: "digest", label: "Weekly digest", description: "A weekly summary of activity.", enabled: true, channel: "digest" },
];