import type { RouteRecordRaw } from 'vue-router'

export const requiredModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/required',
      name: 'Required',
      component: () => import('./pages/RequiredPage.vue'),
    },
  ],
}
