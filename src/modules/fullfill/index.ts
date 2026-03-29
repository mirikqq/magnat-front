import type { RouteRecordRaw } from 'vue-router'

export const fullfillModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/fullfill',
      name: 'Fullfill',
      component: () => import('./pages/FullfillListPage.vue'),
    },
    {
      path: '/fullfill/new',
      name: 'FullfillCreate',
      component: () => import('./pages/FullfillEditorPage.vue'),
    },
    {
      path: '/fullfill/:id',
      name: 'FullfillEdit',
      component: () => import('./pages/FullfillEditorPage.vue'),
    },
  ],
}
