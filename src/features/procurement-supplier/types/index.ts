export type SupplierStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Verified"
  | "Approved"
  | "Active"
  | "Suspended"
  | "Blacklisted";

export interface SupplierContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface SupplierBankInfo {
  bank: string;
  accountName: string;
  accountNumber: string;
}

export interface SupplierDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface SupplierEvaluation {
  score: number;
  rating: string;
  lastEvaluated: string;
}

export interface Supplier {
  id: string;
  name: string;
  ref: string;
  categories: string[];
  status: SupplierStatus;
  country: string;
  taxId: string;
  owners: string[];
  contacts: SupplierContact[];
  bankInfo?: SupplierBankInfo;
  documents?: SupplierDocument[];
  evaluation?: SupplierEvaluation;
  hazard: number;
  createdAt: string;
  updatedAt: string;
}
