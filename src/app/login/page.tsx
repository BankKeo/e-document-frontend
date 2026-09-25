import type { Metadata } from "next";
import { LoginRoute } from "@/features/auth/components/login-route";

export const metadata: Metadata = {
  title: "Sign in — e-Document",
  description: "Sign in to the e-Document platform.",
};

export default function LoginPage() {
  return <LoginRoute />;
}