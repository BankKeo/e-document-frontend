import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "@/features/dms-document/api/document.queries";
import { versioningService } from "../mock/service";

export const versioningKeys = {
  all: ["versioning"] as const,
  registry: () => [...versioningKeys.all, "registry"] as const,
  documents: () => [...versioningKeys.all, "documents"] as const,
};

export function useVersionRegistry() {
  return useQuery({
    queryKey: versioningKeys.registry(),
    queryFn: () => versioningService.listVersionRegistry(),
  });
}

export function useVersioningDocuments() {
  return useQuery({
    queryKey: versioningKeys.documents(),
    queryFn: () => versioningService.listDocuments(),
  });
}

function useInvalidateVersioning() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: versioningKeys.all });
    // Documents list shares the same mock store; keep both in sync.
    queryClient.invalidateQueries({ queryKey: documentKeys.all });
  };
}

export function useCreateVersion() {
  const invalidate = useInvalidateVersioning();
  return useMutation({
    mutationFn: ({
      id,
      file,
      summary,
    }: {
      id: string;
      file: { name: string; size: number };
      summary: string;
    }) => versioningService.createVersion(id, file, summary),
    onSuccess: invalidate,
  });
}

export function useCompareVersions(
  id: string,
  leftId: string,
  rightId: string
) {
  return useQuery({
    queryKey: [...versioningKeys.all, "compare", id, leftId, rightId] as const,
    queryFn: () => versioningService.compareVersions(id, leftId, rightId),
    enabled: Boolean(id) && Boolean(leftId) && Boolean(rightId),
  });
}

export function useRestoreVersion() {
  const invalidate = useInvalidateVersioning();
  return useMutation({
    mutationFn: ({ id, versionId }: { id: string; versionId: string }) =>
      versioningService.restoreVersion(id, versionId),
    onSuccess: invalidate,
  });
}
