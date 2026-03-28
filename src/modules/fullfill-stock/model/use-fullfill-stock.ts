import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { observablesService } from '@/shared/api/services/observables';

export function useFullfillStockQuery() {
  return useAppQuery({ key: queryKeys.fullfillstock, query: () => observablesService.stock() });
}
