import type { FullfillDto, ObservableDto, OrderDto, OrderItemDto, SupplierDto, SupplyDemandRowDto, WarehouseSettingDto } from '@/shared/api/contracts/domain';

const now = new Date().toISOString();

export const suppliers: SupplierDto[] = [
  { id: 1, name: 'Поставщик 1', cabinet_id: 1 },
  { id: 2, name: 'Поставщик 2', cabinet_id: 1 },
];

export const observables: ObservableDto[] = [
  { id: 1, supplier_id: 1, name: 'Товар A', price: 190, min_count: 10, in_our_stock: 100, in_way: 20, cabinet_id: 1 },
  { id: 2, supplier_id: 2, name: 'Товар B', price: 250, min_count: 5, in_our_stock: 40, in_way: 12, cabinet_id: 1 },
];

export const warehouses: WarehouseSettingDto[] = [
  { id: 1, warehouse_name: 'Москва', short_name: 'МСК', priority: 1, visible: true, period_stock: 30, period_delivery: 10, mp: 'ozon', cabinet_id: 1 },
  { id: 2, warehouse_name: 'СПБ', short_name: 'СПБ', priority: 2, visible: true, period_stock: 30, period_delivery: 10, mp: 'ozon', cabinet_id: 1 },
];

export const supplyDemand: SupplyDemandRowDto[] = [
  {
    observable_id: 1,
    observable_name: 'Товар A',
    supplier_id: 1,
    supplier_name: 'Поставщик 1',
    product_sku: 101,
    offer_id: 'OF-101',
    packing: 1,
    min_count: 10,
    price: 190,
    total_need: 92,
    in_our_stock: 100,
    stock_reserve: 20,
    warehouses: [
      { warehouse_name: 'Москва', needed: 55, visible: true },
      { warehouse_name: 'СПБ', needed: 37, visible: true },
    ],
  },
  {
    observable_id: 2,
    observable_name: 'Товар B',
    supplier_id: 2,
    supplier_name: 'Поставщик 2',
    product_sku: 202,
    offer_id: 'OF-202',
    packing: 1,
    min_count: 5,
    price: 250,
    total_need: 43,
    in_our_stock: 40,
    stock_reserve: 10,
    warehouses: [
      { warehouse_name: 'Москва', needed: 20, visible: true },
      { warehouse_name: 'СПБ', needed: 23, visible: true },
    ],
  },
];

export const orders: OrderDto[] = [{ id: 1, is_approved: false, created_at: now, updated_at: now }];

export const orderItems: OrderItemDto[] = [
  { id: 1, order_id: 1, observable_id: 1, supplier_id: 1, name: 'Товар A', min_count: 10, needed: 92, additional: 0, price: 190 },
  { id: 2, order_id: 1, observable_id: 2, supplier_id: 2, name: 'Товар B', min_count: 5, needed: 43, additional: 0, price: 250 },
];

export const fullfills: FullfillDto[] = [{ id: 1, mp: 'ozon', is_approved: false, liters: 0, boxes: 0, pallets: 0, created_at: now, updated_at: now }];
