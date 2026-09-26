import type { Warehouse } from "../types";

function zone(code: string): Warehouse["zones"][number] {
  return {
    id: `${code}_zone`,
    code,
    name: `Zone ${code.replace("Z", "")}`,
    racks: Array.from({ length: 2 }, (_, r) => ({
      id: `${code}_rack_${r + 1}`,
      code: `${code}-R0${r + 1}`,
      shelves: Array.from({ length: 2 }, (_, s) => ({
        id: `${code}_rack_${r + 1}_shelf_${s + 1}`,
        code: `${code}-R0${r + 1}-S0${s + 1}`,
      })),
    })),
  };
}

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: "wh_1",
    name: "Central Warehouse — Vientiane",
    code: "WH-VTE-01",
    location: "Km 3, Thadeua Road, Vientiane",
    capacity: 10_000,
    used: 6_850,
    staff: 14,
    zones: [zone("ZA"), zone("ZB")],
    updatedAt: "2026-02-20",
  },
  {
    id: "wh_2",
    name: "Secondary Warehouse — Savannakhet",
    code: "WH-SVK-01",
    location: "Souphanouvong Rd, Savannakhet",
    capacity: 4_500,
    used: 2_100,
    staff: 8,
    zones: [zone("ZA")],
    updatedAt: "2026-02-18",
  },
];
