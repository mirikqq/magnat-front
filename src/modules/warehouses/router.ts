import type { RouteRecordRaw } from 'vue-router';

export const warehousesRoutes: RouteRecordRaw[] = [
  { path: '/warehouses/ozon', component: () => import('./ui/WarehousesView.vue') },
];
