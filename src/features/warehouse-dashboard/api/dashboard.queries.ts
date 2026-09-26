import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/features/warehouse-inventory/mock/service";
import { warehouseService } from "@/features/warehouse-master/mock/service";
import { inboundService } from "@/features/warehouse-inbound/mock/service";
import { outboundService } from "@/features/warehouse-outbound/mock/service";
import { transferService } from "@/features/warehouse-transfer/mock/service";

export const wmsAnalyticsKeys = {
  all: ["wms-analytics"] as const,
  dashboard: () => [...wmsAnalyticsKeys.all, "dashboard"] as const,
};

export interface ForecastRow {
  sku: string;
  name: string;
  avgConsumption: number;
  demandForecast: number;
  safetyStock: number;
  reorderPoint: number;
  currentStock: number;
  daysUntilStockout: number;
  recommendation: "Order" | "Monitor" | "Ok";
}

export interface WarehouseDashboardData {
  warehouseCount: number;
  totalUnits: number;
  lowStock: number;
  overstock: number;
  inboundOpen: number;
  outboundOpen: number;
  transfersOpen: number;
  forecast: ForecastRow[];
  utilization: number;
}

export function useWarehouseDashboard() {
  return useQuery({
    queryKey: wmsAnalyticsKeys.dashboard(),
    queryFn: async (): Promise<WarehouseDashboardData> => {
      const [items, warehouses, inbound, outbound, transfers] =
        await Promise.all([
          inventoryService.listItems(),
          warehouseService.listWarehouses(),
          inboundService.listInbound(),
          outboundService.listOutbound(),
          transferService.listTransfers(),
        ]);

      // FORECAST-001…008: derive forecast from current stock and thresholds.
      const forecast: ForecastRow[] = items.map((item) => {
        const avgConsumption = Math.max(2, Math.round(item.maxStock / 12));
        const safetyStock = Math.round(item.reorderPoint * 0.5);
        const demandForecast = Math.max(
          item.minStock,
          Math.round(item.currentStock * 0.9)
        );
        const daysUntilStockout =
          item.currentStock === 0
            ? 0
            : Math.max(1, Math.round(item.currentStock / avgConsumption));
        const recommendation: ForecastRow["recommendation"] =
          item.currentStock <= item.reorderPoint
            ? "Order"
            : item.currentStock <= item.reorderPoint * 1.5
              ? "Monitor"
              : "Ok";
        return {
          sku: item.sku,
          name: item.name,
          avgConsumption,
          demandForecast,
          safetyStock,
          reorderPoint: item.reorderPoint,
          currentStock: item.currentStock,
          daysUntilStockout,
          recommendation,
        };
      });

      const warehouseCount = warehouses.length;
      const totalUnits = items.reduce(
        (sum, item) => sum + item.currentStock,
        0
      );
      const lowStock = items.filter(
        (item) => item.currentStock <= item.reorderPoint
      ).length;
      const overstock = items.filter(
        (item) => item.currentStock >= item.maxStock
      ).length;
      const inboundOpen = inbound.filter((o) =>
        ["Scheduled", "Arrived", "Inspected"].includes(o.status)
      ).length;
      const outboundOpen = outbound.filter((o) =>
        ["Requested", "Approved", "Picking", "Packed"].includes(o.status)
      ).length;
      const transfersOpen = transfers.filter(
        (t) => t.status === "In Transit"
      ).length;
      const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
      const totalUsed = warehouses.reduce((sum, w) => sum + w.used, 0);

      return {
        warehouseCount,
        totalUnits,
        lowStock,
        overstock,
        inboundOpen,
        outboundOpen,
        transfersOpen,
        forecast,
        utilization: totalCapacity
          ? Math.round((totalUsed / totalCapacity) * 100)
          : 0,
      };
    },
  });
}
