import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { ordersService } from '@/shared/api/services/orders';

export function useOrdersListQuery() {
  return useAppQuery({ key: queryKeys.orders, query: () => ordersService.list() });
}
