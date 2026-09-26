import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryPage } from "@/features/notification/components/category-page";

export const metadata: Metadata = {
  title: "Low Stock Alerts — e-Document",
};

export default function LowStockAlertsRoute() {
  return (
    <div>
      <PageHeader title="Low Stock Alerts" description="Items below their reorder level." />
      <CategoryPage kind="stock" />
    </div>
  );
}
