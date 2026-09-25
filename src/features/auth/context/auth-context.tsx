"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../mock/service";
import type {
  AuthStatus,
  AuthTokens,
  AuthUser,
  PersistedSession,
  SignInResult,
} from "../types";

const SESSION_KEY = "auth.session";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  tokens: AuthTokens | null;
  signIn: (email: string, password: string, remember: boolean) => Promise<SignInResult>;
  completeMfa: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readSession(): PersistedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PersistedSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: PersistedSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

async function restoreSession(): Promise<PersistedSession | null> {
  const session = readSession();
  if (!session) return null;

  const expired =
    new Date(session.tokens.accessTokenExpiresAt).getTime() <= Date.now();

  // AUTH-003 — silently rotate an expired access token on boot.
  if (expired) {
    try {
      const tokens = await authService.refresh(session.tokens);
      const next = { ...session, tokens };
      writeSession(next);
      return next;
    } catch {
      writeSession(null);
      return null;
    }
  }

  return session;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [tokens, setTokens] = React.useState<AuthTokens | null>(null);
  const pendingRemember = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    restoreSession().then((session) => {
      if (cancelled) return;
      if (session) {
        setUser(session.user);
        setTokens(session.tokens);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function applySession(
    nextUser: AuthUser,
    nextTokens: AuthTokens,
    remember: boolean
  ) {
    setUser(nextUser);
    setTokens(nextTokens);
    setStatus("authenticated");
    writeSession(remember ? { user: nextUser, tokens: nextTokens } : null);
  }

  async function signIn(
    email: string,
    password: string,
    remember: boolean
  ): Promise<SignInResult> {
    const result = await authService.signIn(email, password);
    if (result.kind === "success") {
      pendingRemember.current = remember;
      applySession(result.user, result.tokens, remember);
      toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
    } else {
      pendingRemember.current = remember;
    }
    return result;
  }

  async function completeMfa(code: string) {
    const result = await authService.verifyMfaChallenge("challenge", code);
    applySession(result.user, result.tokens, pendingRemember.current);
    toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
  }

  async function signOut() {
    try {
      await authService.signOut();
    } finally {
      setUser(null);
      setTokens(null);
      setStatus("unauthenticated");
      writeSession(null);
      toast.info("You have been signed out.");
      router.replace("/login");
    }
  }

  async function refreshSession() {
    if (!tokens) {
      throw new Error("No active session to refresh.");
    }
    const nextTokens = await authService.refresh(tokens);
    setTokens(nextTokens);
    // Only persist when the session was persisted (i.e. "remember me" was on).
    if (readSession()) {
      const next: PersistedSession = { user: user!, tokens: nextTokens };
      writeSession(next);
    }
    toast.success("Session refreshed");
  }

  const value = React.useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      tokens,
      signIn,
      completeMfa,
      signOut,
      refreshSession,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, user, tokens]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}