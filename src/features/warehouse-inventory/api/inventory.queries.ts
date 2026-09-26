import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../mock/service";
import type { ItemStatus } from "../types";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: () => [...inventoryKeys.lists()] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  categories: () => [...inventoryKeys.all, "categories"] as const,
};

export function useInventoryItems() {
  return useQuery({
    queryKey: inventoryKeys.list(),
    queryFn: () => inventoryService.listItems(),
  });
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.getItem(id),
    enabled: Boolean(id),
  });
}

export function useInventoryCategories() {
  return useQuery({
    queryKey: inventoryKeys.categories(),
    queryFn: () => inventoryService.listCategories(),
    staleTime: Infinity,
  });
}

function useInvalidateInventory() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
  };
}

export function useCreateInventoryItem() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: (input: {
      name: string;
      category: string;
      unit: string;
      brand?: string;
      model?: string;
      minStock: number;
      maxStock: number;
      reorderPoint: number;
    }) => inventoryService.createItem(input),
    onSuccess: invalidate,
  });
}

export function useAdjustStock() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: ({
      id,
      quantity,
      reason,
    }: {
      id: string;
      quantity: number;
      reason: string;
    }) => inventoryService.adjustStock(id, quantity, reason),
    onSuccess: invalidate,
  });
}

export function useSetReserved() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: ({
      id,
      reservedStock,
    }: {
      id: string;
      reservedStock: number;
    }) => inventoryService.setReserved(id, reservedStock),
    onSuccess: invalidate,
  });
}

export function useSetItemStatus() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: ({ id, itemStatus }: { id: string; itemStatus: ItemStatus }) =>
      inventoryService.setItemStatus(id, itemStatus),
    onSuccess: invalidate,
  });
}
