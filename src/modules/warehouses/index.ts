import type { RouteRecordRaw } from 'vue-router'

export const warehousesModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/warehouses/ozon',
      name: 'Warehouses',
      component: () => import('./pages/WarehousesPage.vue'),
    },
  ],
}
