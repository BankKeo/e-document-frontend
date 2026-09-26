import { MOCK_TENDER_CATEGORIES, MOCK_TENDERS } from "./data";
import type { Tender, TenderBid, TenderStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let tenders: Tender[] = [...MOCK_TENDERS];

let refCounter = 1014;

function nextRef(): string {
  return `TENDER-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(tender: Tender): Tender {
  return {
    ...tender,
    documents: [...tender.documents],
    bids: tender.bids.map((bid) => ({ ...bid })),
    evaluationCommittee: [...tender.evaluationCommittee],
  };
}

export const tenderService = {
  async listTenders(): Promise<Tender[]> {
    await delay();
    return tenders.map(shallow);
  },

  async getTender(id: string): Promise<Tender> {
    await delay(200);
    const tender = tenders.find((entry) => entry.id === id);
    if (!tender) throw new Error("Tender not found.");
    return shallow(tender);
  },

  // TENDER-001 — create
  async createTender(input: {
    title: string;
    category: string;
    description: string;
    estimatedValue: number;
  }): Promise<Tender> {
    await delay(450);
    const created: Tender = {
      id: randomId("tender"),
      ref: nextRef(),
      title: input.title.trim(),
      category: input.category,
      status: "Draft",
      description: input.description.trim(),
      estimatedValue: input.estimatedValue,
      owner: "Malina Phetxomphou",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      documents: [],
      schedule: {
        publish: new Date(Date.now() + 10 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        bidSubmission: new Date(Date.now() + 30 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        bidOpening: new Date(Date.now() + 31 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        evaluation: new Date(Date.now() + 40 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        award: new Date(Date.now() + 45 * 86_400_000)
          .toISOString()
          .slice(0, 10),
      },
      bids: [],
      evaluationCommittee: [],
    };
    tenders = [created, ...tenders];
    return shallow(created);
  },

  // TENDER-006 — publish
  async publishTender(id: string): Promise<Tender> {
    await delay(400);
    const index = tenders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Tender not found.");
    const existing = tenders[index];
    const next: Tender = {
      ...existing,
      status: existing.status === "Draft" ? "Open for Bids" : "Draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    tenders = tenders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // TENDER-009 — submit a bid
  async submitBid(
    id: string,
    supplier: string,
    amount: number
  ): Promise<Tender> {
    await delay(350);
    const index = tenders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Tender not found.");
    const existing = tenders[index];
    const bid: TenderBid = {
      id: randomId("b"),
      supplier,
      amount,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
    };
    const next: Tender = { ...existing, bids: [...existing.bids, bid] };
    tenders = tenders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // TENDER-012/013 — evaluate (score a bid)
  async scoreBid(
    id: string,
    bidId: string,
    technicalScore: number,
    financialScore: number
  ): Promise<Tender> {
    await delay(350);
    const index = tenders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Tender not found.");
    const existing = tenders[index];
    const next: Tender = {
      ...existing,
      bids: existing.bids.map((bid) =>
        bid.id === bidId
          ? {
              ...bid,
              technicalScore,
              financialScore,
              totalScore: Math.round(
                technicalScore * 0.6 + financialScore * 0.4
              ),
              status:
                technicalScore >= 70 && financialScore >= 70
                  ? "Shortlisted"
                  : "Compliant",
            }
          : bid
      ),
    };
    tenders = tenders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // TENDER-016/017 — award
  async awardTender(id: string, bidId: string): Promise<Tender> {
    await delay(400);
    const index = tenders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Tender not found.");
    const existing = tenders[index];
    const next: Tender = {
      ...existing,
      status: "Awarded",
      bids: existing.bids.map((bid) =>
        bid.id === bidId
          ? { ...bid, status: "Awarded" }
          : {
              ...bid,
              status: bid.status === "Shortlisted" ? "Compliant" : bid.status,
            }
      ),
    };
    tenders = tenders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // TENDER-018 — cancel
  async cancelTender(id: string): Promise<Tender> {
    await delay(300);
    const index = tenders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Tender not found.");
    const existing = tenders[index];
    const next: Tender = { ...existing, status: "Cancelled" };
    tenders = tenders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async setStatus(id: string, status: TenderStatus): Promise<Tender> {
    await delay(300);
    const index = tenders.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Tender not found.");
    const existing = tenders[index];
    const next: Tender = { ...existing, status };
    tenders = tenders.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listCategories(): Promise<string[]> {
    await delay(80);
    return [...MOCK_TENDER_CATEGORIES];
  },
};
