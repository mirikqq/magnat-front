import type { RouteRecordRaw } from 'vue-router'

export const suppliersModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/suppliers',
      name: 'Suppliers',
      component: () => import('./pages/SuppliersListPage.vue'),
    },
    {
      path: '/suppliers/new',
      name: 'SupplierCreate',
      component: () => import('./pages/SupplierEditorPage.vue'),
    },
    {
      path: '/suppliers/:id',
      name: 'Supplier',
      component: () => import('./pages/SupplierEditorPage.vue'),
    },
  ],
}
