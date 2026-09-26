import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryPage } from "@/features/notification/components/category-page";

export const metadata: Metadata = {
  title: "Contract Expiration Alerts — e-Document",
};

export default function ContractExpirationAlertsRoute() {
  return (
    <div>
      <PageHeader title="Contract Expiration Alerts" description="Contracts approaching their end date." />
      <CategoryPage kind="contract" />
    </div>
  );
}
