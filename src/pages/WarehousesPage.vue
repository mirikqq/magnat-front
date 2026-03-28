<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">Склады Ozon</h1>

    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr>
          <th class="border-b px-3 py-2 text-left">Склад</th>
          <th class="border-b px-3 py-2 text-left">Коротко</th>
          <th class="border-b px-3 py-2 text-left">Приоритет</th>
          <th class="border-b px-3 py-2 text-left">Видимость</th>
          <th class="border-b px-3 py-2 text-left">Период запаса</th>
          <th class="border-b px-3 py-2 text-left">Период доставки</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in draft" :key="item.id">
          <td class="border-b px-3 py-2">{{ item.warehouse_name }}</td>
          <td class="border-b px-3 py-2"><input v-model="item.short_name" class="rounded border px-2 py-1" /></td>
          <td class="border-b px-3 py-2"><input v-model.number="item.priority" class="w-20 rounded border px-2 py-1" type="number" /></td>
          <td class="border-b px-3 py-2"><input v-model="item.visible" type="checkbox" /></td>
          <td class="border-b px-3 py-2"><input v-model.number="item.period_stock" class="w-20 rounded border px-2 py-1" type="number" /></td>
          <td class="border-b px-3 py-2"><input v-model.number="item.period_delivery" class="w-20 rounded border px-2 py-1" type="number" /></td>
        </tr>
      </tbody>
    </table>

    <div class="flex items-center gap-2">
      <button class="rounded-md bg-teal-700 px-3 py-2 text-white" @click="save">Сохранить</button>
      <button class="rounded-md border px-3 py-2" @click="recalculate">Пересчитать</button>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { reactive, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { warehousesService } from '@/shared/api/services/warehouses';
import { runRecalculateAndWait } from '@/shared/lib/recalculate';

const query = useAppQuery({ key: queryKeys.warehouses('ozon'), query: () => warehousesService.list('ozon') });
const draft = reactive<any[]>([]);

watchEffect(() => {
  draft.splice(0, draft.length, ...((query.data.value ?? []).map((x) => ({ ...x }))));
});

async function save() {
  await warehousesService.update('ozon', { warehouses: draft });
  toast.success('Склады сохранены');
}

async function recalculate() {
  await runRecalculateAndWait();
  toast.success('Данные пересчитаны');
}
</script>


