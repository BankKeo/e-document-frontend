import {
  MOCK_ACTIVITY_EVENTS,
  MOCK_APPROVAL_EVENTS,
  MOCK_DATA_CHANGE_EVENTS,
  MOCK_DOCUMENT_EVENTS,
  MOCK_INVENTORY_EVENTS,
  MOCK_LOGIN_EVENTS,
  MOCK_PROCUREMENT_EVENTS,
} from "./data";
import type {
  ApprovalEvent,
  DataChangeEntry,
  DocumentHistoryEntry,
  InventoryEntry,
  LoginEvent,
  ProcurementEvent,
  UserActivityEvent,
} from "../types";

export type AuditKind =
  | "login"
  | "activity"
  | "documents"
  | "approvals"
  | "procurement"
  | "inventory"
  | "data-changes";

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const STORES: Record<AuditKind, unknown[]> = {
  login: MOCK_LOGIN_EVENTS,
  activity: MOCK_ACTIVITY_EVENTS,
  documents: MOCK_DOCUMENT_EVENTS,
  approvals: MOCK_APPROVAL_EVENTS,
  procurement: MOCK_PROCUREMENT_EVENTS,
  inventory: MOCK_INVENTORY_EVENTS,
  "data-changes": MOCK_DATA_CHANGE_EVENTS,
};

export const auditService = {
  // Single mock seam; each page consumes a typed view.
  async listLoginEvents(): Promise<LoginEvent[]> {
    await delay();
    return [...(STORES.login as LoginEvent[])];
  },
  async listActivityEvents(): Promise<UserActivityEvent[]> {
    await delay();
    return [...(STORES.activity as UserActivityEvent[])];
  },
  async listDocumentEvents(): Promise<DocumentHistoryEntry[]> {
    await delay();
    return [...(STORES.documents as DocumentHistoryEntry[])];
  },
  async listApprovalEvents(): Promise<ApprovalEvent[]> {
    await delay();
    return [...(STORES.approvals as ApprovalEvent[])];
  },
  async listProcurementEvents(): Promise<ProcurementEvent[]> {
    await delay();
    return [...(STORES.procurement as ProcurementEvent[])];
  },
  async listInventoryEvents(): Promise<InventoryEntry[]> {
    await delay();
    return [...(STORES.inventory as InventoryEntry[])];
  },
  async listDataChangeEvents(): Promise<DataChangeEntry[]> {
    await delay();
    return [...(STORES["data-changes"] as DataChangeEntry[])];
  },
};