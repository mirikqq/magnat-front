import type {
  FullfillDto,
  FullfillItemDto,
  ObservableDto,
  OrderDto,
  OrderItemDto,
  RecalcRunDto,
  RecalcStatusDto,
  SupplierDto,
  SupplyDemandRowDto,
  UserDto,
  WarehouseSettingDto,
} from './domain';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export type MeResponse = UserDto;

export type SupplyDemandResponse = SupplyDemandRowDto[];

export interface StockVisibilityRequest {
  product_sku: number;
  warehouse_name: string;
  visible: boolean;
}

export interface UpdateOrderRequest {
  items: Array<{ id: number; additional: number }>;
}

export interface CreateOrderRequest {
  observable_ids: number[];
}

export interface InWayUpdateRequest {
  values: Array<{ id: number; in_way: number }>;
}

export interface StockUpdateRequest {
  values: Array<{ id: number; add: number }>;
}

export interface FullfillUpdateRequest {
  items: Array<{ id: number; qty: number; stock: Record<string, number> }>;
}

export interface FullfillDeliveryRequest {
  warehouses: Array<{ warehouse_name: string; in_delivery: boolean }>;
}

export interface SupplierUpsertRequest {
  name: string;
}

export interface WarehousesUpdateRequest {
  warehouses: WarehouseSettingDto[];
}

export interface ObservableUpsertRequest {
  supplier_id: number;
  name: string;
  price: number;
  min_count: number;
}

export type OrdersResponse = OrderDto[];
export type OrderResponse = OrderDto & { items: OrderItemDto[] };
export type InWayResponse = ObservableDto[];
export type FullfillStockResponse = ObservableDto[];
export type FullfillResponse = FullfillDto[];
export type FullfillDetailResponse = FullfillDto & { items: FullfillItemDto[] };
export type SuppliersResponse = SupplierDto[];
export type WarehousesResponse = WarehouseSettingDto[];
export type ObservablesResponse = ObservableDto[];
export type RecalculateResponse = RecalcRunDto;
export type RecalculateStatusResponse = RecalcStatusDto;
