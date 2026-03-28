import type { RouteRecordRaw } from 'vue-router';

export const analyticsRoutes: RouteRecordRaw[] = [
  { path: '/analytics', component: () => import('./ui/AnalyticsView.vue') },
];
