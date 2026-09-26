import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formService } from "../mock/service";
import type { EFormField, FormFieldType } from "../types";

export const formKeys = {
  all: ["forms"] as const,
  lists: () => [...formKeys.all, "list"] as const,
  list: () => [...formKeys.lists()] as const,
  details: () => [...formKeys.all, "detail"] as const,
  detail: (id: string) => [...formKeys.details(), id] as const,
};

export function useForms() {
  return useQuery({
    queryKey: formKeys.list(),
    queryFn: () => formService.listForms(),
  });
}

export function useForm(id: string) {
  return useQuery({
    queryKey: formKeys.detail(id),
    queryFn: () => formService.getForm(id),
    enabled: Boolean(id),
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      name: string;
      description?: string;
      category: string;
      fields: { type: FormFieldType; label: string; required: boolean }[];
    }) => formService.createForm(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: formKeys.all }),
  });
}

export function useUpdateFormFields() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: EFormField[] }) =>
      formService.updateFields(id, fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: formKeys.all }),
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formService.deleteForm(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: formKeys.all }),
  });
}

export function usePublishForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formService.publishForm(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: formKeys.all }),
  });
}

export function useSubmitForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Record<string, string>;
    }) => formService.submitForm(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: formKeys.all }),
  });
}
