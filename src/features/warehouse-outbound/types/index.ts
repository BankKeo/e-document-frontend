export type OutboundStatus =
  "Requested" | "Approved" | "Picking" | "Packed" | "Issued" | "Delivered";

export interface OutboundLine {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  unit: string;
}

export interface OutboundIssue {
  id: string;
  ref: string;
  department: string;
  requester: string;
  status: OutboundStatus;
  warehouse: string;
  lines: OutboundLine[];
  requestedAt: string;
  issuedAt?: string;
  createdBy: string;
}
