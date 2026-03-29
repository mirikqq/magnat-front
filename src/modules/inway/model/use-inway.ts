import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { observablesService } from '@/modules/observables/api/observables.service';

export function useInwayQuery() {
  return useAppQuery({ key: queryKeys.inway, query: () => observablesService.inway() });
}


