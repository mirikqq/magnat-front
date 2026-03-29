import type {
  AuthMeOut,
  FullfillItemRead,
  FullfillListItemRead,
  OrderItemRead,
  OrderListItemRead,
  RecalcLaunchOut,
  RecalcStatusOut,
  SupplierRead,
  WarehouseSettingRead,
} from '@/openapi-gen'

export type ID = number

export type UserDto = AuthMeOut
export type SupplierDto = SupplierRead
export type WarehouseSettingDto = WarehouseSettingRead
export type OrderDto = OrderListItemRead
export type OrderItemDto = OrderItemRead
export type FullfillDto = FullfillListItemRead
export type FullfillItemDto = FullfillItemRead

export interface ObservableDto {
  id: ID
  supplier_id: ID
  supplier_name?: string
  name: string
  price: number | string | null
  min_count?: number
  in_our_stock?: number
  in_way?: number
  cabinet_id?: ID
}

export interface SupplyDemandRowDto {
  item_id?: ID
  observable_id: ID
  observable_name: string
  supplier_id: ID
  supplier_name: string
  product_sku: number
  offer_id?: string | null
  packing: number
  min_count: number
  price: number | string | null
  total_need: number
  in_our_stock: number
  stock_reserve: number
  need?: number | null
  needmin?: number | null
  warehouses: Array<{
    warehouse_name: string
    needed: number
    visible: boolean
  }>
}

export interface RecalcRunDto extends RecalcLaunchOut {
  runId?: string
}

export interface RecalcStatusDto extends RecalcStatusOut {
  runId?: string
  message?: string
}
