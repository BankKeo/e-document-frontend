export interface PageParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  fields?: Record<string, string[]>;
}
