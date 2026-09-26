import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CaptureListPage } from "@/features/dms-capture/components/capture-list-page";

export const metadata: Metadata = {
  title: "Capture & AI — e-Document",
};

export default function CaptureRoute() {
  return (
    <div>
      <PageHeader
        title="Capture & AI"
        description="Upload scanned documents and run the OCR and AI extraction pipeline."
      />
      <CaptureListPage />
    </div>
  );
}
