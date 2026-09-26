import { MOCK_ITEM_CATEGORIES, MOCK_ITEMS } from "./data";
import type { InventoryItem, StockMovement } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let items: InventoryItem[] = [...MOCK_ITEMS];

let skuCounter = 1009;

function nextSku(): string {
  return `SKU-${(skuCounter++).toString().padStart(3, "0")}`;
}

const CURRENT_ACTOR = "Malinee Vongkham";

function shallow(item: InventoryItem): InventoryItem {
  return { ...item, movements: [...item.movements] };
}

export const inventoryService = {
  async listItems(): Promise<InventoryItem[]> {
    await delay();
    return items.map(shallow);
  },

  async getItem(id: string): Promise<InventoryItem> {
    await delay(200);
    const item = items.find((entry) => entry.id === id);
    if (!item) throw new Error("Item not found.");
    return shallow(item);
  },

  // ITEM-001 — create
  async createItem(input: {
    name: string;
    category: string;
    unit: string;
    brand?: string;
    model?: string;
    minStock: number;
    maxStock: number;
    reorderPoint: number;
  }): Promise<InventoryItem> {
    await delay(450);
    const created: InventoryItem = {
      id: randomId("item"),
      sku: nextSku(),
      name: input.name.trim(),
      category: input.category,
      unit: input.unit,
      brand: input.brand ?? "",
      model: input.model ?? "",
      barcode: `8851${Math.floor(Math.random() * 900_000_000 + 100_000_000)}`,
      itemStatus: "Active",
      minStock: input.minStock,
      maxStock: input.maxStock,
      reorderPoint: input.reorderPoint,
      currentStock: 0,
      reservedStock: 0,
      location: "Unassigned",
      updatedAt: new Date().toISOString(),
      movements: [],
    };
    items = [created, ...items];
    return shallow(created);
  },

  // STOCK-004 — adjust
  async adjustStock(
    id: string,
    quantity: number,
    reason: string
  ): Promise<InventoryItem> {
    await delay(350);
    const index = items.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Item not found.");
    const existing = items[index];
    const movement: StockMovement = {
      id: randomId("mv"),
      at: new Date().toISOString(),
      type: "ADJUSTMENT",
      quantity,
      reference: `ADJ-${reason.slice(0, 4).toUpperCase()}`,
      actor: CURRENT_ACTOR,
    };
    const next: InventoryItem = {
      ...existing,
      currentStock: Math.max(0, existing.currentStock + quantity),
      updatedAt: new Date().toISOString(),
      movements: [movement, ...existing.movements],
    };
    items = items.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // STOCK-005 — reserve / STOCK-006 — release
  async setReserved(id: string, reservedStock: number): Promise<InventoryItem> {
    await delay(250);
    const index = items.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Item not found.");
    const existing = items[index];
    const next: InventoryItem = {
      ...existing,
      reservedStock: Math.max(
        0,
        Math.min(reservedStock, existing.currentStock)
      ),
      updatedAt: new Date().toISOString(),
    };
    items = items.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async setItemStatus(
    id: string,
    itemStatus: InventoryItem["itemStatus"]
  ): Promise<InventoryItem> {
    await delay(250);
    const index = items.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Item not found.");
    const next: InventoryItem = {
      ...items[index],
      itemStatus,
      updatedAt: new Date().toISOString(),
    };
    items = items.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_ITEM_CATEGORIES];
  },
};
