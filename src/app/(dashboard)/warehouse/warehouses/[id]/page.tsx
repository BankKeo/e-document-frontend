import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WarehouseDetail } from "@/features/warehouse-master/components/warehouse-detail";
import { MOCK_WAREHOUSES } from "@/features/warehouse-master/mock/data";

export const metadata: Metadata = {
  title: "Warehouse details — e-Document",
};

export function generateStaticParams() {
  return MOCK_WAREHOUSES.map((warehouse) => ({ id: warehouse.id }));
}

export default async function WarehouseDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Warehouse details"
        description="Capacity, utilization, and the zone → rack → shelf hierarchy."
      />
      <WarehouseDetail id={id} />
    </div>
  );
}
