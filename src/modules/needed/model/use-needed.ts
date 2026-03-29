import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { supplyService } from '@/modules/needed/api/supply.service';

export function useNeededDemandQuery() {
  return useAppQuery({ key: queryKeys.needed, query: () => supplyService.demand() });
}


