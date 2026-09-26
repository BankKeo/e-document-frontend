import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { outboundService } from "../mock/service";
import type { OutboundStatus } from "../types";

export const outboundKeys = {
  all: ["outbound"] as const,
  lists: () => [...outboundKeys.all, "list"] as const,
  list: () => [...outboundKeys.lists()] as const,
  details: () => [...outboundKeys.all, "detail"] as const,
  detail: (id: string) => [...outboundKeys.details(), id] as const,
  lines: () => [...outboundKeys.all, "lines"] as const,
};

export function useOutboundIssues() {
  return useQuery({
    queryKey: outboundKeys.list(),
    queryFn: () => outboundService.listOutbound(),
  });
}

export function useOutboundIssue(id: string) {
  return useQuery({
    queryKey: outboundKeys.detail(id),
    queryFn: () => outboundService.getOutbound(id),
    enabled: Boolean(id),
  });
}

export function useOutboundLines() {
  return useQuery({
    queryKey: outboundKeys.lines(),
    queryFn: () => outboundService.listLines(),
    staleTime: Infinity,
  });
}

function useInvalidateOutbound() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: outboundKeys.all });
  };
}

export function useCreateOutbound() {
  const invalidate = useInvalidateOutbound();
  return useMutation({
    mutationFn: (input: {
      department: string;
      requester: string;
      warehouse: string;
      lines: {
        itemName: string;
        sku: string;
        quantity: number;
        unit: string;
      }[];
    }) => outboundService.createIssue(input),
    onSuccess: invalidate,
  });
}

export function useAdvanceOutbound() {
  const invalidate = useInvalidateOutbound();
  return useMutation({
    mutationFn: (id: string) => outboundService.advance(id),
    onSuccess: invalidate,
  });
}

export function useSetOutboundStatus() {
  const invalidate = useInvalidateOutbound();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OutboundStatus }) =>
      outboundService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
