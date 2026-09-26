import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CaptureDetail } from "@/features/dms-capture/components/capture-detail";

export const metadata: Metadata = {
  title: "Capture review — e-Document",
};

export default async function CaptureDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PageHeader
        title="Capture review"
        description="Verify OCR text, classification, and extracted metadata."
      />
      <CaptureDetail id={id} />
    </div>
  );
}
