import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { LoginHistoryPage } from "@/features/audit/components/login-history-page";

export const metadata: Metadata = {
  title: "Login History — e-Document",
};

export default function AuditRoute() {
  return (
    <div>
      <PageHeader
        title="Login history"
        description="Every sign-in attempt, device, and outcome."
      />
      <LoginHistoryPage />
    </div>
  );
}