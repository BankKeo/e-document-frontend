export interface Organization {
  id: string;
  name: string;
  code: string;
  sector: string;
  establishedYear: number;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  motto: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  managerId: string | null;
  description: string;
  memberCount: number;
}

export interface Position {
  id: string;
  title: string;
  departmentId: string;
  grade: string;
  description: string;
}

export type EmploymentStatus = "Active" | "On Leave" | "Terminated";
export type EmploymentType = "Permanent" | "Contract";

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  joinedAt: string;
  phone?: string;
}

export type ApprovalModule = "Procurement" | "DMS" | "Warehouse";
export type ApprovalLimitKind = "any" | "amount";

export interface ApprovalRule {
  id: string;
  documentType: string;
  module: ApprovalModule;
  limitKind: ApprovalLimitKind;
  minAmount?: number;
  maxAmount?: number;
  level: number;
  approver: string;
  alternateApprover: string;
  enabled: boolean;
}