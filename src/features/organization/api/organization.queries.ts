import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { organizationService } from "../mock/service";
import type {
  ApprovalRuleInput,
  DepartmentInput,
  EmployeeInput,
  OrganizationInput,
  PositionInput,
} from "../schemas/organization.schemas";

export const orgKeys = {
  all: ["organization"] as const,
  org: () => [...orgKeys.all, "org"] as const,
  stats: () => [...orgKeys.all, "stats"] as const,
  departments: () => [...orgKeys.all, "departments"] as const,
  positions: () => [...orgKeys.all, "positions"] as const,
  employees: () => [...orgKeys.all, "employees"] as const,
  rules: () => [...orgKeys.all, "approval-rules"] as const,
  documentTypes: () => [...orgKeys.all, "document-types"] as const,
  approvers: () => [...orgKeys.all, "approvers"] as const,
};

function useInvalidate(keys: () => readonly unknown[]) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: keys() });
  };
}

export function useOrganization() {
  return useQuery({
    queryKey: orgKeys.org(),
    queryFn: () => organizationService.getOrganization(),
  });
}

export function useOrgStats() {
  return useQuery({
    queryKey: orgKeys.stats(),
    queryFn: () => organizationService.getStats(),
  });
}

export function useUpdateOrganization() {
  const invalidate = useInvalidate(orgKeys.org);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (input: OrganizationInput) =>
      organizationService.updateOrganization(input),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: orgKeys.departments(),
    queryFn: () => organizationService.listDepartments(),
  });
}

export function useCreateDepartment() {
  const invalidate = useInvalidate(orgKeys.departments);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (input: DepartmentInput) => organizationService.createDepartment(input),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useUpdateDepartment() {
  const invalidate = useInvalidate(orgKeys.departments);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DepartmentInput }) =>
      organizationService.updateDepartment(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteDepartment() {
  const invalidate = useInvalidate(orgKeys.departments);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (id: string) => organizationService.deleteDepartment(id),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function usePositionsQuery() {
  return useQuery({
    queryKey: orgKeys.positions(),
    queryFn: () => organizationService.listPositions(),
  });
}

export function useCreatePosition() {
  const invalidate = useInvalidate(orgKeys.positions);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (input: PositionInput) => organizationService.createPosition(input),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useUpdatePosition() {
  const invalidate = useInvalidate(orgKeys.positions);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PositionInput }) =>
      organizationService.updatePosition(id, input),
    onSuccess: invalidate,
  });
}

export function useDeletePosition() {
  const invalidate = useInvalidate(orgKeys.positions);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (id: string) => organizationService.deletePosition(id),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useEmployeesQuery() {
  return useQuery({
    queryKey: orgKeys.employees(),
    queryFn: () => organizationService.listEmployees(),
  });
}

export function useCreateEmployee() {
  const invalidate = useInvalidate(orgKeys.employees);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (input: EmployeeInput) => organizationService.createEmployee(input),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useUpdateEmployee() {
  const invalidate = useInvalidate(orgKeys.employees);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EmployeeInput }) =>
      organizationService.updateEmployee(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteEmployee() {
  const invalidate = useInvalidate(orgKeys.employees);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (id: string) => organizationService.deleteEmployee(id),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useApprovalRulesQuery() {
  return useQuery({
    queryKey: orgKeys.rules(),
    queryFn: () => organizationService.listApprovalRules(),
  });
}

export function useCreateApprovalRule() {
  const invalidate = useInvalidate(orgKeys.rules);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (input: ApprovalRuleInput) => organizationService.createApprovalRule(input),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useUpdateApprovalRule() {
  const invalidate = useInvalidate(orgKeys.rules);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ApprovalRuleInput }) =>
      organizationService.updateApprovalRule(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteApprovalRule() {
  const invalidate = useInvalidate(orgKeys.rules);
  const invalidateStats = useInvalidate(orgKeys.stats);
  return useMutation({
    mutationFn: (id: string) => organizationService.deleteApprovalRule(id),
    onSuccess: () => {
      invalidate();
      invalidateStats();
    },
  });
}

export function useToggleApprovalRule() {
  const invalidate = useInvalidate(orgKeys.rules);
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      organizationService.toggleApprovalRule(id, enabled),
    onSuccess: invalidate,
  });
}

export function useDocumentTypes() {
  return useQuery({
    queryKey: orgKeys.documentTypes(),
    queryFn: () => organizationService.listDocumentTypes(),
    staleTime: Infinity,
  });
}

export function useApprovers() {
  return useQuery({
    queryKey: orgKeys.approvers(),
    queryFn: () => organizationService.listApprovers(),
    staleTime: Infinity,
  });
}