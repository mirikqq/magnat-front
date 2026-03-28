import type { RouteRecordRaw } from 'vue-router';

export const fullfillStockRoutes: RouteRecordRaw[] = [
  { path: '/fullfillstock', component: () => import('./ui/FullfillStockView.vue') },
];
