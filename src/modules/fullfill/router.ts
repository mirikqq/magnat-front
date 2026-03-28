import type { RouteRecordRaw } from 'vue-router';

export const fullfillRoutes: RouteRecordRaw[] = [
  { path: '/fullfill', component: () => import('./ui/FullfillListView.vue') },
  { path: '/fullfill/new', component: () => import('./ui/FullfillEditorView.vue') },
  { path: '/fullfill/:id', component: () => import('./ui/FullfillEditorView.vue') },
];
