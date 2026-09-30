import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CaptureDetail } from "@/features/dms-capture/components/capture-detail";
import { MOCK_CAPTURE_DOCUMENTS } from "@/features/dms-capture/mock/data";

export const metadata: Metadata = {
  title: "Capture details — e-Document",
};

export function generateStaticParams() {
  return MOCK_CAPTURE_DOCUMENTS.map((doc) => ({ id: doc.id }));
}

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
