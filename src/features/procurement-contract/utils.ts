export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    value
  );
}

export function expiryTone(contract: {
  status: string;
  endDate: string;
}): "default" | "secondary" | "destructive" {
  if (contract.status === "Expired" || contract.status === "Terminated")
    return "destructive";
  const days = Math.ceil(
    (new Date(contract.endDate).getTime() - Date.now()) / 86_400_000
  );
  if (days <= 30) return "destructive";
  if (days <= 90) return "secondary";
  return "default";
}
