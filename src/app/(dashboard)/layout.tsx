import { AppShell } from "@/components/layout/app-shell";
import { CommandMenuProvider } from "@/components/layout/command-menu-context";
import { CommandMenu } from "@/components/layout/command-menu";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <CommandMenuProvider>
        <AppShell>{children}</AppShell>
        <CommandMenu />
      </CommandMenuProvider>
    </TooltipProvider>
  );
}
