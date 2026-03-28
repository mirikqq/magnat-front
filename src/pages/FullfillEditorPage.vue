<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">{{ isNew ? 'Новое задание ФФ' : `Задание ФФ #${id}` }}</h1>

    <div class="rounded-md border p-3">
      <div class="mb-3 flex items-center gap-2">
        <button class="rounded-md border px-3 py-2" @click="autoDistribute">Распределить</button>
        <button class="rounded-md border px-3 py-2" @click="save">Сохранить</button>
        <button class="rounded-md border px-3 py-2" :disabled="approved" @click="apply">Применить к остаткам</button>
      </div>
      <p class="text-sm text-slate-600">Литры: {{ logistics.liters.toFixed(2) }} · Коробки: {{ logistics.boxes.toFixed(2) }} · Паллеты: {{ logistics.pallets.toFixed(2) }}</p>
    </div>

    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr>
          <th class="border-b px-3 py-2 text-left">Артикул</th>
          <th class="border-b px-3 py-2 text-left">Кол-во товара</th>
          <th class="border-b px-3 py-2 text-left">К отгр.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in rows" :key="item.id">
          <td class="border-b px-3 py-2">{{ item.observable_item_id }}</td>
          <td class="border-b px-3 py-2">{{ item.qty }}</td>
          <td class="border-b px-3 py-2"><input v-model.number="draft[item.id]" class="w-24 rounded border px-2 py-1" type="number" min="0" :disabled="approved" /></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import { fullfillService } from '@/shared/api/services/fullfill';
import { calcLogistics } from '@/shared/lib/math';

const route = useRoute();
const router = useRouter();
const isNew = computed(() => route.path.endsWith('/new'));
const id = computed(() => route.params.id as string);
const state = reactive<{ detail: any | null }>({ detail: null });
const draft = reactive<Record<number, number>>({});

watchEffect(async () => {
  if (isNew.value) {
    const created = await fullfillService.create({ mp: String(route.query.mp ?? 'ozon') });
    router.replace(`/fullfill/${created.id}`);
    return;
  }

  state.detail = await fullfillService.get(id.value);
  rows.value.forEach((x: any) => {
    if (draft[x.id] == null) draft[x.id] = x.qty;
  });
});

const rows = computed<any[]>(() => state.detail?.items ?? []);
const approved = computed(() => Boolean(state.detail?.is_approved));
const totalQty = computed(() => rows.value.reduce((acc, x) => acc + (draft[x.id] ?? x.qty), 0));
const logistics = computed(() => calcLogistics(totalQty.value, 1));

function autoDistribute() {
  rows.value.forEach((row: any) => {
    const next = Math.ceil(((draft[row.id] ?? row.qty) + 5) / 5) * 5;
    draft[row.id] = next;
  });
}

async function save() {
  await fullfillService.update(id.value, {
    items: rows.value.map((x: any) => ({ id: x.id, qty: draft[x.id] ?? x.qty, stock: x.stock ?? {} })),
  });
  state.detail = await fullfillService.get(id.value);
  toast.success('Сохранено');
}

async function apply() {
  await fullfillService.approve(id.value);
  state.detail = await fullfillService.get(id.value);
  toast.success('Применено к остаткам');
}
</script>
