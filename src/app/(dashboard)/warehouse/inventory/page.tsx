import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InventoryListPage } from "@/features/warehouse-inventory/components/inventory-list-page";

export const metadata: Metadata = {
  title: "Inventory — e-Document",
};

export default function InventoryRoute() {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Item master, on-hand stock, reservations, and stock alerts."
      />
      <InventoryListPage />
    </div>
  );
}
