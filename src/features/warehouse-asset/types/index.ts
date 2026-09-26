export type AssetStatus =
  "Assigned" | "Available" | "In Maintenance" | "Disposed";

export interface Asset {
  id: string;
  tag: string;
  name: string;
  category: string;
  location: string;
  custodian: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  depreciationRate: number;
  status: AssetStatus;
  maintenance?: { last: string; note: string }[];
  history?: { at: string; event: string; actor: string }[];
}

export type AssetCategory =
  | "Laptop"
  | "Printer"
  | "Vehicle"
  | "Server"
  | "Projector"
  | "Furniture"
  | "Tool";
