<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">{{ isNew ? 'Создание заказа' : `Заказ #${order?.id ?? ''}` }}</h1>

    <div class="overflow-auto rounded-md border">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th class="border-b px-3 py-2 text-left">Товар</th>
            <th class="border-b px-3 py-2 text-left">Мин.заказ</th>
            <th class="border-b px-3 py-2 text-left">Потребность</th>
            <th class="border-b px-3 py-2 text-left">Добавить</th>
            <th class="border-b px-3 py-2 text-left">Итого</th>
            <th class="border-b px-3 py-2 text-left">Цена</th>
            <th class="border-b px-3 py-2 text-left">Сумма</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="border-b px-3 py-2">{{ item.name }}</td>
            <td class="border-b px-3 py-2">{{ item.min_count }}</td>
            <td class="border-b px-3 py-2">{{ item.needed }}</td>
            <td class="border-b px-3 py-2">
              <input v-model.number="edits[item.id]" class="w-24 rounded border px-2 py-1" type="number" min="0" :disabled="order?.is_approved" />
            </td>
            <td class="border-b px-3 py-2">{{ ceilByMultiplicity(item.needed + (edits[item.id] ?? item.additional), item.min_count) }}</td>
            <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
            <td class="border-b px-3 py-2">{{ formatMoney(ceilByMultiplicity(item.needed + (edits[item.id] ?? item.additional), item.min_count) * item.price) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center gap-2">
      <button class="rounded-md border px-3 py-2" @click="download">Скачать все</button>
      <button class="rounded-md border px-3 py-2" :disabled="!order || order.is_approved" @click="save">Сохранить</button>
      <button class="rounded-md bg-teal-700 px-3 py-2 text-white" :disabled="!order || order.is_approved" @click="approve">Принять</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import { ordersService } from '@/shared/api/services/orders';
import { formatMoney } from '@/shared/lib/format';
import { ceilByMultiplicity } from '@/shared/lib/math';
import { exportRowsToXlsx } from '@/shared/lib/xlsx';

const route = useRoute();
const router = useRouter();
const isNew = computed(() => route.path.endsWith('/new'));
const order = computed<any>(() => state.order);
const items = computed(() => order.value?.items ?? []);
const edits = reactive<Record<number, number>>({});

const state = reactive<{ order: any | null }>({ order: null });

watch(
  () => route.fullPath,
  async () => {
    if (isNew.value) {
      const ids = String(route.query.ids ?? '').split(',').filter(Boolean).map(Number);
      state.order = await ordersService.create({ observable_ids: ids });
      router.replace(`/orders/${state.order.id}`);
    } else {
      state.order = await ordersService.get(String(route.params.id));
      items.value.forEach((item: any) => {
        edits[item.id] = item.additional;
      });
    }
  },
  { immediate: true },
);

async function save() {
  await ordersService.update(order.value.id, {
    items: items.value.map((x: any) => ({ id: x.id, additional: edits[x.id] ?? x.additional })),
  });
  state.order = await ordersService.get(order.value.id);
  toast.success('Изменения сохранены');
}

async function approve() {
  await ordersService.approve(order.value.id);
  state.order = await ordersService.get(order.value.id);
  toast.success('Заказ утвержден');
}

function download() {
  const rows = items.value.map((item: any) => ({
    Товар: item.name,
    МинЗаказ: item.min_count,
    Потребность: item.needed,
    Добавить: edits[item.id] ?? item.additional,
    Сумма: ceilByMultiplicity(item.needed + (edits[item.id] ?? item.additional), item.min_count) * item.price,
  }));
  exportRowsToXlsx(`order-${order.value?.id ?? 'new'}.xlsx`, rows);
}
</script>
