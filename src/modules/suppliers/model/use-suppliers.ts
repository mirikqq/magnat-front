import { computed, type Ref } from 'vue';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { suppliersService } from '@/modules/suppliers/api/suppliers.service';

export function useSuppliersQuery(search: Ref<string>) {
  return useAppQuery({
    key: computed(() => queryKeys.suppliers(search.value)),
    query: () => suppliersService.list(search.value),
  });
}


