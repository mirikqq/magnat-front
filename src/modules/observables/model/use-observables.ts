import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { observablesService } from '@/shared/api/services/observables';

export function useObservablesQuery(search = '') {
  return useAppQuery({ key: queryKeys.observables(search), query: () => observablesService.list(search) });
}
