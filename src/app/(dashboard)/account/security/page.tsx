import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SecurityPage } from "@/features/auth/components/security-page";

export const metadata: Metadata = {
  title: "Security — e-Document",
};

export default function SecurityRoute() {
  return (
    <div>
      <PageHeader
        title="Security"
        description="Manage your password, active sessions, and multi-factor authentication."
      />
      <SecurityPage />
    </div>
  );
}