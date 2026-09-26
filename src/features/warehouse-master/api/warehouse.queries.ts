import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseService } from "../mock/service";

export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  list: () => [...warehouseKeys.lists()] as const,
  details: () => [...warehouseKeys.all, "detail"] as const,
  detail: (id: string) => [...warehouseKeys.details(), id] as const,
};

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: () => warehouseService.listWarehouses(),
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: () => warehouseService.getWarehouse(id),
    enabled: Boolean(id),
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      name: string;
      location: string;
      capacity: number;
      staff: number;
    }) => warehouseService.createWarehouse(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all }),
  });
}

export function useSetWarehouseStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staff }: { id: string; staff: number }) =>
      warehouseService.setStaff(id, staff),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all }),
  });
}
