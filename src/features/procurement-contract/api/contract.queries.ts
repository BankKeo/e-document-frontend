import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contractService } from "../mock/service";
import type { ContractStatus } from "../types";

export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: () => [...contractKeys.lists()] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  types: () => [...contractKeys.all, "types"] as const,
};

export function useContracts() {
  return useQuery({
    queryKey: contractKeys.list(),
    queryFn: () => contractService.listContracts(),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractService.getContract(id),
    enabled: Boolean(id),
  });
}

export function useContractTypes() {
  return useQuery({
    queryKey: contractKeys.types(),
    queryFn: () => contractService.listTypes(),
    staleTime: Infinity,
  });
}

function useInvalidateContracts() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: contractKeys.all });
  };
}

export function useCreateContract() {
  const invalidate = useInvalidateContracts();
  return useMutation({
    mutationFn: (input: {
      title: string;
      type: string;
      supplier: string;
      value: number;
      startDate: string;
      endDate: string;
    }) => contractService.createContract(input),
    onSuccess: invalidate,
  });
}

export function useSetContractStatus() {
  const invalidate = useInvalidateContracts();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContractStatus }) =>
      contractService.setStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useSignContract() {
  const invalidate = useInvalidateContracts();
  return useMutation({
    mutationFn: (id: string) => contractService.signContract(id),
    onSuccess: invalidate,
  });
}

export function useCreateContractVersion() {
  const invalidate = useInvalidateContracts();
  return useMutation({
    mutationFn: ({ id, summary }: { id: string; summary: string }) =>
      contractService.createVersion(id, summary),
    onSuccess: invalidate,
  });
}

export function useAddContractAmendment() {
  const invalidate = useInvalidateContracts();
  return useMutation({
    mutationFn: ({
      id,
      title,
      note,
    }: {
      id: string;
      title: string;
      note: string;
    }) => contractService.addAmendment(id, title, note),
    onSuccess: invalidate,
  });
}

export function useTerminateContract() {
  const invalidate = useInvalidateContracts();
  return useMutation({
    mutationFn: (id: string) => contractService.terminateContract(id),
    onSuccess: invalidate,
  });
}
