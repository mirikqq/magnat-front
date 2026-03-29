<template>
  <section class="page space-y-5">
    <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p class="font-caption text-[11px] uppercase tracking-[0.24em] text-slate-500">Supply workspace</p>
        <h1 class="text-2xl font-semibold">Потребность</h1>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button class="rounded-2xl border px-3 py-2" @click="toggleColumn('name')">Наименование</button>
        <button class="rounded-2xl border px-3 py-2" @click="toggleColumn('warehouses')">Склады</button>
        <button class="rounded-2xl border px-3 py-2" @click="recalculate">Пересчитать</button>
      </div>
    </div>

    <div v-if="query.isLoading.value" class="rounded-2xl border border-dashed p-6 text-slate-500">Загрузка потребности...</div>
    <div v-else-if="query.error.value" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Ошибка загрузки</div>

    <div v-else class="overflow-auto rounded-[24px] border border-slate-200/80 bg-white/80">
      <table class="min-w-full border-collapse text-sm">
        <thead class="bg-slate-50/80">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" class="border-b px-3 py-3 text-left">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-slate-50/70">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="border-b px-3 py-3 align-top">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="sticky bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/60 bg-white/88 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div class="flex flex-wrap items-center gap-4">
        <div>Выбрано: <span class="font-data">{{ selectedIds.length }}</span></div>
        <div>Итого по выбранным: <span class="font-data">{{ formatMoney(selectedTotal) }}</span></div>
        <div>Итого: <span class="font-data">{{ formatMoney(grandTotal) }}</span></div>
      </div>
      <div class="flex items-center gap-2">
        <button class="rounded-2xl bg-slate-900 px-4 py-2 text-white" @click="sendToOrder">Отправить в заказ</button>
      </div>
    </div>

    <div v-if="stockModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" @click.self="closeStockModal">
      <div class="w-full max-w-4xl rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="font-caption text-[11px] uppercase tracking-[0.24em] text-slate-500">Артикул</p>
            <h2 class="text-xl font-semibold text-slate-900">{{ activeStockMeta.offerId }}</h2>
          </div>
          <button class="rounded-2xl border px-3 py-2" @click="closeStockModal">Закрыть</button>
        </div>

        <div v-if="stockLoading" class="rounded-2xl border border-dashed p-6 text-slate-500">Загрузка складов...</div>
        <table v-else class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b px-3 py-2 text-left">Склад</th>
              <th class="border-b px-3 py-2 text-left">Видимость</th>
              <th class="border-b px-3 py-2 text-left">В пути</th>
              <th class="border-b px-3 py-2 text-left">В продаже</th>
              <th class="border-b px-3 py-2 text-left">В резерве</th>
              <th class="border-b px-3 py-2 text-left">Ср. скорость</th>
              <th class="border-b px-3 py-2 text-left">Необходимо</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stockDetails" :key="item.warehouse_name">
              <td class="border-b px-3 py-2">{{ item.short_name || item.warehouse_name }}</td>
              <td class="border-b px-3 py-2">
                <input :checked="Boolean(item.visible)" type="checkbox" @change="toggleVisibility(item)" />
              </td>
              <td class="border-b px-3 py-2 font-data">{{ formatNumber(item.promised_amount) }}</td>
              <td class="border-b px-3 py-2 font-data">{{ formatNumber(item.free_to_sell_amount) }}</td>
              <td class="border-b px-3 py-2 font-data">{{ formatNumber(item.reserved_amount) }}</td>
              <td class="border-b px-3 py-2 font-data">{{ item.avg_sale ?? '-' }}</td>
              <td class="border-b px-3 py-2 font-data">{{ formatNumber(item.needed) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, h, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { FlexRender, createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table';

import type { SupplyDemandRowDto } from '@/shared/api/contracts/domain';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { supplyService } from '@/modules/needed/api/supply.service';
import { formatMoney, formatNumber } from '@/lib/format';
import { calcOrderAmount } from '@/lib/math';
import { runRecalculateAndWait } from '@/lib/recalculate';

const router = useRouter();
const selected = ref<Record<number, boolean>>({});
const showName = ref(true);
const showWarehouses = ref(true);
const stockModalOpen = ref(false);
const stockLoading = ref(false);
const stockDetails = ref<any[]>([]);
const activeStockMeta = reactive({ offerId: '', sku: 0 });

const query = useAppQuery({
  key: queryKeys.needed,
  query: () => supplyService.demand(),
});

const data = computed(() => query.data.value ?? []);
const warehouseNames = computed(() => {
  const set = new Set<string>();
  data.value.forEach((row) => (row.warehouses ?? []).forEach((x) => set.add(x.warehouse_name)));
  return Array.from(set);
});

const columnHelper = createColumnHelper<SupplyDemandRowDto>();

async function openStockModal(row: SupplyDemandRowDto) {
  stockModalOpen.value = true;
  stockLoading.value = true;
  activeStockMeta.offerId = row.offer_id ?? String(row.product_sku);
  activeStockMeta.sku = row.product_sku;
  try {
    stockDetails.value = await supplyService.stockByProduct(row.product_sku);
  } catch (error) {
    toast.error('Не удалось загрузить остатки по складам');
    stockModalOpen.value = false;
  } finally {
    stockLoading.value = false;
  }
}

function closeStockModal() {
  stockModalOpen.value = false;
  stockDetails.value = [];
}

async function toggleVisibility(item: any) {
  const nextVisible = !item.visible;
  await supplyService.updateVisibility({
    product_sku: activeStockMeta.sku,
    warehouse_name: item.warehouse_name,
    visible: nextVisible,
  });
  item.visible = nextVisible;
  toast.success('Изменения сохранены');
}

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
    columnHelper.display({
      id: 'offer_id',
      header: 'Артикул',
      cell: (info) => h('button', {
        class: 'font-data text-left text-cyan-700 underline decoration-dotted underline-offset-4',
        onClick: () => openStockModal(info.row.original),
      }, info.row.original.offer_id || String(info.row.original.product_sku)),
    }),
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
            const found = (info.row.original.warehouses ?? []).find((x) => x.warehouse_name === name && x.visible);
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

function sendToOrder() {
  if (!selectedIds.value.length) {
    toast.error('Сначала выбери хотя бы один товар');
    return;
  }
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

