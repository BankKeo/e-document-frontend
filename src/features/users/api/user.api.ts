import { api } from "@/lib/api/client";
import type { PaginatedResponse } from "@/types/api";
import type { User } from "@/features/users/types";
import type { CreateUserInput } from "@/features/users/schemas/user.schema";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: ListUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export interface ListUsersParams {
  page: number;
  limit: number;
  search?: string;
}

export async function listUsers(
  params: ListUsersParams
): Promise<PaginatedResponse<User>> {
  const { data } = await api.get<PaginatedResponse<User>>("/users", { params });
  return data;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const { data } = await api.post<User>("/users", input);
  return data;
}
