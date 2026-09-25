export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface PersistedSession {
  user: AuthUser;
  tokens: AuthTokens;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type SignInResult =
  | { kind: "success"; user: AuthUser; tokens: AuthTokens }
  | { kind: "mfa"; challengeId: string };

export interface UserSession {
  id: string;
  label: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export type MfaMethod = "totp";

export interface MfaStatus {
  enabled: boolean;
  method: MfaMethod | null;
  enabledAt: string | null;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: Array<{ label: string; met: boolean }>;
}