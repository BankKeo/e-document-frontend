import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rbacService } from "../mock/service";
import type { RoleInput } from "../schemas/rbac.schemas";
import type { DataLevel, DepartmentScope } from "../types";

export const rbacKeys = {
  all: ["rbac"] as const,
  roles: () => [...rbacKeys.all, "roles"] as const,
  permissions: () => [...rbacKeys.all, "permissions"] as const,
  rolePermissions: (roleId: string) => [...rbacKeys.all, "role-permissions", roleId] as const,
  departmentScope: (roleId: string) => [...rbacKeys.all, "department-scope", roleId] as const,
  dataAccess: (roleId: string) => [...rbacKeys.all, "data-access", roleId] as const,
  users: () => [...rbacKeys.all, "users"] as const,
  userRoles: () => [...rbacKeys.all, "user-roles"] as const,
  departments: () => [...rbacKeys.all, "departments"] as const,
};

export function useRolesQuery() {
  return useQuery({
    queryKey: rbacKeys.roles(),
    queryFn: () => rbacService.listRoles(),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RoleInput) => rbacService.createRole(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rbacKeys.roles() }),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RoleInput }) =>
      rbacService.updateRole(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rbacKeys.roles() }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rbacService.deleteRole(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rbacKeys.roles() }),
  });
}

export function usePermissionsQuery() {
  return useQuery({
    queryKey: rbacKeys.permissions(),
    queryFn: () => rbacService.listPermissions(),
  });
}

export function useTogglePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      rbacService.togglePermission(id, enabled),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rbacKeys.permissions() }),
  });
}

export function useRolePermissions(roleId: string) {
  return useQuery({
    queryKey: rbacKeys.rolePermissions(roleId),
    queryFn: () => rbacService.listRolePermissions(roleId),
  });
}

export function useSaveRolePermissions(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (permissionIds: string[]) =>
      rbacService.saveRolePermissions(roleId, permissionIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: rbacKeys.rolePermissions(roleId) }),
  });
}

export function useDepartmentScope(roleId: string) {
  return useQuery({
    queryKey: rbacKeys.departmentScope(roleId),
    queryFn: () => rbacService.getDepartmentScope(roleId),
  });
}

export function useSaveDepartmentScope(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scope: Omit<DepartmentScope, "roleId">) =>
      rbacService.saveDepartmentScope(roleId, scope),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: rbacKeys.departmentScope(roleId) }),
  });
}

export function useDataAccess(roleId: string) {
  return useQuery({
    queryKey: rbacKeys.dataAccess(roleId),
    queryFn: () => rbacService.getDataAccess(roleId),
  });
}

export function useSaveDataAccess(roleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: { level: DataLevel; sensitiveDocuments: boolean }) =>
      rbacService.saveDataAccess(roleId, settings),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: rbacKeys.dataAccess(roleId) }),
  });
}

export function useRbacUsers() {
  return useQuery({
    queryKey: rbacKeys.users(),
    queryFn: () => rbacService.getUsers(),
  });
}

export function useUserRolesQuery() {
  return useQuery({
    queryKey: rbacKeys.userRoles(),
    queryFn: () => rbacService.listUserRoles(),
  });
}

export function useAssignUserRoles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      rbacService.assignUserRoles(userId, roleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rbacKeys.userRoles() });
      queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
    },
  });
}

export function useRbacDepartments() {
  return useQuery({
    queryKey: rbacKeys.departments(),
    queryFn: () => rbacService.listDepartments(),
    staleTime: Infinity,
  });
}