export type TransferStatus = "Draft" | "In Transit" | "Completed" | "Cancelled";

export interface TransferLine {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  unit: string;
}

export interface StockTransfer {
  id: string;
  ref: string;
  fromWarehouse: string;
  toWarehouse: string;
  status: TransferStatus;
  requestedBy: string;
  lines: TransferLine[];
  createdAt: string;
  completedAt?: string;
}
