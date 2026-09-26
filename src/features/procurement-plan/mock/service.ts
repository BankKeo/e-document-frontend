import { MOCK_PLANS, MOCK_PLAN_CATEGORIES } from "./data";
import type { ProcurementPlan, PlanStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let plans: ProcurementPlan[] = [...MOCK_PLANS];

let refCounter = 1006;

function nextRef(): string {
  return `PLAN-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

export const planService = {
  async listPlans(): Promise<ProcurementPlan[]> {
    await delay();
    return plans.map((entry) => ({ ...entry, items: [...entry.items] }));
  },

  async getPlan(id: string): Promise<ProcurementPlan> {
    await delay(200);
    const plan = plans.find((entry) => entry.id === id);
    if (!plan) throw new Error("Procurement plan not found.");
    return { ...plan, items: [...plan.items] };
  },

  // PLAN-001 — create
  async createPlan(input: {
    title: string;
    fiscalYear: string;
    department: string;
    category: string;
    budget: number;
    estimatedCost: number;
    plannedDate: string;
    items: { description: string; quantity: number; estimatedCost: number }[];
  }): Promise<ProcurementPlan> {
    await delay(450);
    const created: ProcurementPlan = {
      id: randomId("plan"),
      ref: nextRef(),
      title: input.title.trim(),
      fiscalYear: input.fiscalYear,
      department: input.department,
      category: input.category,
      budget: input.budget,
      estimatedCost: input.estimatedCost,
      plannedDate: input.plannedDate,
      items: input.items.map((item) => ({ ...item, id: randomId("i") })),
      status: "Draft",
      owner: "Malina Phetxomphou",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    plans = [created, ...plans];
    return { ...created };
  },

  // PLAN-008 — approval lifecycle
  async setStatus(id: string, status: PlanStatus): Promise<ProcurementPlan> {
    await delay(350);
    const index = plans.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Procurement plan not found.");
    const next: ProcurementPlan = {
      ...plans[index],
      status,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    plans = plans.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_PLAN_CATEGORIES];
  },
};
