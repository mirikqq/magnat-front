import type { RouteRecordRaw } from 'vue-router'

export const inwayModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/inway',
      name: 'InWay',
      component: () => import('./pages/InWayPage.vue'),
    },
  ],
}
