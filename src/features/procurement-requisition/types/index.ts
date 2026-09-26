export type PrStatus =
  | "Draft"
  | "Submitted"
  | "Department Approval"
  | "Budget Approval"
  | "Approved"
  | "Rejected"
  | "Returned"
  | "Cancelled";

export interface PrItem {
  id: string;
  description: string;
  spec: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  requiredDate: string;
}

export interface PrHistoryEntry {
  id: string;
  at: string;
  action: string;
  actor: string;
}

export interface PurchaseRequisition {
  id: string;
  ref: string;
  title: string;
  department: string;
  category: string;
  requester: string;
  status: PrStatus;
  items: PrItem[];
  total: number;
  documents: { id: string; name: string; size: number }[];
  history: PrHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
