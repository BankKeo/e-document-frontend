import { AxiosError, isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  readonly fields: Record<string, string[]> | undefined;

  constructor(message: string, fields?: Record<string, string[]>) {
    super(message, 422);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "You are not signed in.") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class NetworkError extends ApiError {
  constructor(message = "Network error. Please check your connection.") {
    super(message, null);
    this.name = "NetworkError";
  }
}

export class RateLimitError extends ApiError {
  constructor(
    message = "Too many requests. Please try again in a moment.",
    readonly retryAfter?: number
  ) {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

const USER_ERROR_MESSAGES: Record<number, string> = {
  400: "The request was invalid. Please review and try again.",
  401: "You are not signed in.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "There is a conflict with the current resource state.",
  422: "Please fix the highlighted fields and try again.",
  429: "Too many requests. Please try again in a moment.",
  500: "Something went wrong on our side. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
};

export function normalizeErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!isAxiosError(error)) {
    return normalizeError(error);
  }

  const status = error.response?.status ?? null;
  const data = error.response?.data as ApiErrorResponse | undefined;
  const message =
    data?.message ?? (status ? USER_ERROR_MESSAGES[status] : undefined);

  return normalizeError(
    error,
    status ?? undefined,
    message ?? data?.message,
    data
  );
}

function normalizeError(
  error: AxiosError | unknown,
  status?: number,
  message?: string,
  data?: ApiErrorResponse
): ApiError {
  if (isAxiosError(error) && error.code === "ERR_NETWORK") {
    return new NetworkError();
  }

  const fallbackStatus = status ?? 500;
  switch (fallbackStatus) {
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 422:
      return new ValidationError(message ?? "Validation failed.", data?.fields);
    case 429:
      return new RateLimitError(message);
    default:
      return new ApiError(
        (message ?? status)
          ? USER_ERROR_MESSAGES[fallbackStatus]
          : "An unexpected error occurred.",
        fallbackStatus
      );
  }
}
