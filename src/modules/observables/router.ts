import type { RouteRecordRaw } from 'vue-router';

export const observablesRoutes: RouteRecordRaw[] = [
  { path: '/item_settings', component: () => import('./ui/ItemSettingsView.vue') },
  { path: '/observable/new', component: () => import('./ui/ObservableEditorView.vue') },
  { path: '/observable/:id', component: () => import('./ui/ObservableEditorView.vue') },
];
