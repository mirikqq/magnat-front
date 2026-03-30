<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">Остатки ФФ</h1>
      <input v-model="search" placeholder="Поиск по наименованию" class="rounded-md border px-3 py-2" />
    </div>

    <div v-if="query.error.value" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Не удалось загрузить остатки.</div>

    <template v-else>
      <div class="overflow-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b px-3 py-2 text-left">Наименование</th>
              <th class="border-b px-3 py-2 text-left">Поставщик</th>
              <th class="border-b px-3 py-2 text-left">Цена</th>
              <th class="border-b px-3 py-2 text-left">Текущие остатки</th>
              <th class="border-b px-3 py-2 text-left">Закуплено</th>
              <th class="border-b px-3 py-2 text-left">Итого</th>
            </tr>
          </thead>
          <Transition name="table-fade" mode="out-in">
            <TableSkeletonRows v-if="query.isLoading.value" key="loading" :columns="6" :rows="4" />
            <tbody v-else-if="filtered.length" key="rows">
              <tr v-for="item in filtered" :key="item.id">
                <td class="border-b px-3 py-2">{{ item.name }}</td>
                <td class="border-b px-3 py-2">{{ item.supplier_name || '-' }}</td>
                <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
                <td class="border-b px-3 py-2">{{ item.in_our_stock }}</td>
                <td class="border-b px-3 py-2"><input v-model.number="draft[item.id]" class="w-28 rounded border px-2 py-1" type="number" min="0" /></td>
                <td class="border-b px-3 py-2">{{ item.in_our_stock + (draft[item.id] ?? 0) }}</td>
              </tr>
            </tbody>
            <tbody v-else key="empty" />
          </Transition>
        </table>
      </div>

      <div v-if="!query.isLoading.value && !filtered.length" class="py-10 text-center text-sm text-slate-500">Результаты отсутствуют.</div>

      <div v-if="!query.isLoading.value && filtered.length" class="flex items-center gap-2">
        <button class="rounded-md border px-2.5 py-1.5 text-sm" @click="save">Сохранить</button>
        <button class="rounded-md border px-2.5 py-1.5 text-sm" @click="resetAll">Сбросить все</button>
        <RouterLink class="rounded-md bg-slate-900 px-2.5 py-1.5 text-sm text-white" to="/fullfill/new?mp=ozon">Новое задание ФФ (OZON)</RouterLink>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, ref, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import TableSkeletonRows from '@/components/shared/Table/TableSkeletonRows.vue';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { observablesService } from '@/modules/observables/api/observables.service';
import { formatMoney } from '@/lib/format';

const search = ref('');
const query = useAppQuery({ key: queryKeys.fullfillstock, query: () => observablesService.stock() });
const items = computed(() => query.data.value ?? []);
const filtered = computed(() => items.value.filter((x) => x.name.toLowerCase().includes(search.value.toLowerCase())));
const draft = reactive<Record<number, number>>({});

watchEffect(() => {
  items.value.forEach((item) => {
    if (draft[item.id] == null) draft[item.id] = 0;
  });
});

async function save() {
  await observablesService.updateStock(items.value.map((x) => ({ id: x.id, add: draft[x.id] ?? 0 })));
  items.value.forEach((x) => { draft[x.id] = 0; });
  await query.refetch();
  toast.success('Остатки обновлены');
}

function resetAll() {
  items.value.forEach((x) => { draft[x.id] = 0; });
}
</script>

