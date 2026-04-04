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
      redirect: '/suppliers?mode=create',
    },
    {
      path: '/suppliers/:id',
      redirect: (to) => `/suppliers?edit=${to.params.id}`,
    },
  ],
}