<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">В пути</h1>
    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr>
          <th class="border-b px-3 py-2 text-left">Наименование</th>
          <th class="border-b px-3 py-2 text-left">Цена за шт.</th>
          <th class="border-b px-3 py-2 text-left">В пути</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="border-b px-3 py-2">{{ item.name }}</td>
          <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
          <td class="border-b px-3 py-2"><input v-model.number="draft[item.id]" class="w-28 rounded border px-2 py-1" type="number" min="0" /></td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center gap-2">
      <button class="rounded-md border px-3 py-2" @click="save">Сохранить</button>
      <button class="rounded-md border px-3 py-2" @click="download">Скачать</button>
      <button class="rounded-md border px-3 py-2" @click="resetAll">Сбросить все</button>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { observablesService } from '@/shared/api/services/observables';
import { formatMoney } from '@/shared/lib/format';
import { exportRowsToXlsx } from '@/shared/lib/xlsx';

const query = useAppQuery({ key: queryKeys.inway, query: () => observablesService.inway() });
const items = computed(() => query.data.value ?? []);
const draft = reactive<Record<number, number>>({});

watchEffect(() => {
  items.value.forEach((item) => {
    if (draft[item.id] == null) draft[item.id] = item.in_way;
  });
});

async function save() {
  await observablesService.updateInway({ values: items.value.map((x) => ({ id: x.id, in_way: draft[x.id] ?? 0 })) });
  await query.refetch();
  toast.success('Сохранено');
}

function resetAll() {
  items.value.forEach((x) => { draft[x.id] = 0; });
}

function download() {
  exportRowsToXlsx('inway.xlsx', items.value.map((x) => ({ Наименование: x.name, Цена: x.price, ВПути: draft[x.id] ?? 0 })));
}
</script>


