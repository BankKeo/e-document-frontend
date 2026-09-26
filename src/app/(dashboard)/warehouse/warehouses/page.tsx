import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WarehouseListPage } from "@/features/warehouse-master/components/warehouse-list-page";

export const metadata: Metadata = {
  title: "Warehouses — e-Document",
};

export default function WarehousesRoute() {
  return (
    <div>
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations, zones, racks, and shelves."
      />
      <WarehouseListPage />
    </div>
  );
}
