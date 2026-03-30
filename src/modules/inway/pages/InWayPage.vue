<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">В пути</h1>

    <div v-if="query.error.value" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Не удалось загрузить список товаров в пути.</div>

    <template v-else>
      <div class="overflow-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b px-3 py-2 text-left">Наименование</th>
              <th class="border-b px-3 py-2 text-left">Поставщик</th>
              <th class="border-b px-3 py-2 text-left">Цена за шт.</th>
              <th class="border-b px-3 py-2 text-left">В пути</th>
            </tr>
          </thead>
          <Transition name="table-fade" mode="out-in">
            <TableSkeletonRows v-if="query.isLoading.value" key="loading" :columns="4" :rows="4" />
            <tbody v-else-if="items.length" key="rows">
              <tr v-for="item in items" :key="item.id">
                <td class="border-b px-3 py-2">{{ item.name }}</td>
                <td class="border-b px-3 py-2">{{ item.supplier_name || '-' }}</td>
                <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
                <td class="border-b px-3 py-2"><input v-model.number="draft[item.id]" class="w-28 rounded border px-2 py-1" type="number" min="0" /></td>
              </tr>
            </tbody>
            <tbody v-else key="empty" />
          </Transition>
        </table>
      </div>
      <div v-if="!query.isLoading.value && !items.length" class="py-10 text-center text-sm text-slate-500">Результаты отсутствуют.</div>
      <div v-if="!query.isLoading.value && items.length" class="flex items-center gap-2">
        <button class="rounded-md border px-2.5 py-1.5 text-sm" @click="save">Сохранить</button>
        <button class="rounded-md border px-2.5 py-1.5 text-sm" @click="resetAll">Сбросить все</button>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import TableSkeletonRows from '@/components/shared/Table/TableSkeletonRows.vue';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { observablesService } from '@/modules/observables/api/observables.service';
import { formatMoney } from '@/lib/format';

const query = useAppQuery({ key: queryKeys.inway, query: () => observablesService.inway() });
const items = computed(() => query.data.value ?? []);
const draft = reactive<Record<number, number>>({});

watchEffect(() => {
  items.value.forEach((item) => {
    if (draft[item.id] == null) draft[item.id] = item.in_way;
  });
});

async function save() {
  await observablesService.updateInway(items.value.map((x) => ({ id: x.id, in_way: draft[x.id] ?? 0 })));
  await query.refetch();
  toast.success('Сохранено');
}

function resetAll() {
  items.value.forEach((x) => { draft[x.id] = 0; });
}
</script>

