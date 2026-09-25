"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { AuthPageShell } from "./auth-page-shell";
import { LoginForm } from "./login-form";

export function LoginRoute() {
  const { status } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  return (
    <AuthPageShell
      title="Sign in to e-Document"
      subtitle="Enter your credentials to access documents, procurement, and warehouse modules."
      footer={
        <>
          New to the platform? Contact your administrator to request an account.
        </>
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}