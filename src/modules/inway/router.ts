import type { RouteRecordRaw } from 'vue-router';

export const inwayRoutes: RouteRecordRaw[] = [
  { path: '/inway', component: () => import('./ui/InWayView.vue') },
];
