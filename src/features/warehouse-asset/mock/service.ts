import { MOCK_ASSETS } from "./data";
import type { Asset, AssetCategory, AssetStatus } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let assets: Asset[] = [...MOCK_ASSETS];

let tagCounter = 1006;

function nextTag(): string {
  return `AST-${(tagCounter++).toString().padStart(3, "0")}`;
}

const CURRENT_ACTOR = "Malinee Vongkham";

function shallow(asset: Asset): Asset {
  return {
    ...asset,
    maintenance: asset.maintenance ? [...asset.maintenance] : undefined,
    history: asset.history ? [...asset.history] : undefined,
  };
}

export const assetService = {
  async listAssets(): Promise<Asset[]> {
    await delay();
    return assets.map(shallow);
  },

  async getAsset(id: string): Promise<Asset> {
    await delay(200);
    const asset = assets.find((entry) => entry.id === id);
    if (!asset) throw new Error("Asset not found.");
    return shallow(asset);
  },

  // ASSET-001 — register
  async createAsset(input: {
    name: string;
    category: AssetCategory;
    location: string;
    custodian: string;
    purchaseValue: number;
    depreciationRate: number;
  }): Promise<Asset> {
    await delay(450);
    const created: Asset = {
      id: randomId("asset"),
      tag: nextTag(),
      name: input.name.trim(),
      category: input.category,
      location: input.location,
      custodian: input.custodian,
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchaseValue: input.purchaseValue,
      currentValue: input.purchaseValue,
      depreciationRate: input.depreciationRate,
      status: "Available",
      history: [
        {
          at: new Date().toISOString().slice(0, 10),
          event: "Registered",
          actor: CURRENT_ACTOR,
        },
      ],
    };
    assets = [created, ...assets];
    return shallow(created);
  },

  // ASSET-006/007 — assign / transfer
  async assignAsset(
    id: string,
    custodian: string,
    location?: string
  ): Promise<Asset> {
    await delay(300);
    const index = assets.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Asset not found.");
    const existing = assets[index];
    const next: Asset = {
      ...existing,
      custodian,
      location: location ?? existing.location,
      status: "Assigned",
      history: [
        ...(existing.history ?? []),
        {
          at: new Date().toISOString().slice(0, 10),
          event: `Assigned to ${custodian}`,
          actor: CURRENT_ACTOR,
        },
      ],
    };
    assets = assets.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // ASSET-008 — maintenance
  async recordMaintenance(id: string, note: string): Promise<Asset> {
    await delay(300);
    const index = assets.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Asset not found.");
    const existing = assets[index];
    const next: Asset = {
      ...existing,
      status: "In Maintenance",
      maintenance: [
        ...(existing.maintenance ?? []),
        { last: new Date().toISOString().slice(0, 10), note },
      ],
    };
    assets = assets.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  // ASSET-011 — dispose
  async disposeAsset(id: string): Promise<Asset> {
    await delay(300);
    const index = assets.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Asset not found.");
    const existing = assets[index];
    const next: Asset = {
      ...existing,
      status: "Disposed",
      history: [
        ...(existing.history ?? []),
        {
          at: new Date().toISOString().slice(0, 10),
          event: "Disposed",
          actor: CURRENT_ACTOR,
        },
      ],
    };
    assets = assets.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },

  async setStatus(id: string, status: AssetStatus): Promise<Asset> {
    await delay(250);
    const index = assets.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Asset not found.");
    const next: Asset = { ...assets[index], status };
    assets = assets.map((entry, i) => (i === index ? next : entry));
    return shallow(next);
  },
};
