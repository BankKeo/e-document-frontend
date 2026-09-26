import {
  MOCK_SUPPLIERS,
  MOCK_SUPPLIER_CATEGORIES,
  MOCK_SUPPLIER_COUNTRIES,
} from "./data";
import type { Supplier, SupplierDocument, SupplierStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let suppliers: Supplier[] = [...MOCK_SUPPLIERS];

let refCounter = 1008;

function nextRef(): string {
  return `SUP-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(supplier: Supplier): Supplier {
  return {
    ...supplier,
    contacts: [...supplier.contacts],
    documents: supplier.documents ? [...supplier.documents] : undefined,
  };
}

export const supplierService = {
  async listSuppliers(): Promise<Supplier[]> {
    await delay();
    return suppliers.map(shallow);
  },

  async getSupplier(id: string): Promise<Supplier> {
    await delay(200);
    const supplier = suppliers.find((entry) => entry.id === id);
    if (!supplier) throw new Error("Supplier not found.");
    return shallow(supplier);
  },

  // SUP-001 / SUP-003 — create / register
  async createSupplier(input: {
    name: string;
    country: string;
    categories: string[];
    taxId: string;
  }): Promise<Supplier> {
    await delay(450);
    const created: Supplier = {
      id: randomId("sup"),
      name: input.name.trim(),
      ref: nextRef(),
      categories: input.categories,
      status: "Submitted",
      country: input.country,
      taxId: input.taxId,
      owners: [],
      contacts: [],
      hazard: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
    };
    suppliers = [created, ...suppliers];
    return shallow(created);
  },

  // SUP-004 — approve / reject verification transition
  async setStatus(id: string, status: SupplierStatus): Promise<Supplier> {
    await delay(350);
    const index = suppliers.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Supplier not found.");
    const next: Supplier = {
      ...suppliers[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    suppliers = suppliers.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // SUP-005 — add documents
  async addDocument(
    id: string,
    document: Omit<SupplierDocument, "id">
  ): Promise<Supplier> {
    await delay(300);
    const index = suppliers.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Supplier not found.");
    const existing = suppliers[index];
    const next: Supplier = {
      ...existing,
      documents: [
        ...(existing.documents ?? []),
        { ...document, id: randomId("d") },
      ],
      updatedAt: new Date().toISOString(),
    };
    suppliers = suppliers.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_SUPPLIER_CATEGORIES];
  },

  async listCountries(): Promise<string[]> {
    await delay(80);
    return [...MOCK_SUPPLIER_COUNTRIES];
  },
};
