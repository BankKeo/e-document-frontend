export type PermissionModule =
  | "DMS"
  | "Procurement"
  | "Warehouse"
  | "Administration";

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  builtIn: boolean;
  userCount: number;
}

export interface Permission {
  id: string;
  label: string;
  module: PermissionModule;
  description: string;
  enabled: boolean;
}

export interface RolePermissionAssignment {
  roleId: string;
  permissionIds: string[];
}

export type DataLevel = "Full" | "Department" | "Own" | "None";

export interface DepartmentScope {
  roleId: string;
  allDepartments: boolean;
  departmentIds: string[];
}

export interface DataAccessSetting {
  roleId: string;
  level: DataLevel;
  sensitiveDocuments: boolean;
}

export interface UserRoleAssignment {
  userId: string;
  roleIds: string[];
}