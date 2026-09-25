import {
  MOCK_DATA_ACCESS,
  MOCK_DEPARTMENT_SCOPES,
  MOCK_PERMISSIONS,
  MOCK_ROLE_PERMISSIONS,
  MOCK_ROLES,
  MOCK_USER_ROLES,
  MOCK_USERS,
} from "./data";
import type { RoleInput } from "../schemas/rbac.schemas";
import type {
  DataAccessSetting,
  DataLevel,
  DepartmentScope,
  Permission,
  Role,
  UserRoleAssignment,
} from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// In-memory mock stores (reset on full reload — acceptable for a UI sandbox).
// Swap `rbacService` for real API calls later; the react-query layer in
// `api/rbac.queries.ts` stays unchanged.
let roles = [...MOCK_ROLES];
let permissions = [...MOCK_PERMISSIONS];
const rolePermissions = [...MOCK_ROLE_PERMISSIONS].map((entry) => ({ ...entry, permissionIds: [...entry.permissionIds] }));
const departmentScopes = [...MOCK_DEPARTMENT_SCOPES];
const dataAccess = [...MOCK_DATA_ACCESS];
const userRoles = [...MOCK_USER_ROLES].map((entry) => ({ ...entry, roleIds: [...entry.roleIds] }));

function upsertById<T extends { roleId: string }>(store: T[], entry: T): void {
  const index = store.findIndex((item) => item.roleId === entry.roleId);
  if (index >= 0) store[index] = entry;
  else store.push(entry);
}

export const rbacService = {
  // RBAC-001 — Roles
  async listRoles(): Promise<Role[]> {
    await delay();
    return [...roles];
  },

  async getUserCount(roleId: string): Promise<number> {
    await delay(80);
    return userRoles.filter((entry) => entry.roleIds.includes(roleId)).length;
  },

  async createRole(input: RoleInput): Promise<Role> {
    await delay();
    const created: Role = {
      id: randomId("role"),
      name: input.name.trim(),
      code: input.code.trim(),
      description: input.description?.trim() ?? "",
      builtIn: false,
      userCount: 0,
    };
    roles = [...roles, created];
    rolePermissions.push({ roleId: created.id, permissionIds: [] });
    departmentScopes.push({ roleId: created.id, allDepartments: true, departmentIds: [] });
    dataAccess.push({ roleId: created.id, level: "Own", sensitiveDocuments: false });
    return { ...created };
  },

  async updateRole(id: string, input: RoleInput): Promise<Role> {
    await delay();
    const existing = roles.find((entry) => entry.id === id);
    if (!existing) throw new Error("Role not found.");
    const next: Role = {
      ...existing,
      name: input.name.trim(),
      code: input.code.trim(),
      description: input.description?.trim() ?? "",
    };
    roles = roles.map((entry) => (entry.id === id ? next : entry));
    return { ...next };
  },

  async deleteRole(id: string): Promise<void> {
    await delay();
    const target = roles.find((entry) => entry.id === id);
    if (target?.builtIn) throw new Error("Built-in roles cannot be deleted.");
    roles = roles.filter((entry) => entry.id !== id);
  },

  // RBAC-002 — Permissions
  async listPermissions(): Promise<Permission[]> {
    await delay();
    return [...permissions];
  },

  async togglePermission(id: string, enabled: boolean): Promise<void> {
    await delay(120);
    permissions = permissions.map((permission) =>
      permission.id === id ? { ...permission, enabled } : permission
    );
  },

  // RBAC-003 — Role-permission assignment
  async listRolePermissions(roleId: string): Promise<string[]> {
    await delay(120);
    return [...(rolePermissions.find((entry) => entry.roleId === roleId)?.permissionIds ?? [])];
  },

  async saveRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await delay(400);
    upsertById(rolePermissions, { roleId, permissionIds: [...permissionIds] });
  },

  // RBAC-005 — Department access
  async getDepartmentScope(roleId: string): Promise<DepartmentScope> {
    await delay(120);
    return {
      ...(departmentScopes.find((entry) => entry.roleId === roleId) ?? {
        roleId,
        allDepartments: true,
        departmentIds: [],
      }),
    };
  },

  async saveDepartmentScope(roleId: string, scope: Omit<DepartmentScope, "roleId">): Promise<void> {
    await delay(400);
    upsertById(departmentScopes, { roleId, ...scope });
  },

  async listDepartments(): Promise<Array<{ id: string; name: string }>> {
    await delay(120);
    return [
      { id: "dept_exec", name: "Executive Office" },
      { id: "dept_finance", name: "Finance" },
      { id: "dept_proc", name: "Procurement" },
      { id: "dept_warehouse", name: "Warehouse & Inventory" },
      { id: "dept_hr", name: "Human Resources" },
      { id: "dept_it", name: "IT" },
      { id: "dept_legal", name: "Legal" },
    ];
  },

  // RBAC-006 — Data-level access
  async getDataAccess(roleId: string): Promise<DataAccessSetting> {
    await delay(120);
    return {
      ...(dataAccess.find((entry) => entry.roleId === roleId) ?? {
        roleId,
        level: "Own" as DataLevel,
        sensitiveDocuments: false,
      }),
    };
  },

  async saveDataAccess(roleId: string, settings: Omit<DataAccessSetting, "roleId">): Promise<void> {
    await delay(400);
    upsertById(dataAccess, { roleId, ...settings });
  },

  // RBAC-004 — User-role assignment
  async listUserRoles(): Promise<UserRoleAssignment[]> {
    await delay();
    return userRoles.map((entry) => ({ ...entry, roleIds: [...entry.roleIds] }));
  },

  async getUsers(): Promise<Array<{ id: string; name: string; email: string }>> {
    await delay(150);
    return MOCK_USERS.map((entry) => ({ id: entry.id, name: entry.name, email: entry.email }));
  },

  async assignUserRoles(userId: string, roleIds: string[]): Promise<void> {
    await delay(400);
    const index = userRoles.findIndex((entry) => entry.userId === userId);
    if (index >= 0) {
      userRoles[index] = { userId, roleIds: [...roleIds] };
    } else {
      userRoles.push({ userId, roleIds: [...roleIds] });
    }
    const countByRole = new Map<string, number>();
    for (const entry of userRoles) {
      for (const roleId of new Set(entry.roleIds)) {
        countByRole.set(roleId, (countByRole.get(roleId) ?? 0) + 1);
      }
    }
    roles = roles.map((role) => ({ ...role, userCount: countByRole.get(role.id) ?? 0 }));
  },
};