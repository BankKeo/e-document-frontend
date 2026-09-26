export type AuditStatus = "Success" | "Failed";
export type AuditDecision = "Approved" | "Rejected" | "Requested" | "Sent back";

export interface AuditEntryBase {
  id: string;
  at: string;
  actor: string;
  actorEmail: string;
  ip: string;
}

export interface LoginEvent extends AuditEntryBase {
  status: AuditStatus;
  method: "Password" | "MFA" | "SSO" | "Session";
  device: string;
  browser: string;
  os: string;
  location: string;
  reason: string;
}

export type ActivityModule = "DMS" | "Procurement" | "Warehouse" | "Administration" | "Auth";

export interface UserActivityEvent extends AuditEntryBase {
  module: ActivityModule;
  action: string;
  target: string;
  detail: string;
}

export type DocumentAction =
  | "Created"
  | "Edited"
  | "Viewed"
  | "Downloaded"
  | "Approved"
  | "Rejected"
  | "Deleted";

export interface DocumentHistoryEntry extends AuditEntryBase {
  document: string;
  documentRef: string;
  action: DocumentAction;
  version: string;
  summary: string;
}

export interface ApprovalEvent extends AuditEntryBase {
  documentType: string;
  documentRef: string;
  requester: string;
  decision: AuditDecision;
  level: number;
  comment: string;
}

export type ProcurementType = "Requisition" | "Tender" | "Contract" | "Order";

export interface ProcurementEvent extends AuditEntryBase {
  reference: string;
  type: ProcurementType;
  stage: string;
  detail: string;
}

export type InventoryTransactionType = "In" | "Out" | "Adjustment" | "Transfer";

export interface InventoryEntry extends AuditEntryBase {
  item: string;
  sku: string;
  warehouse: string;
  type: InventoryTransactionType;
  quantity: number;
  balanceAfter: number;
  reference: string;
}

export interface DataChangeEntry extends AuditEntryBase {
  entity: string;
  entityId: string;
  record: string;
  field: string;
  oldValue: string;
  newValue: string;
}