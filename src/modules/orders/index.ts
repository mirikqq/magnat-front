import type { RouteRecordRaw } from 'vue-router'

export const ordersModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('./pages/OrdersListPage.vue'),
    },
    {
      path: '/orders/new',
      name: 'OrderCreate',
      component: () => import('./pages/OrderEditorPage.vue'),
    },
    {
      path: '/orders/:id',
      name: 'Order',
      component: () => import('./pages/OrderEditorPage.vue'),
    },
  ],
}
