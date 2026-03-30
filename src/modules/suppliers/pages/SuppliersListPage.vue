<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Поставщики</h1>
      <RouterLink class="rounded-md border px-2.5 py-1.5 text-sm" to="/suppliers/new">Создать поставщика</RouterLink>
    </div>

    <input v-model="search" placeholder="Поиск по названию" class="w-full rounded-md border px-2.5 py-1.5 text-sm" />

    <div v-if="query.error.value" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Не удалось загрузить список поставщиков.</div>
    <DataTable
      v-else
      :columns="columns"
      :rows="rows"
      :loading="query.isLoading.value"
      empty-text="Результаты отсутствуют."
    />
  </section>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { RouterLink } from 'vue-router';
import { createColumnHelper } from '@tanstack/vue-table';

import DataTable from '@/components/shared/Table/DataTable.vue';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { suppliersService } from '@/modules/suppliers/api/suppliers.service';

const search = ref('');
const query = useAppQuery({ key: computed(() => queryKeys.suppliers(search.value)), query: () => suppliersService.list(search.value) });
const rows = computed(() => query.data.value ?? []);
const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    size: 100,
    cell: (info) => h('span', { class: 'font-data text-slate-700' }, String(info.getValue())),
  }),
  columnHelper.accessor('name', {
    header: 'Наименование',
    size: 520,
    cell: (info) => h(RouterLink, { to: `/suppliers/${info.row.original.id}`, class: 'text-slate-900 hover:text-cyan-700' }, () => info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Удалить',
    size: 140,
    cell: (info) => h('button', {
      class: 'rounded-md border px-2 py-1 text-red-600',
      onClick: async (event: Event) => {
        event.stopPropagation();
        await remove(info.row.original.id);
      },
    }, 'Удалить'),
  }),
];

watch(search, () => void query.refetch());

async function remove(id: number) {
  if (!confirm('Удалить поставщика?')) return;
  await suppliersService.remove(id);
  await query.refetch();
  toast.success('Поставщик удален');
}
</script>

