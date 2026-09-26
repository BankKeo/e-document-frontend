import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meetingService } from "../mock/service";
import type { Meeting, MeetingActionItem, MeetingDecision } from "../types";

export const meetingKeys = {
  all: ["meetings"] as const,
  lists: () => [...meetingKeys.all, "list"] as const,
  list: () => [...meetingKeys.lists()] as const,
  details: () => [...meetingKeys.all, "detail"] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
};

export function useMeetings() {
  return useQuery({
    queryKey: meetingKeys.list(),
    queryFn: () => meetingService.listMeetings(),
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: () => meetingService.getMeeting(id),
    enabled: Boolean(id),
  });
}

function useInvalidateMeetings() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: meetingKeys.all });
  };
}

export function useCreateMeeting() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: (input: {
      title: string;
      date: string;
      time: string;
      duration: number;
      location: string;
      attendees: string[];
    }) => meetingService.createMeeting(input),
    onSuccess: invalidate,
  });
}

export function useAddAttendees() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: ({ id, emails }: { id: string; emails: string[] }) =>
      meetingService.addAttendees(id, emails),
    onSuccess: invalidate,
  });
}

export function useSaveMinutes() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: ({ id, minutes }: { id: string; minutes: string }) =>
      meetingService.saveMinutes(id, minutes),
    onSuccess: invalidate,
  });
}

export function useAddDecision() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: ({
      id,
      decision,
    }: {
      id: string;
      decision: Omit<MeetingDecision, "id">;
    }) => meetingService.addDecision(id, decision),
    onSuccess: invalidate,
  });
}

export function useAddActionItem() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: ({
      id,
      item,
    }: {
      id: string;
      item: Omit<MeetingActionItem, "id">;
    }) => meetingService.addActionItem(id, item),
    onSuccess: invalidate,
  });
}

export function useSetMeetingStatus() {
  const invalidate = useInvalidateMeetings();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Meeting["status"] }) =>
      meetingService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
