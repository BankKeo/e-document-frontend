import { NotificationNav } from "@/features/notification/components/notification-nav";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <NotificationNav />
      {children}
    </div>
  );
}