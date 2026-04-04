<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Склады Ozon</h1>
        <div class="flex items-center gap-2">
          <span v-if="isDirty" class="rounded-[var(--radius-base)] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">Есть несохраненные изменения</span>
          <ColoredButton @click="save" :disabled="!isDirty || !draft.length">Сохранить</ColoredButton>
          <TransparentButton @click="recalculate">Пересчитать</TransparentButton>
        </div>
      </div>

      <div class="w-full">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b px-3 py-2 text-left">Склад</th>
              <th class="border-b px-3 py-2 text-left">Коротко</th>
              <th class="border-b px-3 py-2 text-left">Приоритет</th>
              <th class="border-b px-3 py-2 text-left">Видимость</th>
              <th class="border-b px-3 py-2 text-left">Период запаса</th>
              <th class="border-b px-3 py-2 text-left">Период доставки</th>
              <th class="border-b px-3 py-2 text-left">МП</th>
            </tr>
          </thead>
          <Transition name="table-fade" mode="out-in">
            <TableSkeletonRows v-if="showSkeleton" key="loading" :columns="7" :rows="4" />
            <tbody v-else-if="draft.length" key="rows">
              <tr v-for="item in draft" :key="item.id">
                <td class="border-b px-3 py-2">{{ item.warehouse_name }}</td>
                <td class="border-b px-3 py-2"><input v-model="item.short_name" class="rounded border px-2 py-1" /></td>
                <td class="border-b px-3 py-2"><input v-model.number="item.priority" class="w-20 rounded border px-2 py-1" type="number" /></td>
                <td class="border-b px-3 py-2"><input v-model="item.visible" type="checkbox" /></td>
                <td class="border-b px-3 py-2"><input v-model.number="item.period_stock" class="w-20 rounded border px-2 py-1" type="number" /></td>
                <td class="border-b px-3 py-2"><input v-model.number="item.period_delivery" class="w-20 rounded border px-2 py-1" type="number" /></td>
                <td class="border-b px-3 py-2">{{ String(item.mp || 'ozon').toUpperCase() }}</td>
              </tr>
            </tbody>
            <tbody v-else-if="query.isLoading.value" key="pending" />
            <TableNotFoundRow v-else key="empty" :colspan="7" />
          </Transition>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, watch, watchEffect } from 'vue'
import { toast } from 'vue-sonner'
import TableSkeletonRows from '@/components/shared/Table/TableSkeletonRows.vue'
import TableNotFoundRow from '@/components/shared/Table/TableNotFoundRow.vue'
import { useAppQuery } from '@/shared/composables/useAppQuery'
import { queryKeys } from '@/shared/composables/queryKeys'
import { useDelayedSkeleton } from '@/shared/composables/useDelayedSkeleton'
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { warehousesService } from '@/modules/warehouses/api/warehouses.service'
import { runRecalculateAndWait } from '@/lib/recalculate'

const query = useAppQuery({ key: queryKeys.warehouses('ozon'), query: () => warehousesService.list('ozon') })
watch(() => query.error.value, (error) => { if (error) toast.error('Ошибка загрузки складов') })
const showSkeleton = useDelayedSkeleton(() => query.isLoading.value)

const draft = reactive<any[]>([])
const snapshot = computed(() => JSON.stringify(query.data.value ?? []))
const current = computed(() => JSON.stringify(draft))
const isDirty = computed(() => snapshot.value !== current.value)

watchEffect(() => {
  draft.splice(0, draft.length, ...((query.data.value ?? []).map((x) => ({ ...x }))))
})

async function save() {
  await warehousesService.update('ozon', { warehouses: draft })
  await query.refetch()
  toast.success('Склады сохранены')
}

async function recalculate() {
  await runRecalculateAndWait()
  toast.success('Данные пересчитаны')
}
</script>