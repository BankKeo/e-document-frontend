import { MOCK_CONTRACT_TYPES, MOCK_CONTRACTS } from "./data";
import type { Contract, ContractStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let contracts: Contract[] = [...MOCK_CONTRACTS];

let refCounter = 1007;

function nextRef(): string {
  return `CON-2026-${(refCounter++).toString().padStart(3, "0")}`;
}

function shallow(contract: Contract): Contract {
  return {
    ...contract,
    documents: [...contract.documents],
    versions: contract.versions ? [...contract.versions] : undefined,
    amendments: contract.amendments ? [...contract.amendments] : undefined,
  };
}

export const contractService = {
  async listContracts(): Promise<Contract[]> {
    await delay();
    return contracts.map(shallow);
  },

  async getContract(id: string): Promise<Contract> {
    await delay(200);
    const contract = contracts.find((entry) => entry.id === id);
    if (!contract) throw new Error("Contract not found.");
    return shallow(contract);
  },

  // CON-001 — create draft
  async createContract(input: {
    title: string;
    type: string;
    supplier: string;
    value: number;
    startDate: string;
    endDate: string;
  }): Promise<Contract> {
    await delay(450);
    const created: Contract = {
      id: randomId("con"),
      ref: nextRef(),
      title: input.title.trim(),
      type: input.type,
      supplier: input.supplier,
      value: input.value,
      startDate: input.startDate,
      endDate: input.endDate,
      owner: "Malina Phetxomphou",
      status: "Draft",
      signed: false,
      documents: [],
      versions: [
        {
          id: randomId("v"),
          version: "v0.1",
          at: new Date().toISOString().slice(0, 10),
          actor: "Malina Phetxomphou",
          summary: "Draft created",
        },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    contracts = [created, ...contracts];
    return shallow(created);
  },

  // CON-009/010 — lifecycle: review → approval → sign → active
  async setStatus(id: string, status: ContractStatus): Promise<Contract> {
    await delay(350);
    const index = contracts.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Contract not found.");
    const existing = contracts[index];
    const next: Contract = {
      ...existing,
      status,
      signed:
        status === "Active" || status === "Signing"
          ? existing.signed
          : existing.signed,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    contracts = contracts.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // CON-010 — digital signature
  async signContract(id: string): Promise<Contract> {
    await delay(400);
    const index = contracts.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Contract not found.");
    const existing = contracts[index];
    const next: Contract = {
      ...existing,
      signed: true,
      status: "Active",
      updatedAt: new Date().toISOString().slice(0, 10),
      versions: [
        ...(existing.versions ?? []),
        {
          id: randomId("v"),
          version: "v1.0",
          at: new Date().toISOString().slice(0, 10),
          actor: existing.owner,
          summary: "Digitally signed",
        },
      ],
    };
    contracts = contracts.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // CON-011 — version bump
  async createVersion(id: string, summary: string): Promise<Contract> {
    await delay(350);
    const index = contracts.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Contract not found.");
    const existing = contracts[index];
    const latest = existing.versions?.[0]?.version ?? "v0.1";
    const next: Contract = {
      ...existing,
      versions: [
        {
          id: randomId("v"),
          version: bumpVersion(latest),
          at: new Date().toISOString().slice(0, 10),
          actor: existing.owner,
          summary: summary.trim() || "Version created",
        },
        ...(existing.versions ?? []),
      ],
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    contracts = contracts.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // CON-012 — amendment
  async addAmendment(
    id: string,
    title: string,
    note: string
  ): Promise<Contract> {
    await delay(350);
    const index = contracts.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Contract not found.");
    const existing = contracts[index];
    const next: Contract = {
      ...existing,
      amendments: [
        ...(existing.amendments ?? []),
        {
          id: randomId("a"),
          at: new Date().toISOString().slice(0, 10),
          title,
          note,
        },
      ],
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    contracts = contracts.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // CON-014 — terminate
  async terminateContract(id: string): Promise<Contract> {
    await delay(300);
    const index = contracts.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Contract not found.");
    const existing = contracts[index];
    const next: Contract = { ...existing, status: "Terminated" };
    contracts = contracts.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async listTypes(): Promise<string[]> {
    await delay(80);
    return [...MOCK_CONTRACT_TYPES];
  },
};

function bumpVersion(version: string): string {
  const minor = Number(version.split(".")[1] ?? "0");
  return `v${Math.floor(minor / 10)}.${minor + 1}`;
}
