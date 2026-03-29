import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { observablesService } from '@/modules/observables/api/observables.service';

export function useFullfillStockQuery() {
  return useAppQuery({ key: queryKeys.fullfillstock, query: () => observablesService.stock() });
}


