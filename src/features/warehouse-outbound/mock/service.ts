import { MOCK_OUTBOUND } from "./data";
import type { OutboundIssue, OutboundStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let issues: OutboundIssue[] = [...MOCK_OUTBOUND];

let refCounter = 1005;

function nextRef(): string {
  return `OUT-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(issue: OutboundIssue): OutboundIssue {
  return { ...issue, lines: [...issue.lines] };
}

export const outboundService = {
  async listOutbound(): Promise<OutboundIssue[]> {
    await delay();
    return issues.map(shallow);
  },

  async getOutbound(id: string): Promise<OutboundIssue> {
    await delay(200);
    const issue = issues.find((entry) => entry.id === id);
    if (!issue) throw new Error("Outbound issue not found.");
    return shallow(issue);
  },

  // OUT-001 — stock request / issue request
  async createIssue(input: {
    department: string;
    requester: string;
    warehouse: string;
    lines: { itemName: string; sku: string; quantity: number; unit: string }[];
  }): Promise<OutboundIssue> {
    await delay(450);
    const created: OutboundIssue = {
      id: randomId("out"),
      ref: nextRef(),
      department: input.department,
      requester: input.requester,
      status: "Requested",
      warehouse: input.warehouse,
      lines: input.lines.map((line) => ({ ...line, id: randomId("l") })),
      requestedAt: new Date().toISOString(),
      createdBy: "Malinee Vongkham",
    };
    issues = [created, ...issues];
    return shallow(created);
  },

  // OUT-002/003 — request → approval → picking → packing → issue
  async advance(id: string): Promise<OutboundIssue> {
    await delay(300);
    const index = issues.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Outbound issue not found.");
    const existing = issues[index];
    const flow: Record<OutboundStatus, OutboundStatus> = {
      Requested: "Approved",
      Approved: "Picking",
      Picking: "Packed",
      Packed: "Issued",
      Issued: "Delivered",
      Delivered: "Delivered",
    };
    const nextStatus = flow[existing.status];
    const next: OutboundIssue = {
      ...existing,
      status: nextStatus,
      issuedAt:
        nextStatus === "Issued" || nextStatus === "Delivered"
          ? new Date().toISOString()
          : existing.issuedAt,
    };
    issues = issues.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // OUT-005 — pack (set status Packed; picks done with barcode scan)
  async setStatus(id: string, status: OutboundStatus): Promise<OutboundIssue> {
    await delay(300);
    const index = issues.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Outbound issue not found.");
    const existing = issues[index];
    const next: OutboundIssue = {
      ...existing,
      status,
      issuedAt:
        status === "Issued" || status === "Delivered"
          ? new Date().toISOString()
          : existing.issuedAt,
    };
    issues = issues.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listLines(): Promise<
    { itemName: string; sku: string; unit: string }[]
  > {
    await delay(80);
    return [
      { itemName: "Paper A4 80gsm", sku: "SKU-001", unit: "ream" },
      { itemName: "Ink Toner HP 63", sku: "SKU-002", unit: "unit" },
      { itemName: 'Business Laptop 14"', sku: "SKU-008", unit: "unit" },
      { itemName: "General Purpose Cleaner", sku: "SKU-006", unit: "litre" },
      { itemName: "Asphalt Mix AC-20", sku: "SKU-004", unit: "ton" },
      { itemName: "Office Desk", sku: "SKU-003", unit: "unit" },
    ];
  },
};
