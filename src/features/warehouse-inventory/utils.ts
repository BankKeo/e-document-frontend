export function lowStock(item: {
  currentStock: number;
  reorderPoint: number;
}): boolean {
  return item.currentStock <= item.reorderPoint;
}

export function overstock(item: {
  currentStock: number;
  maxStock: number;
}): boolean {
  return item.currentStock >= item.maxStock;
}
