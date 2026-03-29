<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-caption text-[11px] uppercase tracking-[0.24em] text-slate-500">Warehouse settings</p>
        <h1 class="text-2xl font-semibold">Склады Ozon</h1>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="isDirty" class="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Есть несохраненные изменения</span>
        <button class="rounded-2xl bg-slate-900 px-3 py-2 text-white" @click="save" :disabled="!isDirty">Сохранить</button>
        <button class="rounded-2xl border px-3 py-2" @click="recalculate">Пересчитать</button>
      </div>
    </div>

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
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, watchEffect } from 'vue';
import { toast } from 'vue-sonner';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { warehousesService } from '@/modules/warehouses/api/warehouses.service';
import { runRecalculateAndWait } from '@/lib/recalculate';

const query = useAppQuery({ key: queryKeys.warehouses('ozon'), query: () => warehousesService.list('ozon') });
const draft = reactive<any[]>([]);
const snapshot = computed(() => JSON.stringify(query.data.value ?? []));
const current = computed(() => JSON.stringify(draft));
const isDirty = computed(() => snapshot.value !== current.value);

watchEffect(() => {
  draft.splice(0, draft.length, ...((query.data.value ?? []).map((x) => ({ ...x }))));
});

async function save() {
  await warehousesService.update('ozon', { warehouses: draft });
  await query.refetch();
  toast.success('Склады сохранены');
}

async function recalculate() {
  await runRecalculateAndWait();
  toast.success('Данные пересчитаны');
}
</script>
