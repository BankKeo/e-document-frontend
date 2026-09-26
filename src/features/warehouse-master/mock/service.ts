import { MOCK_WAREHOUSES } from "./data";
import type { Warehouse } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let warehouses: Warehouse[] = [...MOCK_WAREHOUSES];

function shallow(warehouse: Warehouse): Warehouse {
  return {
    ...warehouse,
    zones: warehouse.zones.map((z) => ({
      ...z,
      racks: z.racks.map((r) => ({ ...r, shelves: [...r.shelves] })),
    })),
  };
}

export const warehouseService = {
  async listWarehouses(): Promise<Warehouse[]> {
    await delay();
    return warehouses.map(shallow);
  },

  async getWarehouse(id: string): Promise<Warehouse> {
    await delay(200);
    const warehouse = warehouses.find((entry) => entry.id === id);
    if (!warehouse) throw new Error("Warehouse not found.");
    return shallow(warehouse);
  },

  // WH-001 — create
  async createWarehouse(input: {
    name: string;
    location: string;
    capacity: number;
    staff: number;
  }): Promise<Warehouse> {
    await delay(450);
    const created: Warehouse = {
      id: randomId("wh"),
      name: input.name.trim(),
      code: `WH-${input.name.slice(0, 3).toUpperCase()}-01`,
      location: input.location,
      capacity: input.capacity,
      used: 0,
      staff: input.staff,
      zones: [],
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    warehouses = [created, ...warehouses];
    return shallow(created);
  },

  async setStaff(id: string, staff: number): Promise<Warehouse> {
    await delay(250);
    const index = warehouses.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Warehouse not found.");
    const next: Warehouse = {
      ...warehouses[index],
      staff,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    warehouses = warehouses.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },
};
