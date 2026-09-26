import { MOCK_DELIVERIES } from "./data";
import type { Delivery, DeliveryLine, DeliveryStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let deliveries: Delivery[] = [...MOCK_DELIVERIES];

let refCounter = 1006;

function nextRef(): string {
  return `DEL-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(delivery: Delivery): Delivery {
  return { ...delivery, lines: [...delivery.lines] };
}

export const deliveryService = {
  async listDeliveries(): Promise<Delivery[]> {
    await delay();
    return deliveries.map(shallow);
  },

  async getDelivery(id: string): Promise<Delivery> {
    await delay(200);
    const delivery = deliveries.find((entry) => entry.id === id);
    if (!delivery) throw new Error("Delivery not found.");
    return shallow(delivery);
  },

  // DEL-001 — create delivery schedule
  async createDelivery(input: {
    purchaseOrderRef: string;
    supplier: string;
    scheduledDate: string;
    note: string;
    lines: { item: string; expectedQty: number; unit: string }[];
  }): Promise<Delivery> {
    await delay(450);
    const created: Delivery = {
      id: randomId("del"),
      ref: nextRef(),
      purchaseOrderRef: input.purchaseOrderRef,
      supplier: input.supplier,
      scheduledDate: input.scheduledDate,
      status: "Scheduled",
      note: input.note,
      lines: input.lines.map((line) => ({
        ...line,
        receivedQty: 0,
        rejectedQty: 0,
        id: randomId("l"),
      })),
      createdBy: "Malina Phetxomphou",
      createdAt: new Date().toISOString(),
    };
    deliveries = [created, ...deliveries];
    return shallow(created);
  },

  // DEL-004 — mark shipped
  async markShipped(id: string): Promise<Delivery> {
    await delay(300);
    const index = deliveries.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Delivery not found.");
    const existing = deliveries[index];
    const next: Delivery = {
      ...existing,
      status: existing.status === "Shipped" ? "Scheduled" : "Shipped",
      shippedDate:
        existing.status === "Shipped" ? undefined : new Date().toISOString(),
    };
    deliveries = deliveries.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // DEL-006/007/008 — receive quantities (partial allowed)
  async receiveDelivery(
    id: string,
    received: Record<string, number>,
    rejected: Record<string, number>
  ): Promise<Delivery> {
    await delay(400);
    const index = deliveries.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Delivery not found.");
    const existing = deliveries[index];
    const lines: DeliveryLine[] = existing.lines.map((line) => ({
      ...line,
      receivedQty: received[line.id] ?? line.receivedQty,
      rejectedQty: rejected[line.id] ?? line.rejectedQty,
    }));
    const fullyReceived = lines.every(
      (line) => line.receivedQty + line.rejectedQty >= line.expectedQty
    );
    const anyReceived = lines.some(
      (line) => line.receivedQty > 0 || line.rejectedQty > 0
    );
    const next: Delivery = {
      ...existing,
      lines,
      receivedAt: new Date().toISOString(),
      status: fullyReceived
        ? "Received"
        : anyReceived
          ? "Partially Received"
          : existing.status,
    };
    deliveries = deliveries.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // DEL-010 — confirm (quality inspection passed)
  async confirmDelivery(id: string): Promise<Delivery> {
    await delay(300);
    const index = deliveries.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Delivery not found.");
    const existing = deliveries[index];
    const next: Delivery = { ...existing, status: "Confirmed" };
    deliveries = deliveries.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async setStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    await delay(300);
    const index = deliveries.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Delivery not found.");
    const existing = deliveries[index];
    const next: Delivery = { ...existing, status };
    deliveries = deliveries.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },
};
