import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workflowService } from "../mock/service";
import type { WorkflowNodeType } from "../types";

export const workflowKeys = {
  all: ["workflows"] as const,
  lists: () => [...workflowKeys.all, "list"] as const,
  list: () => [...workflowKeys.lists()] as const,
  details: () => [...workflowKeys.all, "detail"] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  versions: (id: string) => [...workflowKeys.all, "versions", id] as const,
  categories: () => [...workflowKeys.all, "categories"] as const,
};

export interface WorkflowNodeInput {
  type: WorkflowNodeType;
  title: string;
  description?: string;
  assignee?: string;
}

export function useWorkflows() {
  return useQuery({
    queryKey: workflowKeys.list(),
    queryFn: () => workflowService.listWorkflows(),
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => workflowService.getWorkflow(id),
    enabled: Boolean(id),
  });
}

export function useWorkflowVersions(id: string) {
  return useQuery({
    queryKey: workflowKeys.versions(id),
    queryFn: () => workflowService.listWorkflowVersions(id),
    enabled: Boolean(id),
  });
}

export function useWorkflowCategories() {
  return useQuery({
    queryKey: workflowKeys.categories(),
    queryFn: () => workflowService.listCategories(),
    staleTime: Infinity,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      name: string;
      description?: string;
      category: string;
      nodes: WorkflowNodeInput[];
    }) => workflowService.createWorkflow(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<{
        name: string;
        description: string;
        category: string;
        nodes: WorkflowNodeInput[];
      }>;
    }) => workflowService.updateWorkflow(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workflowService.deleteWorkflow(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}

export function usePublishWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workflowService.publishWorkflow(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}

export function useCreateWorkflowVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: string }) =>
      workflowService.createWorkflowVersion(id, summary),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workflowKeys.all }),
  });
}
