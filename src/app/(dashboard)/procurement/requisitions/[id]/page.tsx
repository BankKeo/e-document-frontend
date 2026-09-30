import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { RequisitionDetail } from "@/features/procurement-requisition/components/requisition-detail";
import { MOCK_REQUISITIONS } from "@/features/procurement-requisition/mock/data";

export const metadata: Metadata = {
  title: "Requisition details — e-Document",
};

export function generateStaticParams() {
  return MOCK_REQUISITIONS.map((requisition) => ({ id: requisition.id }));
}

export default async function RequisitionDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Requisition details"
        description="Items, approval pipeline, and history."
      />
      <RequisitionDetail id={id} />
    </div>
  );
}
