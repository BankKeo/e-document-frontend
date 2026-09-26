import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hardwareService } from "../mock/service";

export const hardwareKeys = {
  all: ["hardware"] as const,
  devices: () => [...hardwareKeys.all, "devices"] as const,
  labels: () => [...hardwareKeys.all, "labels"] as const,
};

export function useHardwareDevices() {
  return useQuery({
    queryKey: hardwareKeys.devices(),
    queryFn: () => hardwareService.listDevices(),
  });
}

export function useGeneratedLabels() {
  return useQuery({
    queryKey: hardwareKeys.labels(),
    queryFn: () => hardwareService.listLabels(),
  });
}

export function useGenerateLabel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      type: "Barcode" | "QR";
      target: string;
      code: string;
    }) => hardwareService.generateLabel(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: hardwareKeys.all }),
  });
}

export function usePrintLabel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => hardwareService.printLabel(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: hardwareKeys.labels() }),
  });
}

export function useToggleDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hardwareService.toggleDevice(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: hardwareKeys.all }),
  });
}
