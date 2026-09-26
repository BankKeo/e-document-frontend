export type HardwareStatus = "Connected" | "Offline" | "Unavailable";

export interface HardwareDevice {
  id: string;
  name: string;
  type: string;
  location: string;
  status: HardwareStatus;
  lastSeen: string;
}

export interface GeneratedLabel {
  id: string;
  code: string;
  type: "Barcode" | "QR";
  target: string;
  generatedAt: string;
}
