import { RbacNav } from "@/features/rbac/components/rbac-nav";

export default function RbacLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <RbacNav />
      {children}
    </div>
  );
}