import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transferService } from "../mock/service";
import type { TransferStatus } from "../types";

export const transferKeys = {
  all: ["transfers"] as const,
  lists: () => [...transferKeys.all, "list"] as const,
  list: () => [...transferKeys.lists()] as const,
};

export function useStockTransfers() {
  return useQuery({
    queryKey: transferKeys.list(),
    queryFn: () => transferService.listTransfers(),
  });
}

export function useCreateStockTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      fromWarehouse: string;
      toWarehouse: string;
      lines: {
        itemName: string;
        sku: string;
        quantity: number;
        unit: string;
      }[];
    }) => transferService.createTransfer(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: transferKeys.all }),
  });
}

export function useSetTransferStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TransferStatus }) =>
      transferService.setStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: transferKeys.all }),
  });
}
