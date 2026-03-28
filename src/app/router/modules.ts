import type { RouteRecordRaw } from 'vue-router';

import { neededRoutes } from '@/modules/needed/router';
import { ordersRoutes } from '@/modules/orders/router';
import { inwayRoutes } from '@/modules/inway/router';
import { fullfillStockRoutes } from '@/modules/fullfill-stock/router';
import { fullfillRoutes } from '@/modules/fullfill/router';
import { suppliersRoutes } from '@/modules/suppliers/router';
import { warehousesRoutes } from '@/modules/warehouses/router';
import { observablesRoutes } from '@/modules/observables/router';
import { requiredRoutes } from '@/modules/required/router';
import { analyticsRoutes } from '@/modules/analytics/router';

export const moduleRoutes: RouteRecordRaw[] = [
  ...neededRoutes,
  ...ordersRoutes,
  ...inwayRoutes,
  ...fullfillStockRoutes,
  ...fullfillRoutes,
  ...suppliersRoutes,
  ...warehousesRoutes,
  ...observablesRoutes,
  ...requiredRoutes,
  ...analyticsRoutes,
];
