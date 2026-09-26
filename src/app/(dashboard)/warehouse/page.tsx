import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WarehouseDashboard } from "@/features/warehouse-dashboard/components/warehouse-dashboard";

export const metadata: Metadata = {
  title: "Warehouse — e-Document",
};

export default function WarehouseRoute() {
  return (
    <div>
      <PageHeader
        title="Warehouse & Inventory"
        description="Stock, inbound, outbound, and forecasting overview."
      />
      <WarehouseDashboard />
    </div>
  );
}
