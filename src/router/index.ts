import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'
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
    {
      path: '/',
      component: BaseLayout,
      children: [
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
      component: NotFoundView,
    },
  ],
})

export default router
