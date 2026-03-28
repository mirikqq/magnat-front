import type { RouteRecordRaw } from 'vue-router';

export const neededRoutes: RouteRecordRaw[] = [
  { path: '/needed', component: () => import('./ui/NeededView.vue') },
];
