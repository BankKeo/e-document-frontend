import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { captureService } from "../mock/service";
import type { ExtractedField } from "../types";

export const captureKeys = {
  all: ["capture"] as const,
  documents: () => [...captureKeys.all, "documents"] as const,
  document: (id: string) => [...captureKeys.documents(), id] as const,
  runs: () => [...captureKeys.all, "runs"] as const,
};

export function useCaptureDocuments() {
  return useQuery({
    queryKey: captureKeys.documents(),
    queryFn: () => captureService.listDocuments(),
  });
}

export function useCaptureDocument(id: string) {
  return useQuery({
    queryKey: captureKeys.document(id),
    queryFn: () => captureService.getDocument(id),
    enabled: Boolean(id),
  });
}

export function useCaptureRuns() {
  return useQuery({
    queryKey: captureKeys.runs(),
    queryFn: () => captureService.listRuns(),
    staleTime: Infinity,
  });
}

function useInvalidateCapture() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: captureKeys.all });
  };
}

export function useUploadCaptureDocument() {
  const invalidate = useInvalidateCapture();
  return useMutation({
    mutationFn: (file: { name: string; size: number }) =>
      captureService.uploadDocument(file),
    onSuccess: invalidate,
  });
}

export function useRunOcr() {
  const invalidate = useInvalidateCapture();
  return useMutation({
    mutationFn: (id: string) => captureService.runOcr(id),
    onSuccess: invalidate,
  });
}

export function useClassifyDocument() {
  const invalidate = useInvalidateCapture();
  return useMutation({
    mutationFn: ({
      id,
      classification,
    }: {
      id: string;
      classification: string;
    }) => captureService.classifyDocument(id, classification),
    onSuccess: invalidate,
  });
}

export function useSaveCaptureFields() {
  const invalidate = useInvalidateCapture();
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: ExtractedField[] }) =>
      captureService.saveFields(id, fields),
    onSuccess: invalidate,
  });
}
