import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { metadataService } from "../mock/service";
import type {
  AuthorInput,
  CategoryInput,
  DocumentTypeInput,
  MetaRecordInput,
} from "../schemas/metadata.schemas";
import type { NumberingScheme } from "../types";

export const metadataKeys = {
  all: ["metadata"] as const,
  records: () => [...metadataKeys.all, "records"] as const,
  types: () => [...metadataKeys.all, "types"] as const,
  categories: () => [...metadataKeys.all, "categories"] as const,
  authors: () => [...metadataKeys.all, "authors"] as const,
  departments: () => [...metadataKeys.all, "departments"] as const,
  confidentiality: () => [...metadataKeys.all, "confidentiality"] as const,
  tags: () => [...metadataKeys.all, "tags"] as const,
  numbering: () => [...metadataKeys.all, "numbering"] as const,
};

function useInvalidate(keys: () => readonly unknown[]) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: keys() });
}

export const useMetaRecords = () =>
  useQuery({
    queryKey: metadataKeys.records(),
    queryFn: () => metadataService.listMetaRecords(),
  });

export function useUpdateMetaRecord() {
  const invalidate = useInvalidate(metadataKeys.records);
  const invalidateTags = useInvalidate(metadataKeys.tags);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MetaRecordInput }) =>
      metadataService.updateMetaRecord(id, input),
    onSuccess: () => {
      invalidate();
      invalidateTags();
    },
  });
}

export const useAuthors = () =>
  useQuery({ queryKey: metadataKeys.authors(), queryFn: () => metadataService.listAuthors() });

export function useCreateAuthor() {
  const invalidate = useInvalidate(metadataKeys.authors);
  return useMutation({
    mutationFn: (input: AuthorInput) => metadataService.createAuthor(input),
    onSuccess: invalidate,
  });
}

export function useDeleteAuthor() {
  const invalidate = useInvalidate(metadataKeys.authors);
  return useMutation({ mutationFn: (id: string) => metadataService.deleteAuthor(id), onSuccess: invalidate });
}

export const useDocumentTypes = () =>
  useQuery({ queryKey: metadataKeys.types(), queryFn: () => metadataService.listDocumentTypes() });

export function useCreateDocumentType() {
  const invalidate = useInvalidate(metadataKeys.types);
  return useMutation({
    mutationFn: (input: DocumentTypeInput) => metadataService.createDocumentType(input),
    onSuccess: invalidate,
  });
}

export function useDeleteDocumentType() {
  const invalidate = useInvalidate(metadataKeys.types);
  return useMutation({
    mutationFn: (id: string) => metadataService.deleteDocumentType(id),
    onSuccess: invalidate,
  });
}

export const useCategoriesQuery = () =>
  useQuery({ queryKey: metadataKeys.categories(), queryFn: () => metadataService.listCategories() });

export function useCreateCategory() {
  const invalidate = useInvalidate(metadataKeys.categories);
  return useMutation({
    mutationFn: (input: CategoryInput) => metadataService.createCategory(input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidate(metadataKeys.categories);
  return useMutation({
    mutationFn: (id: string) => metadataService.deleteCategory(id),
    onSuccess: invalidate,
  });
}

export const useMetadataDepartments = () =>
  useQuery({
    queryKey: metadataKeys.departments(),
    queryFn: () => metadataService.listDepartments(),
    staleTime: Infinity,
  });

export const useConfidentialityLevels = () =>
  useQuery({
    queryKey: metadataKeys.confidentiality(),
    queryFn: () => metadataService.listConfidentialityLevels(),
    staleTime: Infinity,
  });

export const useTags = () =>
  useQuery({ queryKey: metadataKeys.tags(), queryFn: () => metadataService.listTags() });

export function useAddTag() {
  const invalidate = useInvalidate(metadataKeys.tags);
  return useMutation({ mutationFn: (name: string) => metadataService.addTag(name), onSuccess: invalidate });
}

export function useDeleteTag() {
  const invalidate = useInvalidate(metadataKeys.tags);
  return useMutation({ mutationFn: (id: string) => metadataService.deleteTag(id), onSuccess: invalidate });
}

export const useNumberingScheme = () =>
  useQuery({
    queryKey: metadataKeys.numbering(),
    queryFn: () => metadataService.getNumberingScheme(),
  });

export function useSaveNumberingScheme() {
  const invalidate = useInvalidate(metadataKeys.numbering);
  return useMutation({
    mutationFn: (input: NumberingScheme) => metadataService.saveNumberingScheme(input),
    onSuccess: invalidate,
  });
}