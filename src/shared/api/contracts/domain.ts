export type ID = number;

export interface UserDto {
  id: ID;
  phone: string;
  fio: string | null;
  role: 'admin';
  cabinet_id: ID;
}

export interface SupplierDto {
  id: ID;
  name: string;
  cabinet_id: ID;
}

export interface ObservableDto {
  id: ID;
  supplier_id: ID;
  name: string;
  price: number;
  min_count: number;
  in_our_stock: number;
  in_way: number;
  cabinet_id: ID;
}

export interface WarehouseSettingDto {
  id: ID;
  warehouse_name: string;
  short_name: string;
  priority: number;
  visible: boolean;
  period_stock: number;
  period_delivery: number;
  mp: 'ozon' | 'wb';
  cabinet_id: ID;
}

export interface SupplyDemandRowDto {
  observable_id: ID;
  observable_name: string;
  supplier_id: ID;
  supplier_name: string;
  product_sku: number;
  offer_id: string;
  packing: number;
  min_count: number;
  price: number;
  total_need: number;
  in_our_stock: number;
  stock_reserve: number;
  warehouses: Array<{
    warehouse_name: string;
    needed: number;
    visible: boolean;
  }>;
}

export interface OrderDto {
  id: ID;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItemDto {
  id: ID;
  order_id: ID;
  observable_id: ID;
  supplier_id: ID;
  name: string;
  min_count: number;
  needed: number;
  additional: number;
  price: number;
}

export interface FullfillDto {
  id: ID;
  mp: 'ozon' | 'wb';
  is_approved: boolean;
  liters: number;
  boxes: number;
  pallets: number;
  created_at: string;
  updated_at: string;
}

export interface FullfillItemDto {
  id: ID;
  fullfill_id: ID;
  observable_item_id: ID;
  qty: number;
  stock: Record<string, number>;
}

export interface RecalcRunDto {
  runId: string;
}

export interface RecalcStatusDto {
  runId: string;
  status: 'running' | 'success' | 'error';
  message?: string;
}
