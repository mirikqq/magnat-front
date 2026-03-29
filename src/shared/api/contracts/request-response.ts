import type {
  AuthLoginIn,
  AuthTokenOut,
  FullfillCreateIn,
  FullfillItemUpsertIn,
  FullfillRead,
  ObservableInWayUpdate,
  ObservableStockAdd,
  OrderCreateIn,
  OrderRead,
  OrderUpdateIn,
  StockVisibilitySetIn,
  SupplierCreate,
  SupplierRead,
  SupplierUpdate,
  WarehouseSettingUpdate,
} from '@/openapi-gen'
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
} from './domain'

export type LoginRequest = AuthLoginIn
export type LoginResponse = AuthTokenOut
export type MeResponse = UserDto
export type SupplyDemandResponse = SupplyDemandRowDto[]
export type StockVisibilityRequest = StockVisibilitySetIn
export type UpdateOrderRequest = OrderUpdateIn
export type CreateOrderRequest = OrderCreateIn
export interface InWayUpdateRequest { values: ObservableInWayUpdate[] }
export interface StockUpdateRequest { values: ObservableStockAdd[] }
export type FullfillCreateRequest = FullfillCreateIn
export interface FullfillUpdateRequest { items: FullfillItemUpsertIn[] }
export interface FullfillDeliveryRequest { warehouses: Array<{ warehouse_name: string; in_delivery: boolean }> }
export type SupplierUpsertRequest = SupplierCreate | SupplierUpdate
export interface WarehousesUpdateRequest { warehouses: Array<WarehouseSettingDto | WarehouseSettingUpdate> }
export interface ObservableUpsertRequest {
  supplier_id: number
  name: string
  price: number
  min_count: number
}

export type OrdersResponse = OrderDto[]
export type OrderResponse = OrderRead & { items: OrderItemDto[] }
export type InWayResponse = ObservableDto[]
export type FullfillStockResponse = ObservableDto[]
export type FullfillResponse = FullfillDto[]
export type FullfillDetailResponse = FullfillRead & { items: FullfillItemDto[] }
export type SuppliersResponse = SupplierDto[] | { items: SupplierRead[] }
export type WarehousesResponse = WarehouseSettingDto[]
export type ObservablesResponse = ObservableDto[]
export type RecalculateResponse = RecalcRunDto
export type RecalculateStatusResponse = RecalcStatusDto
