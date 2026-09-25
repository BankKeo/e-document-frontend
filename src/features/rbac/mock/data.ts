import { MOCK_USERS } from "@/features/users/mock/data";
import type {
  DataAccessSetting,
  DataLevel,
  DepartmentScope,
  Permission,
  PermissionModule,
  Role,
  RolePermissionAssignment,
  UserRoleAssignment,
} from "../types";

export const MOCK_ROLES: Role[] = [
  { id: "role_admin", name: "Admin", code: "ADMIN", description: "Unrestricted access to all modules and settings.", builtIn: true, userCount: 2 },
  { id: "role_approver", name: "Approver", code: "APPROVER", description: "Reviews and approves documents, requisitions, and adjustments.", builtIn: true, userCount: 3 },
  { id: "role_editor", name: "Editor", code: "EDITOR", description: "Creates and edits documents and forms.", builtIn: true, userCount: 4 },
  { id: "role_viewer", name: "Viewer", code: "VIEWER", description: "Read-only access to shared documents.", builtIn: true, userCount: 3 },
  { id: "role_proc", name: "Procurement Officer", code: "PROC_OFFICER", description: "Manages requisitions, tenders, and contracts.", builtIn: false, userCount: 2 },
  { id: "role_wh", name: "Warehouse Manager", code: "WH_MANAGER", description: "Manages inventory, receiving, and dispatch.", builtIn: false, userCount: 2 },
];

export const MOCK_PERMISSIONS: Permission[] = [
  { id: "dms.view", label: "View documents", module: "DMS", description: "Read and search documents.", enabled: true },
  { id: "dms.create", label: "Create documents", module: "DMS", description: "Upload and draft new documents.", enabled: true },
  { id: "dms.edit", label: "Edit documents", module: "DMS", description: "Modify existing documents.", enabled: true },
  { id: "dms.approve", label: "Approve documents", module: "DMS", description: "Approve or reject submissions.", enabled: true },
  { id: "dms.delete", label: "Delete documents", module: "DMS", description: "Remove documents (soft delete).", enabled: true },
  { id: "proc.view", label: "View procurement", module: "Procurement", description: "Read requisitions, tenders, and contracts.", enabled: true },
  { id: "proc.requisition", label: "Manage requisitions", module: "Procurement", description: "Create and edit purchase requisitions.", enabled: true },
  { id: "proc.tenders", label: "Manage tenders", module: "Procurement", description: "Create, publish, and evaluate tenders.", enabled: true },
  { id: "proc.contracts", label: "Manage contracts", module: "Procurement", description: "Create and amend contracts.", enabled: true },
  { id: "proc.approve", label: "Approve procurement", module: "Procurement", description: "Approve requisitions, orders, and contracts.", enabled: true },
  { id: "wh.view", label: "View inventory", module: "Warehouse", description: "Read stock levels and movements.", enabled: true },
  { id: "wh.inventory", label: "Manage inventory", module: "Warehouse", description: "Create items and manage stock levels.", enabled: true },
  { id: "wh.adjust", label: "Stock adjustments", module: "Warehouse", description: "Post and approve adjustments.", enabled: true },
  { id: "wh.transfer", label: "Stock transfers", module: "Warehouse", description: "Transfer stock between warehouses.", enabled: true },
  { id: "admin.users", label: "Manage users", module: "Administration", description: "Create and manage user accounts.", enabled: true },
  { id: "admin.roles", label: "Manage roles & access", module: "Administration", description: "Configure roles, permissions, and data access.", enabled: true },
  { id: "admin.org", label: "Manage organization", module: "Administration", description: "Maintain organization structure and settings.", enabled: true },
  { id: "admin.audit", label: "View audit logs", module: "Administration", description: "Review platform audit trails.", enabled: true },
];

export const MOCK_ROLE_PERMISSIONS: RolePermissionAssignment[] = [
  { roleId: "role_admin", permissionIds: MOCK_PERMISSIONS.map((permission) => permission.id) },
  { roleId: "role_approver", permissionIds: ["dms.view", "dms.approve", "proc.view", "proc.approve", "wh.view", "wh.adjust"] },
  { roleId: "role_editor", permissionIds: ["dms.view", "dms.create", "dms.edit", "proc.view"] },
  { roleId: "role_viewer", permissionIds: ["dms.view", "proc.view", "wh.view"] },
  { roleId: "role_proc", permissionIds: ["proc.view", "proc.requisition", "proc.tenders", "proc.contracts"] },
  { roleId: "role_wh", permissionIds: ["wh.view", "wh.inventory", "wh.adjust", "wh.transfer"] },
];

export const MOCK_DEPARTMENT_SCOPES: DepartmentScope[] = [
  { roleId: "role_admin", allDepartments: true, departmentIds: [] },
  { roleId: "role_approver", allDepartments: false, departmentIds: ["dept_finance", "dept_proc", "dept_warehouse"] },
  { roleId: "role_editor", allDepartments: true, departmentIds: [] },
  { roleId: "role_viewer", allDepartments: true, departmentIds: [] },
  { roleId: "role_proc", allDepartments: false, departmentIds: ["dept_proc", "dept_warehouse"] },
  { roleId: "role_wh", allDepartments: false, departmentIds: ["dept_warehouse"] },
];

export const MOCK_DATA_ACCESS: DataAccessSetting[] = [
  { roleId: "role_admin", level: "Full", sensitiveDocuments: true },
  { roleId: "role_approver", level: "Department", sensitiveDocuments: true },
  { roleId: "role_editor", level: "Own", sensitiveDocuments: false },
  { roleId: "role_viewer", level: "Department", sensitiveDocuments: false },
  { roleId: "role_proc", level: "Department", sensitiveDocuments: false },
  { roleId: "role_wh", level: "Department", sensitiveDocuments: false },
];

// userIds mirror the user-management mock so role assignment is consistent.
export const MOCK_USER_ROLES: UserRoleAssignment[] = [
  { userId: "usr_01", roleIds: ["role_admin"] },
  { userId: "usr_02", roleIds: ["role_proc", "role_editor"] },
  { userId: "usr_03", roleIds: ["role_approver"] },
  { userId: "usr_04", roleIds: ["role_wh"] },
  { userId: "usr_05", roleIds: ["role_viewer"] },
  { userId: "usr_06", roleIds: ["role_editor"] },
  { userId: "usr_07", roleIds: ["role_editor", "role_approver"] },
  { userId: "usr_08", roleIds: ["role_admin", "role_editor"] },
  { userId: "usr_09", roleIds: ["role_wh", "role_viewer"] },
  { userId: "usr_10", roleIds: ["role_viewer"] },
  { userId: "usr_11", roleIds: ["role_proc", "role_editor"] },
  { userId: "usr_12", roleIds: ["role_viewer"] },
];

export const DATA_LEVELS: Array<{ value: DataLevel; description: string }> = [
  { value: "Full", description: "See all data across the organization." },
  { value: "Department", description: "See data for assigned departments only." },
  { value: "Own", description: "See only records you created or own." },
  { value: "None", description: "No data visibility; useful for roles that only manage settings." },
];

export const PERMISSION_MODULES: PermissionModule[] = [
  "DMS",
  "Procurement",
  "Warehouse",
  "Administration",
];

export { MOCK_USERS };