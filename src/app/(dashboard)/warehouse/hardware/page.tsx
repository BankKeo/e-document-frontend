import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { HardwarePage } from "@/features/warehouse-hardware/components/hardware-page";

export const metadata: Metadata = {
  title: "Barcode & Hardware — e-Document",
};

export default function HardwareRoute() {
  return (
    <div>
      <PageHeader
        title="Barcode & Hardware"
        description="Generate labels, manage scanners and printers, and barcode workflows."
      />
      <HardwarePage />
    </div>
  );
}
