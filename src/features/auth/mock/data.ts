import type { AuthUser, MfaStatus, UserSession } from "../types";

export interface MockUser extends AuthUser {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "usr_01",
    name: "Malina Phetxomphou",
    email: "malina@acme.gov",
    password: "Password123!",
    roles: ["admin", "editor", "approver"],
  },
  {
    id: "usr_02",
    name: "Kham Anoulack",
    email: "kham@acme.gov",
    password: "Password123!",
    roles: ["editor"],
  },
];

export const MOCK_DEMO_CREDENTIALS = {
  email: "malina@acme.gov",
  password: "Password123!",
};

export const MOCK_TOTP_SECRET = "JBSWY3DPEHPK3PXP";
export const MOCK_TOTP_ISSUER = "e-Document";
export const MOCK_TOTP_ACCOUNT = "malina@acme.gov";

export const MOCK_INITIAL_SESSIONS: UserSession[] = [
  {
    id: "sess_01",
    label: "This device",
    device: "MacBook Pro",
    browser: "Chrome 128",
    os: "macOS 15",
    location: "Vientiane, LA",
    ip: "10.24.0.18",
    lastActiveAt: "now",
    isCurrent: true,
  },
  {
    id: "sess_02",
    label: "Work laptop",
    device: "ThinkPad T14",
    browser: "Edge 127",
    os: "Windows 11",
    location: "Vientiane, LA",
    ip: "172.16.3.41",
    lastActiveAt: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess_03",
    label: "Office desktop",
    device: "Dell OptiPlex",
    browser: "Firefox 129",
    os: "Ubuntu 24.04",
    location: "Savannakhet, LA",
    ip: "172.16.9.7",
    lastActiveAt: "Yesterday, 5:41 PM",
    isCurrent: false,
  },
  {
    id: "sess_04",
    label: "Mobile",
    device: "iPhone 15",
    browser: "Safari",
    os: "iOS 18",
    location: "Vientiane, LA",
    ip: "10.24.0.92",
    lastActiveAt: "3 days ago",
    isCurrent: false,
  },
];

export const MOCK_MFA_STATUS: MfaStatus = {
  enabled: false,
  method: null,
  enabledAt: null,
};

export const MOCK_BACKUP_CODES = [
  "7F2K-XK9P",
  "2VJN-P3QR",
  "9KXH-4TZD",
  "5MCW-B7RL",
  "H3QF-8GNM",
  "6RSD-W2TP",
  "KY4L-J9VF",
  "1UBT-C5XW",
  "N8DG-7EAS",
  "3ZYT-M4QC",
];