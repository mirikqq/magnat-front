import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { moduleRoutes } from './modules';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/needed' },
  ...moduleRoutes,
  { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFoundPage.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
