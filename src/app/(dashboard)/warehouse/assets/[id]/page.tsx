import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AssetDetail } from "@/features/warehouse-asset/components/asset-detail";
import { MOCK_ASSETS } from "@/features/warehouse-asset/mock/data";

export const metadata: Metadata = {
  title: "Asset details — e-Document",
};

export function generateStaticParams() {
  return MOCK_ASSETS.map((asset) => ({ id: asset.id }));
}

export default async function AssetDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Asset details"
        description="Custodian, financials, maintenance, and history."
      />
      <AssetDetail id={id} />
    </div>
  );
}
