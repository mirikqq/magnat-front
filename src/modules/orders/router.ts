import type { RouteRecordRaw } from 'vue-router';

export const ordersRoutes: RouteRecordRaw[] = [
  { path: '/orders', component: () => import('./ui/OrdersListView.vue') },
  { path: '/orders/new', component: () => import('./ui/OrderEditorView.vue') },
  { path: '/orders/:id', component: () => import('./ui/OrderEditorView.vue') },
];
