import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "../mock/service";
import type { DeliveryStatus } from "../types";

export const deliveryKeys = {
  all: ["deliveries"] as const,
  lists: () => [...deliveryKeys.all, "list"] as const,
  list: () => [...deliveryKeys.lists()] as const,
  details: () => [...deliveryKeys.all, "detail"] as const,
  detail: (id: string) => [...deliveryKeys.details(), id] as const,
};

export function useDeliveries() {
  return useQuery({
    queryKey: deliveryKeys.list(),
    queryFn: () => deliveryService.listDeliveries(),
  });
}

export function useDelivery(id: string) {
  return useQuery({
    queryKey: deliveryKeys.detail(id),
    queryFn: () => deliveryService.getDelivery(id),
    enabled: Boolean(id),
  });
}

function useInvalidateDeliveries() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: deliveryKeys.all });
  };
}

export function useCreateDelivery() {
  const invalidate = useInvalidateDeliveries();
  return useMutation({
    mutationFn: (input: {
      purchaseOrderRef: string;
      supplier: string;
      scheduledDate: string;
      note: string;
      lines: { item: string; expectedQty: number; unit: string }[];
    }) => deliveryService.createDelivery(input),
    onSuccess: invalidate,
  });
}

export function useMarkShipped() {
  const invalidate = useInvalidateDeliveries();
  return useMutation({
    mutationFn: (id: string) => deliveryService.markShipped(id),
    onSuccess: invalidate,
  });
}

export function useReceiveDelivery() {
  const invalidate = useInvalidateDeliveries();
  return useMutation({
    mutationFn: ({
      id,
      received,
      rejected,
    }: {
      id: string;
      received: Record<string, number>;
      rejected: Record<string, number>;
    }) => deliveryService.receiveDelivery(id, received, rejected),
    onSuccess: invalidate,
  });
}

export function useConfirmDelivery() {
  const invalidate = useInvalidateDeliveries();
  return useMutation({
    mutationFn: (id: string) => deliveryService.confirmDelivery(id),
    onSuccess: invalidate,
  });
}

export function useSetDeliveryStatus() {
  const invalidate = useInvalidateDeliveries();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DeliveryStatus }) =>
      deliveryService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
