export type ItemStatus = "Active" | "Inactive" | "Discontinued";

export interface StockMovement {
  id: string;
  at: string;
  type: "INBOUND" | "OUTBOUND" | "TRANSFER" | "ADJUSTMENT";
  quantity: number;
  reference: string;
  actor: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  brand: string;
  model: string;
  barcode: string;
  itemStatus: ItemStatus;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  currentStock: number;
  reservedStock: number;
  location: string;
  updatedAt: string;
  movements: StockMovement[];
}
