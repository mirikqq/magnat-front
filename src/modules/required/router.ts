import type { RouteRecordRaw } from 'vue-router';

export const requiredRoutes: RouteRecordRaw[] = [
  { path: '/required', component: () => import('./ui/RequiredView.vue') },
];
