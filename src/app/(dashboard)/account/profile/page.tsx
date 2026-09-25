import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UserProfile } from "@/features/users/components/user-profile";

export const metadata: Metadata = {
  title: "My Profile — e-Document",
};

export default function ProfileRoute() {
  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your account, contact, and organization details."
      />
      <UserProfile />
    </div>
  );
}