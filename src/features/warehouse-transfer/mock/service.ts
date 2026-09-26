import { MOCK_TRANSFERS } from "./data";
import type { StockTransfer, TransferStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let transfers: StockTransfer[] = [...MOCK_TRANSFERS];

let refCounter = 1004;

function nextRef(): string {
  return `TRF-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(transfer: StockTransfer): StockTransfer {
  return { ...transfer, lines: [...transfer.lines] };
}

export const transferService = {
  async listTransfers(): Promise<StockTransfer[]> {
    await delay();
    return transfers.map(shallow);
  },

  // STOCK-003 — create transfer
  async createTransfer(input: {
    fromWarehouse: string;
    toWarehouse: string;
    lines: { itemName: string; sku: string; quantity: number; unit: string }[];
  }): Promise<StockTransfer> {
    await delay(450);
    const created: StockTransfer = {
      id: randomId("trf"),
      ref: nextRef(),
      fromWarehouse: input.fromWarehouse,
      toWarehouse: input.toWarehouse,
      status: "Draft",
      requestedBy: "Malina Phetxomphou",
      lines: input.lines.map((line) => ({ ...line, id: randomId("l") })),
      createdAt: new Date().toISOString(),
    };
    transfers = [created, ...transfers];
    return shallow(created);
  },

  async setStatus(id: string, status: TransferStatus): Promise<StockTransfer> {
    await delay(300);
    const index = transfers.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Transfer not found.");
    const existing = transfers[index];
    const next: StockTransfer = {
      ...existing,
      status,
      completedAt:
        status === "Completed"
          ? new Date().toISOString()
          : existing.completedAt,
    };
    transfers = transfers.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },
};
