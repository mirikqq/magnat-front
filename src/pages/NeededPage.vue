<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Потребность</h1>
      <div class="flex items-center gap-2">
        <button class="rounded-md border px-3 py-2" @click="toggleColumn('name')">Наименование</button>
        <button class="rounded-md border px-3 py-2" @click="toggleColumn('warehouses')">Склады</button>
        <button class="rounded-md border px-3 py-2" @click="recalculate">Пересчитать</button>
      </div>
    </div>

    <div v-if="query.isLoading.value">Загрузка...</div>
    <div v-else-if="query.error.value" class="text-red-600">Ошибка загрузки</div>

    <div v-else class="overflow-auto rounded-md border">
      <table class="min-w-full border-collapse text-sm">
        <thead class="bg-slate-50">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" class="border-b px-3 py-2 text-left">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-slate-50">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="border-b px-3 py-2">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-50 p-3">
      <div>Выбрано: {{ selectedIds.length }}</div>
      <div>Итого по выбранным: {{ formatMoney(selectedTotal) }}</div>
      <div>Итого: {{ formatMoney(grandTotal) }}</div>
      <div class="flex items-center gap-2">
        <button class="rounded-md border px-3 py-2" @click="download">Скачать все</button>
        <button class="rounded-md bg-teal-700 px-3 py-2 text-white" @click="sendToOrder">Отправить в заказ</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { FlexRender, createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table';

import type { SupplyDemandRowDto } from '@/shared/api/contracts/domain';
import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { supplyService } from '@/shared/api/services/supply';
import { formatMoney, formatNumber } from '@/shared/lib/format';
import { calcOrderAmount } from '@/shared/lib/math';
import { runRecalculateAndWait } from '@/shared/lib/recalculate';
import { exportRowsToXlsx } from '@/shared/lib/xlsx';

const router = useRouter();
const selected = ref<Record<number, boolean>>({});
const showName = ref(true);
const showWarehouses = ref(true);

const query = useAppQuery({
  key: queryKeys.needed,
  query: () => supplyService.demand(),
});

const data = computed(() => query.data.value ?? []);
const warehouseNames = computed(() => {
  const set = new Set<string>();
  data.value.forEach((row) => row.warehouses.forEach((x) => set.add(x.warehouse_name)));
  return Array.from(set);
});

const columnHelper = createColumnHelper<SupplyDemandRowDto>();

const columns = computed(() => {
  const base = [
    columnHelper.display({
      id: 'select',
      header: 'В заказ',
      cell: (info) => h('input', {
        type: 'checkbox',
        checked: Boolean(selected.value[info.row.original.observable_id]),
        onChange: (event: Event) => {
          const value = (event.target as HTMLInputElement).checked;
          selected.value = { ...selected.value, [info.row.original.observable_id]: value };
        },
      }),
    }),
    columnHelper.accessor('offer_id', { header: 'Артикул', cell: (info) => info.getValue() }),
    columnHelper.accessor('packing', { header: 'Фасовка', cell: (info) => formatNumber(info.getValue()) }),
  ];

  if (showName.value) {
    base.unshift(columnHelper.accessor('observable_name', { header: 'Товар', cell: (info) => info.getValue() }));
  }

  if (showWarehouses.value) {
    warehouseNames.value.forEach((name) => {
      base.push(
        columnHelper.display({
          id: `wh-${name}`,
          header: name,
          cell: (info) => {
            const found = info.row.original.warehouses.find((x) => x.warehouse_name === name && x.visible);
            return found ? formatNumber(found.needed) : '-';
          },
        }),
      );
    });
  }

  base.push(
    columnHelper.accessor('total_need', { header: 'Итого', cell: (info) => formatNumber(info.getValue()) }),
    columnHelper.accessor('min_count', { header: 'Мин.заказ', cell: (info) => formatNumber(info.getValue()) }),
    columnHelper.display({
      id: 'amount',
      header: 'Сумма по товару',
      cell: (info) => formatMoney(calcOrderAmount(info.row.original.total_need, info.row.original.min_count, info.row.original.price)),
    }),
  );

  return base;
});

const table = useVueTable({
  get data() {
    return data.value;
  },
  get columns() {
    return columns.value;
  },
  getCoreRowModel: getCoreRowModel(),
});

const selectedRows = computed(() => data.value.filter((x) => selected.value[x.observable_id]));
const selectedIds = computed(() => selectedRows.value.map((x) => x.observable_id));

const selectedTotal = computed(() => selectedRows.value.reduce((acc, row) => acc + calcOrderAmount(row.total_need, row.min_count, row.price), 0));
const grandTotal = computed(() => data.value.reduce((acc, row) => acc + calcOrderAmount(row.total_need, row.min_count, row.price), 0));

function toggleColumn(column: 'name' | 'warehouses') {
  if (column === 'name') showName.value = !showName.value;
  if (column === 'warehouses') showWarehouses.value = !showWarehouses.value;
}

function download() {
  const rows = data.value.map((row) => ({
    Товар: row.observable_name,
    Артикул: row.offer_id,
    Итого: row.total_need,
    МинЗаказ: row.min_count,
    Сумма: calcOrderAmount(row.total_need, row.min_count, row.price),
  }));
  exportRowsToXlsx('needed.xlsx', rows);
}

function sendToOrder() {
  router.push({ path: '/orders/new', query: { ids: selectedIds.value.join(',') } });
}

async function recalculate() {
  try {
    await runRecalculateAndWait();
    await query.refetch();
    toast.success('Данные пересчитаны');
  } catch (error) {
    toast.error((error as Error).message);
  }
}
</script>


