import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenderService } from "../mock/service";
import type { TenderStatus } from "../types";

export const tenderKeys = {
  all: ["tenders"] as const,
  lists: () => [...tenderKeys.all, "list"] as const,
  list: () => [...tenderKeys.lists()] as const,
  details: () => [...tenderKeys.all, "detail"] as const,
  detail: (id: string) => [...tenderKeys.details(), id] as const,
  categories: () => [...tenderKeys.all, "categories"] as const,
};

export function useTenders() {
  return useQuery({
    queryKey: tenderKeys.list(),
    queryFn: () => tenderService.listTenders(),
  });
}

export function useTender(id: string) {
  return useQuery({
    queryKey: tenderKeys.detail(id),
    queryFn: () => tenderService.getTender(id),
    enabled: Boolean(id),
  });
}

export function useTenderCategories() {
  return useQuery({
    queryKey: tenderKeys.categories(),
    queryFn: () => tenderService.listCategories(),
    staleTime: Infinity,
  });
}

function useInvalidateTenders() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: tenderKeys.all });
  };
}

export function useCreateTender() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: (input: {
      title: string;
      category: string;
      description: string;
      estimatedValue: number;
    }) => tenderService.createTender(input),
    onSuccess: invalidate,
  });
}

export function usePublishTender() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: (id: string) => tenderService.publishTender(id),
    onSuccess: invalidate,
  });
}

export function useSubmitBid() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: ({
      id,
      supplier,
      amount,
    }: {
      id: string;
      supplier: string;
      amount: number;
    }) => tenderService.submitBid(id, supplier, amount),
    onSuccess: invalidate,
  });
}

export function useScoreBid() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: ({
      id,
      bidId,
      technicalScore,
      financialScore,
    }: {
      id: string;
      bidId: string;
      technicalScore: number;
      financialScore: number;
    }) => tenderService.scoreBid(id, bidId, technicalScore, financialScore),
    onSuccess: invalidate,
  });
}

export function useAwardTender() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: ({ id, bidId }: { id: string; bidId: string }) =>
      tenderService.awardTender(id, bidId),
    onSuccess: invalidate,
  });
}

export function useCancelTender() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: (id: string) => tenderService.cancelTender(id),
    onSuccess: invalidate,
  });
}

export function useSetTenderStatus() {
  const invalidate = useInvalidateTenders();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TenderStatus }) =>
      tenderService.setStatus(id, status),
    onSuccess: invalidate,
  });
}
