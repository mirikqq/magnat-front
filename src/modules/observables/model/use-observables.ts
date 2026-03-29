import { computed } from 'vue';
import { useAppQuery } from '@/shared/composables/useAppQuery';

export function useObservablesQuery(search = '') {
  return useAppQuery({
    key: computed(() => ['observables-unavailable', search]),
    query: async () => [],
  });
}

