<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <h1 class="text-2xl font-semibold">В пути</h1>

      <div class="w-full">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b px-3 py-2 text-left">Наименование</th>
              <th class="border-b px-3 py-2 text-left">Поставщик</th>
              <th class="border-b px-3 py-2 text-left">Цена за шт.</th>
              <th class="border-b px-3 py-2 text-left">В пути</th>
            </tr>
          </thead>
          <Transition name="table-fade" mode="out-in">
            <TableSkeletonRows v-if="showSkeleton" key="loading" :columns="4" :rows="4" />
            <tbody v-else-if="items.length" key="rows">
              <tr v-for="item in items" :key="item.id">
                <td class="border-b px-3 py-2">{{ item.name }}</td>
                <td class="border-b px-3 py-2">{{ item.supplier_name || '-' }}</td>
                <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
                <td class="border-b px-3 py-2"><input v-model.number="draft[item.id]" class="w-28 rounded border px-2 py-1" type="number" min="0" /></td>
              </tr>
            </tbody>
            <tbody v-else-if="query.isLoading.value" key="pending" />
            <TableNotFoundRow v-else key="empty" :colspan="4" />
          </Transition>
        </table>
      </div>

      <div v-if="!query.isLoading.value && items.length" class="flex items-center gap-2">
        <TransparentButton @click="save">Сохранить</TransparentButton>
        <TransparentButton @click="resetAll">Сбросить все</TransparentButton>
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
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { observablesService } from '@/modules/observables/api/observables.service'
import { formatMoney } from '@/lib/format'

const query = useAppQuery({ key: queryKeys.inway, query: () => observablesService.inway() })
watch(() => query.error.value, (error) => { if (error) toast.error('Ошибка загрузки товаров в пути') })
const showSkeleton = useDelayedSkeleton(() => query.isLoading.value)

const items = computed(() => query.data.value ?? [])
const draft = reactive<Record<number, number>>({})

watchEffect(() => {
  items.value.forEach((item) => {
    if (draft[item.id] == null) draft[item.id] = item.in_way
  })
})

async function save() {
  await observablesService.updateInway(items.value.map((x) => ({ id: x.id, in_way: draft[x.id] ?? 0 })))
  await query.refetch()
  toast.success('Сохранено')
}

function resetAll() {
  items.value.forEach((x) => { draft[x.id] = 0 })
}
</script>