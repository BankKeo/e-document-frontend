export type DeliveryStatus =
  | "Scheduled"
  | "Shipped"
  | "Partially Received"
  | "Received"
  | "Confirmed"
  | "Delayed";

export interface DeliveryLine {
  id: string;
  item: string;
  expectedQty: number;
  receivedQty: number;
  rejectedQty: number;
  unit: string;
}

export interface Delivery {
  id: string;
  ref: string;
  purchaseOrderRef: string;
  supplier: string;
  scheduledDate: string;
  shippedDate?: string;
  receivedAt?: string;
  status: DeliveryStatus;
  note: string;
  lines: DeliveryLine[];
  createdBy: string;
  createdAt: string;
}
