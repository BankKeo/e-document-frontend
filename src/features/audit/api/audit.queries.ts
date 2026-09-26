import { useQuery } from "@tanstack/react-query";
import { auditService } from "../mock/service";

export const auditKeys = {
  all: ["audit"] as const,
  login: () => [...auditKeys.all, "login"] as const,
  activity: () => [...auditKeys.all, "activity"] as const,
  documents: () => [...auditKeys.all, "documents"] as const,
  approvals: () => [...auditKeys.all, "approvals"] as const,
  procurement: () => [...auditKeys.all, "procurement"] as const,
  inventory: () => [...auditKeys.all, "inventory"] as const,
  dataChanges: () => [...auditKeys.all, "data-changes"] as const,
};

export const useLoginEvents = () =>
  useQuery({ queryKey: auditKeys.login(), queryFn: () => auditService.listLoginEvents() });

export const useActivityEvents = () =>
  useQuery({ queryKey: auditKeys.activity(), queryFn: () => auditService.listActivityEvents() });

export const useDocumentEvents = () =>
  useQuery({ queryKey: auditKeys.documents(), queryFn: () => auditService.listDocumentEvents() });

export const useApprovalEvents = () =>
  useQuery({ queryKey: auditKeys.approvals(), queryFn: () => auditService.listApprovalEvents() });

export const useProcurementEvents = () =>
  useQuery({ queryKey: auditKeys.procurement(), queryFn: () => auditService.listProcurementEvents() });

export const useInventoryEvents = () =>
  useQuery({ queryKey: auditKeys.inventory(), queryFn: () => auditService.listInventoryEvents() });

export const useDataChangeEvents = () =>
  useQuery({ queryKey: auditKeys.dataChanges(), queryFn: () => auditService.listDataChangeEvents() });