import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { warehousesService } from '@/modules/warehouses/api/warehouses.service';

export function useWarehousesQuery() {
  return useAppQuery({ key: queryKeys.warehouses('ozon'), query: () => warehousesService.list('ozon') });
}


