import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { toApiError } from "@/lib/api/errors";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from "@/lib/auth/token";
import type { AuthTokens } from "@/types/auth";

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function isTokenRefreshPath(url: string | undefined): boolean {
  return Boolean(url?.includes("/auth/refresh"));
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;
    const status = error.response?.status;
    const shouldRefresh =
      status === 401 &&
      Boolean(original) &&
      !original?._retried &&
      !isTokenRefreshPath(original?.url);

    if (shouldRefresh && original) {
      const fallback = getAccessToken();

      if (fallback) {
        try {
          const { data } = await api.post<AuthTokens>("/auth/refresh");
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken ?? null);
          original._retried = true;
          return api(original);
        } catch {
          // Refresh failed — clear the session and let the caller surface the 401.
          setAccessToken(null);
          setRefreshToken(null);
        }
      }
    }

    return Promise.reject(toApiError(error));
  }
);
