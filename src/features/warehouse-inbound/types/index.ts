export type InboundStatus =
  "Scheduled" | "Arrived" | "Inspected" | "Put-away" | "Received" | "Rejected";

export interface InboundLine {
  id: string;
  itemName: string;
  sku: string;
  expected: number;
  received: number;
  rejected: number;
  unit: string;
}

export interface InboundOrder {
  id: string;
  ref: string;
  purchaseOrderRef: string;
  supplier: string;
  scheduledAt: string;
  arrivedAt?: string;
  status: InboundStatus;
  warehouse: string;
  lines: InboundLine[];
  note: string;
  createdBy: string;
}

export function inboundCompleted(order: InboundOrder): boolean {
  return order.lines.every(
    (line) => line.received + line.rejected >= line.expected
  );
}
