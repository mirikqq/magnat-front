<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Заказы поставщикам</h1>
        <ButtonPrimitive :as="RouterLink" to="/orders/new" variant="transparent">Создать</ButtonPrimitive>
      </div>

      <DataTable
        :columns="columns"
        :rows="sortedOrders"
        :loading="query.isLoading.value"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, h, watch } from 'vue'
import { toast } from 'vue-sonner'
import { RouterLink } from 'vue-router'
import { createColumnHelper } from '@tanstack/vue-table'

import DataTable from '@/components/shared/Table/DataTable.vue'
import { useAppQuery } from '@/shared/composables/useAppQuery'
import { queryKeys } from '@/shared/composables/queryKeys'
import { ordersService } from '@/modules/orders/api/orders.service'
import ButtonPrimitive from '@/shared/ui/button/ButtonPrimitive.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { formatDate } from '@/lib/format'

const query = useAppQuery({
  key: queryKeys.orders,
  query: () => ordersService.list(),
})

watch(
  () => query.error.value,
  (error) => {
    if (error) toast.error('Ошибка загрузки заказов')
  },
)

const sortedOrders = computed(() => [...(query.data.value ?? [])].sort((a, b) => b.id - a.id))
const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('id', {
    header: 'Номер',
    size: 120,
    cell: (info) => h(RouterLink, { to: `/orders/${info.getValue()}`, class: 'font-data text-cyan-700' }, () => `#${info.getValue()}`),
  }),
  columnHelper.accessor('is_approved', {
    header: 'Статус',
    size: 150,
    cell: (info) => h('span', {
      class: info.getValue()
        ? 'inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
        : 'inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700',
    }, info.getValue() ? 'Утвержден' : 'Черновик'),
  }),
  columnHelper.accessor('created_at', {
    header: 'Дата создания',
    size: 180,
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Дата редактирования',
    size: 180,
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Действия',
    size: 140,
    cell: (info) => h(TransparentButton, {
      size: 'sm',
      class: '!text-red-600',
      onClick: async (event: Event) => {
        event.stopPropagation()
        await remove(info.row.original.id)
      },
    }, () => 'Удалить'),
  }),
]

async function remove(id: number) {
  if (!confirm('Удалить заказ?')) return
  await ordersService.remove(id)
  await query.refetch()
  toast.success('Заказ удален')
}
</script>