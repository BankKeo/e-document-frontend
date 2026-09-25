import {
  MOCK_BACKUP_CODES,
  MOCK_DEMO_CREDENTIALS,
  MOCK_INITIAL_SESSIONS,
  MOCK_TOTP_ACCOUNT,
  MOCK_TOTP_ISSUER,
  MOCK_TOTP_SECRET,
  MOCK_USERS,
  type MockUser,
} from "./data";
import type {
  AuthTokens,
  AuthUser,
  MfaMethod,
  MfaStatus,
  SignInResult,
  UserSession,
} from "../types";

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function isoAfter(ms: number) {
  return new Date(Date.now() + ms).toISOString();
}

function tokensFor(user: MockUser): AuthTokens {
  return {
    accessToken: `mock_access_${user.id}_${randomId("tok")}`,
    refreshToken: `mock_refresh_${user.id}_${randomId("tok")}`,
    accessTokenExpiresAt: isoAfter(ACCESS_TOKEN_TTL_MS),
    refreshTokenExpiresAt: isoAfter(REFRESH_TOKEN_TTL_MS),
  };
}

function stripUser(user: MockUser): AuthUser {
  return { id: user.id, email: user.email, name: user.name, roles: user.roles };
}

// In-memory mock state (resets on full page reload — an acceptable trade-off for
// a UI-only sandbox). Swap `authService` for real `auth.api.ts` calls later.
let mfaEnabled = false;
let mfaEnabledAt: string | null = null;
let sessions = [...MOCK_INITIAL_SESSIONS];

export const authService = {
  // AUTH-001 — Login
  async signIn(email: string, password: string): Promise<SignInResult> {
    await delay();
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user) {
      throw new Error("No account found for this email address.");
    }
    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }
    if (password === "00000000") {
      throw new Error("Account temporarily locked. Try again in 5 minutes.");
    }
    if (mfaEnabled && user.id === "usr_01") {
      return { kind: "mfa", challengeId: randomId("challenge") };
    }
    return { kind: "success", user: stripUser(user), tokens: tokensFor(user) };
  },

  // AUTH-001 / AUTH-008 — Complete MFA step during sign-in
  async verifyMfaChallenge(
    _challengeId: string,
    code: string
  ): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    await delay(600);
    if (code === "000000") {
      throw new Error("That code is incorrect or expired. Try again.");
    }
    const user = MOCK_USERS[0];
    return { user: stripUser(user), tokens: tokensFor(user) };
  },

  // AUTH-002 — Logout
  async signOut(): Promise<void> {
    await delay(300);
  },

  // AUTH-003 — Refresh token (silent rotation)
  async refresh(existing?: AuthTokens): Promise<AuthTokens> {
    await delay(350);
    const user =
      MOCK_USERS.find((u) => existing?.accessToken.includes(`mock_access_${u.id}`)) ??
      MOCK_USERS[0];
    return tokensFor(user);
  },

  // AUTH-004 — Forgot password (always succeeds to avoid account enumeration)
  async requestPasswordReset(email: string): Promise<{ resetToken: string }> {
    await delay(600);
    void email;
    return { resetToken: randomId("reset") };
  },

  // AUTH-005 — Reset password
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ user: AuthUser }> {
    await delay(600);
    const expired = token === "reset_expired" || token.trim() === "";
    if (!expired && !token.startsWith("reset_")) {
      throw new Error("This reset link is invalid or has already been used.");
    }
    if (expired) {
      throw new Error("This reset link has expired. Please request a new one.");
    }
    const user = MOCK_USERS[0];
    user.password = newPassword;
    return { user: stripUser(user) };
  },

  // AUTH-006 — Change password (requires current password)
  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await delay();
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (user && user.password !== currentPassword) {
      throw new Error("Your current password is incorrect.");
    }
    if (user) {
      user.password = newPassword;
    }
  },

  // AUTH-007 — Session management
  async listSessions(): Promise<UserSession[]> {
    await delay();
    sessions = sessions.map((session, index) => ({
      ...session,
      isCurrent: index === 0,
    }));
    return sessions;
  },

  async revokeSession(id: string): Promise<void> {
    await delay();
    const target = sessions.find((session) => session.id === id);
    if (target?.isCurrent) {
      throw new Error("You cannot revoke your current session from here.");
    }
    sessions = sessions.filter((session) => session.id !== id);
  },

  async revokeAllSessions(): Promise<void> {
    await delay(500);
    sessions = sessions.filter((session) => session.isCurrent);
  },

  // AUTH-008 — MFA
  async getMfaStatus(): Promise<MfaStatus> {
    await delay();
    return {
      enabled: mfaEnabled,
      method: mfaEnabled ? "totp" : null,
      enabledAt: mfaEnabledAt,
    };
  },

  async enableMfa(method: MfaMethod): Promise<{
    secret: string;
    otpauthUri: string;
  }> {
    await delay(400);
    void method;
    const otpauthUri =
      `otpauth://totp/${MOCK_TOTP_ISSUER}:${MOCK_TOTP_ACCOUNT}` +
      `?secret=${MOCK_TOTP_SECRET}&issuer=${MOCK_TOTP_ISSUER}`;
    return { secret: MOCK_TOTP_SECRET, otpauthUri };
  },

  async verifyMfaSetup(code: string): Promise<{ backupCodes: string[] }> {
    await delay(600);
    if (code === "000000") {
      throw new Error("That code is incorrect. Please try again.");
    }
    mfaEnabled = true;
    mfaEnabledAt = new Date().toISOString();
    return { backupCodes: [...MOCK_BACKUP_CODES] };
  },

  async regenerateBackupCodes(): Promise<string[]> {
    await delay(400);
    if (!mfaEnabled) {
      throw new Error("Enable two-factor authentication first.");
    }
    return [...MOCK_BACKUP_CODES];
  },

  async disableMfa(email: string, password: string): Promise<void> {
    await delay(500);
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (user && user.password !== password) {
      throw new Error("Your password is incorrect.");
    }
    mfaEnabled = false;
    mfaEnabledAt = null;
  },
};

export { MOCK_DEMO_CREDENTIALS };