import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().trim().min(2, "Organization name is required.").max(120),
  code: z.string().trim().min(2, "Code is required.").max(20),
  sector: z.string().trim().min(2, "Sector is required."),
  establishedYear: z.coerce
    .number()
    .int()
    .min(1900, "Enter a valid year.")
    .max(2100, "Enter a valid year."),
  address: z.string().trim().min(5, "Address is required."),
  phone: z.string().trim().min(5, "Phone is required."),
  email: z.string().trim().email("Enter a valid email address."),
  taxId: z.string().trim().min(3, "Tax ID is required."),
  motto: z.string().trim().max(200).optional(),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;

export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Department name is required.").max(80),
  code: z.string().trim().min(2, "Code is required.").max(20),
  parentId: z.string().nullable(),
  managerId: z.string().nullable(),
  description: z.string().trim().max(200).optional(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

export const positionSchema = z.object({
  title: z.string().trim().min(2, "Position title is required.").max(80),
  departmentId: z.string().min(1, "Select a department."),
  grade: z.string().trim().min(1, "Grade is required."),
  description: z.string().trim().max(200).optional(),
});

export type PositionInput = z.infer<typeof positionSchema>;

export const employeeSchema = z.object({
  employeeCode: z.string().trim().min(2, "Employee code is required."),
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  departmentId: z.string().min(1, "Select a department."),
  positionId: z.string().min(1, "Select a position."),
  managerId: z.string().nullable(),
  employmentType: z.enum(["Permanent", "Contract"]),
  joinedAt: z.string().min(1, "Joining date is required."),
  phone: z.string().trim().optional(),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;

export const approvalRuleSchema = z.object({
  documentType: z.string().min(1, "Select a document type."),
  module: z.enum(["Procurement", "DMS", "Warehouse"]),
  limitKind: z.enum(["any", "amount"]),
  minAmount: z.coerce.number().int().min(0).optional(),
  maxAmount: z.coerce.number().int().min(0).optional(),
  level: z.coerce.number().int().min(1).max(5),
  approver: z.string().min(1, "Select an approver."),
  alternateApprover: z.string().min(1, "Select an alternate approver."),
  enabled: z.boolean(),
}).refine(
  (value) => {
    if (value.limitKind === "any") return true;
    const min = value.minAmount ?? 0;
    const max = value.maxAmount;
    return max === undefined || max > min;
  },
  {
    message: "Maximum amount must be greater than the minimum.",
    path: ["maxAmount"],
  }
);

export type ApprovalRuleInput = z.infer<typeof approvalRuleSchema>;