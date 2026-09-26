import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { TenderListPage } from "@/features/procurement-tender/components/tender-list-page";

export const metadata: Metadata = {
  title: "Tenders — e-Document",
};

export default function TendersRoute() {
  return (
    <div>
      <PageHeader
        title="Tenders & e-Bidding"
        description="Publish tenders, receive bids, evaluate, and award contracts."
      />
      <TenderListPage />
    </div>
  );
}
