import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { authModule } from '@/modules/auth'
import { useAuthStore } from '@/modules/auth/model/use-auth-store'
import { neededModule } from '@/modules/needed'
import { ordersModule } from '@/modules/orders'
import { inwayModule } from '@/modules/inway'
import { fullfillStockModule } from '@/modules/fullfill-stock'
import { fullfillModule } from '@/modules/fullfill'
import { suppliersModule } from '@/modules/suppliers'
import { warehousesModule } from '@/modules/warehouses'
import { observablesModule } from '@/modules/observables'
import { requiredModule } from '@/modules/required'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authModule.routes,
    {
      path: '/',
      component: BaseLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/needed' },
        ...neededModule.routes,
        ...ordersModule.routes,
        ...inwayModule.routes,
        ...fullfillStockModule.routes,
        ...fullfillModule.routes,
        ...suppliersModule.routes,
        ...warehousesModule.routes,
        ...observablesModule.routes,
        ...requiredModule.routes,
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404Page',
      meta: { public: true },
      component: NotFoundView,
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.bootstrap()
  }

  const isPublic = Boolean(to.meta.public)

  if (!isPublic && !authStore.isAuthorized) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.path === '/login' && authStore.isAuthorized) {
    return '/needed'
  }

  return true
})

export default router