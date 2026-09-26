import { useQuery } from "@tanstack/react-query";
import { contractService } from "@/features/procurement-contract/mock/service";
import { deliveryService } from "@/features/procurement-delivery/mock/service";
import { planService } from "@/features/procurement-plan/mock/service";
import { requisitionService } from "@/features/procurement-requisition/mock/service";
import { supplierService } from "@/features/procurement-supplier/mock/service";
import { tenderService } from "@/features/procurement-tender/mock/service";

export const analyticsKeys = {
  all: ["procurement-analytics"] as const,
  summary: () => [...analyticsKeys.all, "summary"] as const,
};

export interface CategorySpend {
  name: string;
  value: number;
}

export interface ProcurementSummary {
  totalSpend: number;
  spendByDepartment: CategorySpend[];
  spendBySupplier: CategorySpend[];
  spendByCategory: CategorySpend[];
  avgCycleDays: number;
  prCount: number;
  tenderCount: number;
  awardedTenderValue: number;
  supplierCount: number;
  expiringContracts: number;
  deliveriesForMonth: number;
}

export function useProcurementSummary() {
  return useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: async (): Promise<ProcurementSummary> => {
      const [plans, requisitions, tenders, contracts, suppliers, deliveries] =
        await Promise.all([
          planService.listPlans(),
          requisitionService.listRequisitions(),
          tenderService.listTenders(),
          contractService.listContracts(),
          supplierService.listSuppliers(),
          deliveryService.listDeliveries(),
        ]);

      const activeContracts = contracts.filter((c) => c.status === "Active");

      const expiringSoon = activeContracts.filter((c) => {
        const days = Math.ceil(
          (new Date(c.endDate).getTime() - Date.now()) / 86_400_000
        );
        return days <= 90 && days >= 0;
      });

      return {
        totalSpend: activeContracts.reduce((sum, c) => sum + c.value, 0),
        spendByDepartment: aggregate(
          plans,
          (p) => p.department,
          (p) => p.estimatedCost
        ),
        spendBySupplier: aggregate(
          activeContracts,
          (c) => c.supplier,
          (c) => c.value
        ),
        spendByCategory: aggregate(
          requisitions,
          (pr) => pr.category,
          (pr) => pr.total
        ),
        avgCycleDays: 14,
        prCount: requisitions.length,
        tenderCount: tenders.length,
        awardedTenderValue: tenders.reduce(
          (sum, t) =>
            sum + (t.bids.find((b) => b.status === "Awarded")?.amount ?? 0),
          0
        ),
        supplierCount: suppliers.filter((s) => s.status === "Active").length,
        expiringContracts: expiringSoon.length,
        deliveriesForMonth: deliveries.filter((d) =>
          ["Shipped", "Received", "Partially Received", "Confirmed"].includes(
            d.status
          )
        ).length,
      };
    },
  });
}

function aggregate<T>(
  rows: T[],
  key: (row: T) => string,
  value: (row: T) => number
): CategorySpend[] {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    const k = key(row);
    map.set(k, (map.get(k) ?? 0) + value(row));
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}
