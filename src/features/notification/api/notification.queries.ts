import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { notificationService } from "../mock/service";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unread: () => [...notificationKeys.all, "unread"] as const,
  emails: () => [...notificationKeys.all, "emails"] as const,
  preferences: () => [...notificationKeys.all, "preferences"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.listNotifications(),
    placeholderData: keepPreviousData,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: () => notificationService.unreadCount(),
    refetchInterval: 60_000,
  });
}

export function useEmailNotifications() {
  return useQuery({
    queryKey: notificationKeys.emails(),
    queryFn: () => notificationService.listEmails(),
  });
}

export function useEmailPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationService.listEmailPreferences(),
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
  };
}

export function useMarkRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: invalidate,
  });
}

export function useMarkAllRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: invalidate,
  });
}

export function useResolveNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: ({
      id,
      resolution,
    }: {
      id: string;
      resolution: "approved" | "rejected";
    }) => notificationService.resolveNotification(id, resolution),
    onSuccess: invalidate,
  });
}

export function useUpdateEmailPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      notificationService.updateEmailPreference(key, enabled),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() }),
  });
}