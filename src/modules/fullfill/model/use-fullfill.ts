import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { fullfillService } from '@/shared/api/services/fullfill';

export function useFullfillListQuery() {
  return useAppQuery({ key: queryKeys.fullfill, query: () => fullfillService.list() });
}
