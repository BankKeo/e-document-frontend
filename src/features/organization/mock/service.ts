import {
  MOCK_APPROVAL_RULES,
  MOCK_APPROVERS,
  MOCK_DEPARTMENTS,
  MOCK_DOCUMENT_TYPES,
  MOCK_EMPLOYEES,
  MOCK_ORG,
  MOCK_POSITIONS,
} from "./data";
import type {
  ApprovalRule,
  Department,
  Employee,
  Organization,
  Position,
} from "../types";
import type {
  ApprovalRuleInput,
  DepartmentInput,
  EmployeeInput,
  OrganizationInput,
  PositionInput,
} from "../schemas/organization.schemas";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// In-memory mock stores (reset on full reload — acceptable for a UI sandbox).
// Swap `organizationService` for real API calls later; the react-query layer
// in `api/organization.queries.ts` stays unchanged.
let organization = { ...MOCK_ORG };
let departments = [...MOCK_DEPARTMENTS];
let positions = [...MOCK_POSITIONS];
let employees = [...MOCK_EMPLOYEES];
let approvalRules = [...MOCK_APPROVAL_RULES];

function update<T extends { id: string }>(
  store: T[],
  id: string,
  patch: T
): T[] {
  return store.map((entry) => (entry.id === id ? patch : entry));
}

export const organizationService = {
  // ORG-001 — Organization
  async getOrganization(): Promise<Organization> {
    await delay();
    return { ...organization };
  },

  async updateOrganization(input: OrganizationInput): Promise<Organization> {
    await delay(400);
    organization = { ...organization, ...input };
    return { ...organization };
  },

  async getStats(): Promise<{
    departments: number;
    positions: number;
    employees: number;
    activeRules: number;
  }> {
    await delay(100);
    return {
      departments: departments.length,
      positions: positions.length,
      employees: employees.filter((entry) => entry.status === "Active").length,
      activeRules: approvalRules.filter((rule) => rule.enabled).length,
    };
  },

  // ORG-002 — Departments
  async listDepartments(): Promise<Department[]> {
    await delay();
    return [...departments];
  },

  async createDepartment(input: DepartmentInput): Promise<Department> {
    await delay();
    const created: Department = {
      id: randomId("dept"),
      name: input.name.trim(),
      code: input.code.trim(),
      parentId: input.parentId,
      managerId: input.managerId,
      description: input.description?.trim() ?? "",
      memberCount: 0,
    };
    departments = [...departments, created];
    return { ...created };
  },

  async updateDepartment(
    id: string,
    input: DepartmentInput
  ): Promise<Department> {
    await delay();
    const existing = departments.find((entry) => entry.id === id);
    if (!existing) throw new Error("Department not found.");
    const next: Department = {
      ...existing,
      name: input.name.trim(),
      code: input.code.trim(),
      parentId: input.parentId,
      managerId: input.managerId,
      description: input.description?.trim() ?? "",
    };
    departments = update(departments, id, next);
    return { ...next };
  },

  async deleteDepartment(id: string): Promise<void> {
    await delay();
    departments = departments.filter((entry) => entry.id !== id);
  },

  // ORG-003 — Positions
  async listPositions(): Promise<Position[]> {
    await delay();
    return [...positions];
  },

  async createPosition(input: PositionInput): Promise<Position> {
    await delay();
    const created: Position = {
      id: randomId("pos"),
      title: input.title.trim(),
      departmentId: input.departmentId,
      grade: input.grade.trim(),
      description: input.description?.trim() ?? "",
    };
    positions = [...positions, created];
    return { ...created };
  },

  async updatePosition(id: string, input: PositionInput): Promise<Position> {
    await delay();
    const existing = positions.find((entry) => entry.id === id);
    if (!existing) throw new Error("Position not found.");
    const next: Position = {
      ...existing,
      title: input.title.trim(),
      departmentId: input.departmentId,
      grade: input.grade.trim(),
      description: input.description?.trim() ?? "",
    };
    positions = update(positions, id, next);
    return { ...next };
  },

  async deletePosition(id: string): Promise<void> {
    await delay();
    positions = positions.filter((entry) => entry.id !== id);
  },

  // ORG-004 — Employees
  async listEmployees(): Promise<Employee[]> {
    await delay();
    return [...employees];
  },

  async createEmployee(input: EmployeeInput): Promise<Employee> {
    await delay();
    const created: Employee = {
      id: randomId("emp"),
      employeeCode: input.employeeCode.trim(),
      name: input.name.trim(),
      email: input.email.trim(),
      departmentId: input.departmentId,
      positionId: input.positionId,
      managerId: input.managerId,
      employmentType: input.employmentType,
      status: "Active",
      joinedAt: input.joinedAt,
      phone: input.phone?.trim() || undefined,
    };
    employees = [...employees, created];
    return { ...created };
  },

  async updateEmployee(id: string, input: EmployeeInput): Promise<Employee> {
    await delay();
    const existing = employees.find((entry) => entry.id === id);
    if (!existing) throw new Error("Employee not found.");
    const next: Employee = {
      ...existing,
      employeeCode: input.employeeCode.trim(),
      name: input.name.trim(),
      email: input.email.trim(),
      departmentId: input.departmentId,
      positionId: input.positionId,
      managerId: input.managerId,
      employmentType: input.employmentType,
      joinedAt: input.joinedAt,
      phone: input.phone?.trim() || undefined,
    };
    employees = update(employees, id, next);
    return { ...next };
  },

  async deleteEmployee(id: string): Promise<void> {
    await delay();
    employees = employees.filter((entry) => entry.id !== id);
  },

  // ORG-006 — Approval authority
  async listApprovalRules(): Promise<ApprovalRule[]> {
    await delay();
    return [...approvalRules];
  },

  async createApprovalRule(input: ApprovalRuleInput): Promise<ApprovalRule> {
    await delay();
    const created: ApprovalRule = {
      id: randomId("rule"),
      documentType: input.documentType,
      module: input.module,
      limitKind: input.limitKind,
      minAmount: input.minAmount,
      maxAmount: input.maxAmount,
      level: input.level,
      approver: input.approver,
      alternateApprover: input.alternateApprover,
      enabled: input.enabled,
    };
    approvalRules = [...approvalRules, created];
    return { ...created };
  },

  async updateApprovalRule(
    id: string,
    input: ApprovalRuleInput
  ): Promise<ApprovalRule> {
    await delay();
    const existing = approvalRules.find((entry) => entry.id === id);
    if (!existing) throw new Error("Approval rule not found.");
    const next: ApprovalRule = {
      ...existing,
      documentType: input.documentType,
      module: input.module,
      limitKind: input.limitKind,
      minAmount: input.minAmount,
      maxAmount: input.maxAmount,
      level: input.level,
      approver: input.approver,
      alternateApprover: input.alternateApprover,
      enabled: input.enabled,
    };
    approvalRules = update(approvalRules, id, next);
    return { ...next };
  },

  async deleteApprovalRule(id: string): Promise<void> {
    await delay();
    approvalRules = approvalRules.filter((entry) => entry.id !== id);
  },

  async toggleApprovalRule(id: string, enabled: boolean): Promise<void> {
    await delay(150);
    const existing = approvalRules.find((entry) => entry.id === id);
    if (existing) {
      approvalRules = update(approvalRules, id, { ...existing, enabled });
    }
  },

  async listDocumentTypes(): Promise<string[]> {
    await delay(80);
    return [...MOCK_DOCUMENT_TYPES];
  },

  async listApprovers(): Promise<string[]> {
    await delay(80);
    return [...MOCK_APPROVERS];
  },
};