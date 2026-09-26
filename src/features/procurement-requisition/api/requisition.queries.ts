import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { requisitionService } from "../mock/service";
import type { PrStatus } from "../types";

export const requisitionKeys = {
  all: ["requisitions"] as const,
  lists: () => [...requisitionKeys.all, "list"] as const,
  list: () => [...requisitionKeys.lists()] as const,
  details: () => [...requisitionKeys.all, "detail"] as const,
  detail: (id: string) => [...requisitionKeys.details(), id] as const,
  categories: () => [...requisitionKeys.all, "categories"] as const,
  units: () => [...requisitionKeys.all, "units"] as const,
};

export function useRequisitions() {
  return useQuery({
    queryKey: requisitionKeys.list(),
    queryFn: () => requisitionService.listRequisitions(),
  });
}

export function useRequisition(id: string) {
  return useQuery({
    queryKey: requisitionKeys.detail(id),
    queryFn: () => requisitionService.getRequisition(id),
    enabled: Boolean(id),
  });
}

export function useRequisitionCategories() {
  return useQuery({
    queryKey: requisitionKeys.categories(),
    queryFn: () => requisitionService.listCategories(),
    staleTime: Infinity,
  });
}

export function useRequisitionUnits() {
  return useQuery({
    queryKey: requisitionKeys.units(),
    queryFn: () => requisitionService.listUnits(),
    staleTime: Infinity,
  });
}

function useInvalidateRequisitions() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: requisitionKeys.all });
  };
}

export function useCreateRequisition() {
  const invalidate = useInvalidateRequisitions();
  return useMutation({
    mutationFn: (input: {
      title: string;
      department: string;
      category: string;
      items: {
        description: string;
        spec: string;
        quantity: number;
        unit: string;
        estimatedPrice: number;
        requiredDate: string;
      }[];
    }) => requisitionService.createRequisition(input),
    onSuccess: invalidate,
  });
}

export function useSetRequisitionStatus() {
  const invalidate = useInvalidateRequisitions();
  return useMutation({
    mutationFn: ({
      id,
      status,
      action,
    }: {
      id: string;
      status: PrStatus;
      action?: string;
    }) => requisitionService.setStatus(id, status, action),
    onSuccess: invalidate,
  });
}
