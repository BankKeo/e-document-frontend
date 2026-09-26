import { MOCK_PR_CATEGORIES, MOCK_PR_UNITS, MOCK_REQUISITIONS } from "./data";
import type { PurchaseRequisition, PrItem, PrStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let requisitions: PurchaseRequisition[] = [...MOCK_REQUISITIONS];

let refCounter = 1006;

function nextRef(): string {
  return `PR-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

const CURRENT_ACTOR = "Malina Phetxomphou";

function shallow(pr: PurchaseRequisition): PurchaseRequisition {
  return {
    ...pr,
    items: [...pr.items],
    documents: [...pr.documents],
    history: [...pr.history],
  };
}

export const requisitionService = {
  async listRequisitions(): Promise<PurchaseRequisition[]> {
    await delay();
    return requisitions.map(shallow);
  },

  async getRequisition(id: string): Promise<PurchaseRequisition> {
    await delay(200);
    const requisition = requisitions.find((entry) => entry.id === id);
    if (!requisition) throw new Error("Purchase requisition not found.");
    return shallow(requisition);
  },

  // PR-001 — Create
  async createRequisition(input: {
    title: string;
    department: string;
    category: string;
    items: {
      description: string;
      spec: string;
      quantity: number;
      unit: string;
      estimatedPrice: number;
      requiredDate: string;
    }[];
  }): Promise<PurchaseRequisition> {
    await delay(450);
    const items: PrItem[] = input.items.map((item) => ({
      ...item,
      id: randomId("i"),
    }));
    const created: PurchaseRequisition = {
      id: randomId("pr"),
      ref: nextRef(),
      title: input.title.trim(),
      department: input.department,
      category: input.category,
      requester: CURRENT_ACTOR,
      status: "Draft",
      items,
      total: items.reduce(
        (sum, item) => sum + item.quantity * item.estimatedPrice,
        0
      ),
      documents: [],
      history: [
        {
          id: randomId("h"),
          at: new Date().toISOString(),
          action: "Created by Malina Phetxomphou",
          actor: CURRENT_ACTOR,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requisitions = [created, ...requisitions];
    return shallow(created);
  },

  // PR-008/009/010/011/012 — workflow transitions
  async setStatus(
    id: string,
    status: PrStatus,
    action?: string
  ): Promise<PurchaseRequisition> {
    await delay(350);
    const index = requisitions.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Purchase requisition not found.");
    const existing = requisitions[index];
    const next: PurchaseRequisition = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
      history: [
        ...existing.history,
        {
          id: randomId("h"),
          at: new Date().toISOString(),
          action: action ?? `Status → ${status}`,
          actor: CURRENT_ACTOR,
        },
      ],
    };
    requisitions = requisitions.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_PR_CATEGORIES];
  },

  async listUnits(): Promise<string[]> {
    await delay(80);
    return [...MOCK_PR_UNITS];
  },
};
