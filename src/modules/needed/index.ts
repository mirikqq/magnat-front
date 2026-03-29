import type { RouteRecordRaw } from 'vue-router'

export const neededModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '',
      redirect: '/needed',
    },
    {
      path: '/needed',
      name: 'Needed',
      component: () => import('./pages/NeededPage.vue'),
    },
  ],
}
