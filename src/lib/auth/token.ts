const REFRESH_TOKEN_KEY = "auth.refreshToken";

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

// ASSUMPTION: refresh token is normally issued inside an httpOnly cookie by
// the backend, so the frontend does not need to persist it. This fallback only
// covers backends that return it in the JSON body.
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearAuth(): void {
  accessToken = null;
  setRefreshToken(null);
}
