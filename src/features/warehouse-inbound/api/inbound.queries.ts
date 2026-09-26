import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inboundService } from "../mock/service";

export const inboundKeys = {
  all: ["inbound"] as const,
  lists: () => [...inboundKeys.all, "list"] as const,
  list: () => [...inboundKeys.lists()] as const,
  details: () => [...inboundKeys.all, "detail"] as const,
  detail: (id: string) => [...inboundKeys.details(), id] as const,
  items: () => [...inboundKeys.all, "items"] as const,
};

export function useInboundOrders() {
  return useQuery({
    queryKey: inboundKeys.list(),
    queryFn: () => inboundService.listInbound(),
  });
}

export function useInboundOrder(id: string) {
  return useQuery({
    queryKey: inboundKeys.detail(id),
    queryFn: () => inboundService.getInbound(id),
    enabled: Boolean(id),
  });
}

export function useInboundItems() {
  return useQuery({
    queryKey: inboundKeys.items(),
    queryFn: () => inboundService.listItems(),
    staleTime: Infinity,
  });
}

function useInvalidateInbound() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: inboundKeys.all });
  };
}

export function useCreateInbound() {
  const invalidate = useInvalidateInbound();
  return useMutation({
    mutationFn: (input: {
      purchaseOrderRef: string;
      supplier: string;
      warehouse: string;
      note: string;
      lines: {
        itemName: string;
        sku: string;
        expected: number;
        unit: string;
      }[];
    }) => inboundService.createInbound(input),
    onSuccess: invalidate,
  });
}

export function useMarkArrived() {
  const invalidate = useInvalidateInbound();
  return useMutation({
    mutationFn: (id: string) => inboundService.markArrived(id),
    onSuccess: invalidate,
  });
}

export function useReceiveGoods() {
  const invalidate = useInvalidateInbound();
  return useMutation({
    mutationFn: ({
      id,
      received,
      rejected,
    }: {
      id: string;
      received: Record<string, number>;
      rejected: Record<string, number>;
    }) => inboundService.receiveGoods(id, received, rejected),
    onSuccess: invalidate,
  });
}

export function usePutAway() {
  const invalidate = useInvalidateInbound();
  return useMutation({
    mutationFn: (id: string) => inboundService.putAway(id),
    onSuccess: invalidate,
  });
}
