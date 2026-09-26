import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { planService } from "../mock/service";
import type { PlanStatus } from "../types";

export const planKeys = {
  all: ["plans"] as const,
  lists: () => [...planKeys.all, "list"] as const,
  list: () => [...planKeys.lists()] as const,
  details: () => [...planKeys.all, "detail"] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
  categories: () => [...planKeys.all, "categories"] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: planKeys.list(),
    queryFn: () => planService.listPlans(),
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => planService.getPlan(id),
    enabled: Boolean(id),
  });
}

export function usePlanCategories() {
  return useQuery({
    queryKey: planKeys.categories(),
    queryFn: () => planService.listCategories(),
    staleTime: Infinity,
  });
}

function useInvalidatePlans() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: planKeys.all });
  };
}

export function useCreatePlan() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: (input: {
      title: string;
      fiscalYear: string;
      department: string;
      category: string;
      budget: number;
      estimatedCost: number;
      plannedDate: string;
      items: { description: string; quantity: number; estimatedCost: number }[];
    }) => planService.createPlan(input),
    onSuccess: invalidate,
  });
}

export function useSetPlanStatus() {
  const invalidate = useInvalidatePlans();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PlanStatus }) =>
      planService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
