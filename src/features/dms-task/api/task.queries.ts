import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../mock/service";
import type { TaskPriority, TaskStatus } from "../types";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: () => [...taskKeys.lists()] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: () => taskService.listTasks(),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: Boolean(id),
  });
}

function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.all });
  };
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: {
      title: string;
      description: string;
      assignee: string;
      priority: TaskPriority;
      dueDate: string;
    }) => taskService.createTask(input),
    onSuccess: invalidate,
  });
}

export function useAssignTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, assignee }: { id: string; assignee: string }) =>
      taskService.assignTask(id, assignee),
    onSuccess: invalidate,
  });
}

export function useSetTaskStatus() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.setStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useAddTaskComment() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      taskService.addComment(id, text),
    onSuccess: invalidate,
  });
}

export function useRequestReminder() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (id: string) => taskService.requestReminder(id),
    onSuccess: invalidate,
  });
}
