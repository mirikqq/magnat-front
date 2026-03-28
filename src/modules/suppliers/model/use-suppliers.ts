import { computed, type Ref } from 'vue';
import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { suppliersService } from '@/shared/api/services/suppliers';

export function useSuppliersQuery(search: Ref<string>) {
  return useAppQuery({
    key: computed(() => queryKeys.suppliers(search.value)),
    query: () => suppliersService.list(search.value),
  });
}
