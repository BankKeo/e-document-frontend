import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "../mock/service";
import type { SupplierDocument, SupplierStatus } from "../types";

export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: () => [...supplierKeys.lists()] as const,
  details: () => [...supplierKeys.all, "detail"] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  categories: () => [...supplierKeys.all, "categories"] as const,
  countries: () => [...supplierKeys.all, "countries"] as const,
};

export function useSuppliers() {
  return useQuery({
    queryKey: supplierKeys.list(),
    queryFn: () => supplierService.listSuppliers(),
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierService.getSupplier(id),
    enabled: Boolean(id),
  });
}

export function useSupplierCategories() {
  return useQuery({
    queryKey: supplierKeys.categories(),
    queryFn: () => supplierService.listCategories(),
    staleTime: Infinity,
  });
}

export function useSupplierCountries() {
  return useQuery({
    queryKey: supplierKeys.countries(),
    queryFn: () => supplierService.listCountries(),
    staleTime: Infinity,
  });
}

function useInvalidateSuppliers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: supplierKeys.all });
  };
}

export function useCreateSupplier() {
  const invalidate = useInvalidateSuppliers();
  return useMutation({
    mutationFn: (input: {
      name: string;
      country: string;
      categories: string[];
      taxId: string;
    }) => supplierService.createSupplier(input),
    onSuccess: invalidate,
  });
}

export function useSetSupplierStatus() {
  const invalidate = useInvalidateSuppliers();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SupplierStatus }) =>
      supplierService.setStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useAddSupplierDocument() {
  const invalidate = useInvalidateSuppliers();
  return useMutation({
    mutationFn: ({
      id,
      document,
    }: {
      id: string;
      document: Omit<SupplierDocument, "id">;
    }) => supplierService.addDocument(id, document),
    onSuccess: invalidate,
  });
}
