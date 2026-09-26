import { MOCK_DEVICES, MOCK_LABELS } from "./data";
import type { GeneratedLabel, HardwareDevice } from "../types";

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

let devices: HardwareDevice[] = [...MOCK_DEVICES];

export const hardwareService = {
  async listDevices(): Promise<HardwareDevice[]> {
    await delay();
    return devices.map((entry) => ({ ...entry }));
  },

  async listLabels(): Promise<GeneratedLabel[]> {
    await delay(150);
    return [...MOCK_LABELS];
  },

  // HW-001/HW-003 — generate barcode / QR label
  async generateLabel(input: {
    type: "Barcode" | "QR";
    target: string;
    code: string;
  }): Promise<GeneratedLabel> {
    await delay(400);
    return {
      id: randomId("lbl"),
      code: input.code,
      type: input.type,
      target: input.target,
      generatedAt: new Date().toISOString(),
    };
  },

  // HW-010 — print integration (mock: mark as queued)
  async printLabel(): Promise<boolean> {
    await delay(300);
    return true;
  },

  async toggleDevice(id: string): Promise<HardwareDevice> {
    await delay(250);
    const index = devices.findIndex((entry) => entry.id === id);
    if (index === -1) throw new Error("Device not found.");
    const existing = devices[index];
    const next: HardwareDevice = {
      ...existing,
      status: existing.status === "Connected" ? "Offline" : "Connected",
      lastSeen: new Date().toISOString(),
    };
    devices = devices.map((entry, i) => (i === index ? next : entry));
    return { ...next };
  },
};
