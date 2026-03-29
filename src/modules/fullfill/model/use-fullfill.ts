import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { fullfillService } from '@/modules/fullfill/api/fullfill.service';

export function useFullfillListQuery() {
  return useAppQuery({ key: queryKeys.fullfill, query: () => fullfillService.list() });
}


