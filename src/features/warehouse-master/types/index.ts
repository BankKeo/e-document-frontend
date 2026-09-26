export interface WarehouseZone {
  id: string;
  code: string;
  name: string;
  racks: WarehouseRack[];
}

export interface WarehouseRack {
  id: string;
  code: string;
  shelves: WarehouseShelf[];
}

export interface WarehouseShelf {
  id: string;
  code: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  capacity: number;
  used: number;
  staff: number;
  zones: WarehouseZone[];
  updatedAt: string;
}
