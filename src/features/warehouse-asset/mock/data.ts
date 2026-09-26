import type { Asset } from "../types";

function ago(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: "asset_1",
    tag: "AST-001",
    name: "Laptop — ThinkPad E14",
    category: "Laptop",
    location: "Procurement Office",
    custodian: "Aloun Sisavath",
    purchaseDate: ago(400),
    purchaseValue: 9_500_000,
    currentValue: 7_300_000,
    depreciationRate: 25,
    status: "Assigned",
    maintenance: [{ last: ago(120), note: "Battery replaced" }],
    history: [
      { at: ago(400), event: "Registered", actor: "Somchai Keopaseuth" },
      {
        at: ago(50),
        event: "Assigned to Aloun Sisavath",
        actor: "Malinee Vongkham",
      },
    ],
  },
  {
    id: "asset_2",
    tag: "AST-002",
    name: "Printer — HP LaserJet",
    category: "Printer",
    location: "Warehouse Office",
    custodian: "Malinee Vongkham",
    purchaseDate: ago(600),
    purchaseValue: 4_200_000,
    currentValue: 2_900_000,
    depreciationRate: 20,
    status: "Assigned",
    history: [
      { at: ago(600), event: "Registered", actor: "Somchai Keopaseuth" },
    ],
  },
  {
    id: "asset_3",
    tag: "AST-003",
    name: "Pickup Vehicle — VTE-2020",
    category: "Vehicle",
    location: "Central Warehouse",
    custodian: "Somchai Keopaseuth",
    purchaseDate: ago(1400),
    purchaseValue: 120_000_000,
    currentValue: 88_000_000,
    depreciationRate: 15,
    status: "Available",
    maintenance: [{ last: ago(60), note: "Oil change" }],
    history: [
      { at: ago(1400), event: "Registered", actor: "Phoutthasone Keomany" },
    ],
  },
  {
    id: "asset_4",
    tag: "AST-004",
    name: "Server — Dell R740",
    category: "Server",
    location: "Server Room",
    custodian: "IT Support",
    purchaseDate: ago(900),
    purchaseValue: 45_000_000,
    currentValue: 30_500_000,
    depreciationRate: 20,
    status: "In Maintenance",
    maintenance: [{ last: ago(10), note: "Drive array rebuild" }],
    history: [{ at: ago(900), event: "Registered", actor: "IT Support" }],
  },
  {
    id: "asset_5",
    tag: "AST-005",
    name: "Projector — Epson EB-700",
    category: "Projector",
    location: "Boardroom",
    custodian: "Executive Office",
    purchaseDate: ago(1000),
    purchaseValue: 7_800_000,
    currentValue: 4_100_000,
    depreciationRate: 25,
    status: "Assigned",
    history: [
      { at: ago(1000), event: "Registered", actor: "Malina Phetxomphou" },
    ],
  },
];
