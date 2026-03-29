import type { RouteRecordRaw } from 'vue-router'

export const observablesModule: { routes: RouteRecordRaw[] } = {
  routes: [
    {
      path: '/item_settings',
      name: 'ItemSettings',
      component: () => import('./pages/ItemSettingsPage.vue'),
    },
    {
      path: '/observable/new',
      name: 'ObservableCreate',
      component: () => import('./pages/ObservableEditorPage.vue'),
    },
    {
      path: '/observable/:id',
      name: 'Observable',
      component: () => import('./pages/ObservableEditorPage.vue'),
    },
  ],
}
