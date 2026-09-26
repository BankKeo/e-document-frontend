import { MOCK_INBOUND_ORDERS } from "./data";
import type { InboundOrder, InboundLine } from "../types";
import { inboundCompleted } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let orders: InboundOrder[] = [...MOCK_INBOUND_ORDERS];

let refCounter = 1005;

function nextRef(): string {
  return `IN-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(order: InboundOrder): InboundOrder {
  return { ...order, lines: [...order.lines] };
}

export const inboundService = {
  async listInbound(): Promise<InboundOrder[]> {
    await delay();
    return orders.map(shallow);
  },

  async getInbound(id: string): Promise<InboundOrder> {
    await delay(200);
    const order = orders.find((entry) => entry.id === id);
    if (!order) throw new Error("Inbound order not found.");
    return shallow(order);
  },

  // IN-001 — receiving order from purchase order
  async createInbound(input: {
    purchaseOrderRef: string;
    supplier: string;
    warehouse: string;
    note: string;
    lines: { itemName: string; sku: string; expected: number; unit: string }[];
  }): Promise<InboundOrder> {
    await delay(450);
    const created: InboundOrder = {
      id: randomId("in"),
      ref: nextRef(),
      purchaseOrderRef: input.purchaseOrderRef,
      supplier: input.supplier,
      scheduledAt: new Date(Date.now() + 2 * 86_400_000)
        .toISOString()
        .slice(0, 10),
      status: "Scheduled",
      warehouse: input.warehouse,
      lines: input.lines.map((line) => ({
        ...line,
        received: 0,
        rejected: 0,
        id: randomId("l"),
      })),
      note: input.note,
      createdBy: "Malinee Vongkham",
    };
    orders = [created, ...orders];
    return shallow(created);
  },

  // IN-003 — receive goods with barcode scan / quantity verification (IN-004/005)
  async receiveGoods(
    id: string,
    received: Record<string, number>,
    rejected: Record<string, number>
  ): Promise<InboundOrder> {
    await delay(400);
    const index = orders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Inbound order not found.");
    const existing = orders[index];
    const lines: InboundLine[] = existing.lines.map((line) => ({
      ...line,
      received: received[line.id] ?? line.received,
      rejected: rejected[line.id] ?? line.rejected,
    }));
    const complete = inboundCompleted({ ...existing, lines });
    const next: InboundOrder = {
      ...existing,
      lines,
      status: complete ? "Received" : "Received",
    };
    orders = orders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // IN-002 — confirm arrival
  async markArrived(id: string): Promise<InboundOrder> {
    await delay(250);
    const index = orders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Inbound order not found.");
    const existing = orders[index];
    const next: InboundOrder = {
      ...existing,
      status: existing.status === "Scheduled" ? "Arrived" : "Scheduled",
      arrivedAt:
        existing.status === "Scheduled" ? new Date().toISOString() : undefined,
    };
    orders = orders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // IN-009 — put-away completes the flow
  async putAway(id: string): Promise<InboundOrder> {
    await delay(300);
    const index = orders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Inbound order not found.");
    const existing = orders[index];
    const next: InboundOrder = { ...existing, status: "Put-away" };
    orders = orders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listItems(): Promise<
    { itemName: string; sku: string; unit: string }[]
  > {
    await delay(80);
    return [
      { itemName: "Paper A4 80gsm", sku: "SKU-001", unit: "ream" },
      { itemName: "Ink Toner HP 63", sku: "SKU-002", unit: "unit" },
      { itemName: "Asphalt Mix AC-20", sku: "SKU-004", unit: "ton" },
      { itemName: "General Purpose Cleaner", sku: "SKU-006", unit: "litre" },
    ];
  },
};

export const INBOUND_WAREHOUSES = [
  "Central Warehouse — Vientiane",
  "Secondary Warehouse — Savannakhet",
];
