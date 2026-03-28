import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { warehousesService } from '@/shared/api/services/warehouses';

export function useWarehousesQuery() {
  return useAppQuery({ key: queryKeys.warehouses('ozon'), query: () => warehousesService.list('ozon') });
}
