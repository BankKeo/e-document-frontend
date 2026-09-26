import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InventoryHistoryPage } from "@/features/audit/components/inventory-history-page";

export const metadata: Metadata = {
  title: "Inventory Transactions — e-Document",
};

export default function InventoryHistoryRoute() {
  return (
    <div>
      <PageHeader
        title="Inventory transactions"
        description="Every stock movement: in, out, adjustment, and transfer."
      />
      <InventoryHistoryPage />
    </div>
  );
}