import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { ordersService } from '@/modules/orders/api/orders.service';

export function useOrdersListQuery() {
  return useAppQuery({ key: queryKeys.orders, query: () => ordersService.list() });
}


