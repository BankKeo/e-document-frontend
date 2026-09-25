import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUser,
  listUsers,
  userKeys,
  type ListUsersParams,
} from "@/features/users/api/user.api";
import type { CreateUserInput } from "@/features/users/schemas/user.schema";
import { toApiError } from "@/lib/api/errors";

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      void toApiError(error);
    },
  });
}

export type { CreateUserInput };
