import { AppShell } from "@/components/layout/app-shell";
import { CommandMenuProvider } from "@/components/layout/command-menu-context";
import { CommandMenu } from "@/components/layout/command-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGate } from "@/features/auth/components/auth-gate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <CommandMenuProvider>
        <AuthGate>
          <AppShell>{children}</AppShell>
        </AuthGate>
        <CommandMenu />
      </CommandMenuProvider>
    </TooltipProvider>
  );
}
