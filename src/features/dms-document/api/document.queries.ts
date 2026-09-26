import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentService } from "../mock/service";
import type { DocumentFormInput } from "../schemas/document.schemas";

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: () => [...documentKeys.lists()] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  categories: () => [...documentKeys.all, "categories"] as const,
};

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => documentService.listDocuments(),
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentService.getDocument(id),
    enabled: Boolean(id),
  });
}

export function useDocumentCategories() {
  return useQuery({
    queryKey: documentKeys.categories(),
    queryFn: () => documentService.listCategories(),
    staleTime: Infinity,
  });
}

function useInvalidateDocuments() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: documentKeys.all });
  };
}

export function useCreateDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: (input: DocumentFormInput) => documentService.createDocument(input),
    onSuccess: invalidate,
  });
}

export function useUpdateDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DocumentFormInput }) =>
      documentService.updateDocument(id, input),
    onSuccess: invalidate,
  });
}

export function useUploadVersion() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: ({
      id,
      file,
      summary,
    }: {
      id: string;
      file: { name: string; size: number };
      summary: string;
    }) => documentService.uploadVersion(id, file, summary),
    onSuccess: invalidate,
  });
}

export function useDeleteDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: invalidate,
  });
}

export function useDeleteDocumentForever() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: (id: string) => documentService.deleteForever(id),
    onSuccess: invalidate,
  });
}

export function useArchiveDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: (id: string) => documentService.archiveDocument(id),
    onSuccess: invalidate,
  });
}

export function useRestoreDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: (id: string) => documentService.restoreDocument(id),
    onSuccess: invalidate,
  });
}

export function useShareDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: ({ id, emails }: { id: string; emails: string[] }) =>
      documentService.shareDocument(id, emails),
    onSuccess: invalidate,
  });
}

export function useUnshareDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      documentService.unshareDocument(id, email),
    onSuccess: invalidate,
  });
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: (id: string) => documentService.downloadContent(id),
  });
}