import type { RouteRecordRaw } from 'vue-router'

export const fullfillStockModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/fullfillstock',
      name: 'FullfillStock',
      component: () => import('./pages/FullfillStockPage.vue'),
    },
  ],
}
