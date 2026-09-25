import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { userService } from "../mock/service";
import type { CreateUserInput, EditUserInput } from "../schemas/user.schema";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: () => [...userKeys.all, "roles"] as const,
  departments: () => [...userKeys.all, "departments"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => userService.listUsers(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: Boolean(id),
  });
}

export function useRoles() {
  return useQuery({
    queryKey: userKeys.roles(),
    queryFn: () => userService.listRoles(),
    staleTime: Infinity,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: userKeys.departments(),
    queryFn: () => userService.listDepartments(),
    staleTime: Infinity,
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    queryClient.invalidateQueries({ queryKey: userKeys.details() });
  };
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: invalidate,
  });
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EditUserInput }) =>
      userService.updateUser(id, input),
    onSuccess: invalidate,
  });
}

export function useDisableUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: userService.disableUser,
    onSuccess: invalidate,
  });
}

export function useActivateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: userService.activateUser,
    onSuccess: invalidate,
  });
}

export function useAssignRole() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      userService.assignRole(id, role),
    onSuccess: invalidate,
  });
}

export function useAssignDepartment() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, department }: { id: string; department: string }) =>
      userService.assignDepartment(id, department),
    onSuccess: invalidate,
  });
}

export type { CreateUserInput, EditUserInput };