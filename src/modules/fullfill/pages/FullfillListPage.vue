<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Задания ФФ</h1>
        <ButtonPrimitive :as="RouterLink" to="/fullfill/new?mp=ozon" variant="transparent">Создать</ButtonPrimitive>
      </div>

      <DataTable
        :columns="columns"
        :rows="rows"
        :loading="query.isLoading.value"
      />
    </div>

    <div v-if="deliveryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" @click.self="closeDelivery">
      <div class="w-full max-w-2xl rounded-[var(--radius-base)] border border-white/60 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Задание #{{ activeDeliveryId }}</h2>
          <TransparentButton @click="closeDelivery">Закрыть</TransparentButton>
        </div>

        <div v-if="deliveryLoading" class="space-y-3">
          <div v-for="index in 3" :key="index" class="flex items-center justify-between rounded-[var(--radius-base)] border px-4 py-3">
            <div class="h-5 w-40 animate-pulse rounded-md bg-slate-200/80" />
            <div class="h-5 w-10 animate-pulse rounded-md bg-slate-200/80" />
          </div>
        </div>
        <div v-else-if="!deliveryDraft.length" class="py-8 text-center text-sm text-slate-500">Не найдено.</div>
        <div v-else class="space-y-3">
          <label v-for="item in deliveryDraft" :key="item.warehouse_name" class="flex items-center justify-between rounded-[var(--radius-base)] border px-4 py-3">
            <span>{{ item.warehouse_name }}</span>
            <input v-model="item.in_delivery" type="checkbox" />
          </label>
        </div>

        <div class="mt-5 flex items-center gap-2">
          <ColoredButton :disabled="!deliveryDraft.length" @click="saveDelivery">Сохранить</ColoredButton>
          <TransparentButton @click="closeDelivery">Отмена</TransparentButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { RouterLink } from 'vue-router'
import { createColumnHelper } from '@tanstack/vue-table'
import DataTable from '@/components/shared/Table/DataTable.vue'
import { useAppQuery } from '@/shared/composables/useAppQuery'
import { queryKeys } from '@/shared/composables/queryKeys'
import { fullfillService } from '@/modules/fullfill/api/fullfill.service'
import ButtonPrimitive from '@/shared/ui/button/ButtonPrimitive.vue'
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { formatDate, formatNumber } from '@/lib/format'

const query = useAppQuery({ key: queryKeys.fullfill, query: () => fullfillService.list() })
watch(() => query.error.value, (error) => { if (error) toast.error('Ошибка загрузки заданий ФФ') })

const rows = computed(() => query.data.value ?? [])
const deliveryModalOpen = ref(false)
const deliveryLoading = ref(false)
const activeDeliveryId = ref<number | null>(null)
const deliveryDraft = ref<Array<{ warehouse_name: string; in_delivery: boolean }>>([])
const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Номер',
    size: 130,
    cell: (info) => h(RouterLink, { to: `/fullfill/${info.row.original.id}`, class: 'font-data text-cyan-700' }, () => `#${info.row.original.id}`),
  }),
  columnHelper.accessor('mp', {
    header: 'МП',
    size: 100,
    cell: (info) => String(info.getValue() || 'ozon').toUpperCase(),
  }),
  columnHelper.accessor('is_approved', {
    header: 'Статус',
    size: 150,
    cell: (info) => h('span', {
      class: info.getValue()
        ? 'inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
        : 'inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700',
    }, info.getValue() ? 'Применено' : 'Черновик'),
  }),
  columnHelper.accessor('liters', { header: 'Литры', size: 110, cell: (info) => formatNumber(Number(info.getValue() ?? 0)) }),
  columnHelper.accessor('boxes', { header: 'Коробки', size: 110, cell: (info) => formatNumber(Number(info.getValue() ?? 0)) }),
  columnHelper.accessor('pallets', { header: 'Паллеты', size: 110, cell: (info) => formatNumber(Number(info.getValue() ?? 0)) }),
  columnHelper.accessor('created_at', { header: 'Создано', size: 180, cell: (info) => formatDate(info.getValue()) }),
  columnHelper.accessor('updated_at', { header: 'Изменено', size: 180, cell: (info) => formatDate(info.getValue()) }),
  columnHelper.display({
    id: 'actions',
    header: 'Действия',
    size: 220,
    cell: (info) => h('div', { class: 'flex flex-wrap items-center gap-2' }, [
      h(TransparentButton, {
        size: 'sm',
        onClick: async (event: Event) => {
          event.stopPropagation()
          await openDelivery(info.row.original.id)
        },
      }, () => 'В пути'),
      h(TransparentButton, {
        size: 'sm',
        class: '!text-red-600',
        onClick: async (event: Event) => {
          event.stopPropagation()
          await remove(info.row.original.id)
        },
      }, () => 'Удалить'),
    ]),
  }),
]

async function remove(id: number) {
  if (!confirm('Удалить задание?')) return
  await fullfillService.remove(id)
  await query.refetch()
  toast.success('Удалено')
}

async function openDelivery(id: number) {
  activeDeliveryId.value = id
  deliveryModalOpen.value = true
  deliveryLoading.value = true
  try {
    const response = await fullfillService.delivery(id)
    if (Array.isArray(response)) {
      deliveryDraft.value = response.map((item) => ({ ...item }))
    } else {
      deliveryDraft.value = Object.entries(response.warehouses ?? {}).map(([warehouse_name, in_delivery]) => ({ warehouse_name, in_delivery: Boolean(in_delivery) }))
    }
  } finally {
    deliveryLoading.value = false
  }
}

function closeDelivery() {
  deliveryModalOpen.value = false
  activeDeliveryId.value = null
  deliveryDraft.value = []
}

async function saveDelivery() {
  if (!activeDeliveryId.value) return
  await fullfillService.updateDelivery(activeDeliveryId.value, { warehouses: deliveryDraft.value })
  toast.success('Статусы в пути обновлены')
  closeDelivery()
}
</script>