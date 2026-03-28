import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { observablesService } from '@/shared/api/services/observables';

export function useInwayQuery() {
  return useAppQuery({ key: queryKeys.inway, query: () => observablesService.inway() });
}
