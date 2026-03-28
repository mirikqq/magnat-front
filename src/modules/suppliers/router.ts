import type { RouteRecordRaw } from 'vue-router';

export const suppliersRoutes: RouteRecordRaw[] = [
  { path: '/suppliers', component: () => import('./ui/SuppliersListView.vue') },
  { path: '/suppliers/:id', component: () => import('./ui/SupplierEditorView.vue') },
];
