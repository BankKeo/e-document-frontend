import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetService } from "../mock/service";
import type { AssetCategory, AssetStatus } from "../types";

export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  list: () => [...assetKeys.lists()] as const,
  details: () => [...assetKeys.all, "detail"] as const,
  detail: (id: string) => [...assetKeys.details(), id] as const,
};

export function useAssets() {
  return useQuery({
    queryKey: assetKeys.list(),
    queryFn: () => assetService.listAssets(),
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: () => assetService.getAsset(id),
    enabled: Boolean(id),
  });
}

function useInvalidateAssets() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: assetKeys.all });
  };
}

export function useCreateAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (input: {
      name: string;
      category: AssetCategory;
      location: string;
      custodian: string;
      purchaseValue: number;
      depreciationRate: number;
    }) => assetService.createAsset(input),
    onSuccess: invalidate,
  });
}

export function useAssignAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: ({
      id,
      custodian,
      location,
    }: {
      id: string;
      custodian: string;
      location?: string;
    }) => assetService.assignAsset(id, custodian, location),
    onSuccess: invalidate,
  });
}

export function useRecordMaintenance() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      assetService.recordMaintenance(id, note),
    onSuccess: invalidate,
  });
}

export function useDisposeAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: (id: string) => assetService.disposeAsset(id),
    onSuccess: invalidate,
  });
}

export function useSetAssetStatus() {
  const invalidate = useInvalidateAssets();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AssetStatus }) =>
      assetService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
