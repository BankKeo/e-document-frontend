"use client";

import { useAuth } from "@/features/auth/context/auth-context";

export function DashboardGreeting() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <h1 className="text-xl font-semibold tracking-tight">
      Good morning, {firstName}
    </h1>
  );
}