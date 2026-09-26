import { AuditNav } from "@/features/audit/components/audit-nav";

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <AuditNav />
      {children}
    </div>
  );
}