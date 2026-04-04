import type { RouteRecordRaw } from 'vue-router'

export const authModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: { public: true },
      component: () => import('./pages/LoginPage.vue'),
    },
  ],
}