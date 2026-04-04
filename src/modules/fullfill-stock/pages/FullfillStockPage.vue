<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-2xl font-semibold">Остатки ФФ</h1>
        <input v-model="search" placeholder="Поиск по наименованию" class="rounded-[var(--radius-base)] border px-3 py-2" />
      </div>

      <div class="w-full">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="border-b px-3 py-2 text-left">Наименование</th>
              <th class="border-b px-3 py-2 text-left">Поставщик</th>
              <th class="border-b px-3 py-2 text-left">Цена</th>
              <th class="border-b px-3 py-2 text-left">Текущие остатки</th>
              <th class="border-b px-3 py-2 text-left">Закуплено</th>
              <th class="border-b px-3 py-2 text-left">Итого</th>
            </tr>
          </thead>
          <Transition name="table-fade" mode="out-in">
            <TableSkeletonRows v-if="showSkeleton" key="loading" :columns="6" :rows="4" />
            <tbody v-else-if="filtered.length" key="rows">
              <tr v-for="item in filtered" :key="item.id">
                <td class="border-b px-3 py-2">{{ item.name }}</td>
                <td class="border-b px-3 py-2">{{ item.supplier_name || '-' }}</td>
                <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
                <td class="border-b px-3 py-2">{{ item.in_our_stock }}</td>
                <td class="border-b px-3 py-2"><input v-model.number="draft[item.id]" class="w-28 rounded border px-2 py-1" type="number" min="0" /></td>
                <td class="border-b px-3 py-2">{{ item.in_our_stock + (draft[item.id] ?? 0) }}</td>
              </tr>
            </tbody>
            <tbody v-else-if="query.isLoading.value" key="pending" />
            <TableNotFoundRow v-else key="empty" :colspan="6" />
          </Transition>
        </table>
      </div>

      <div v-if="!query.isLoading.value && filtered.length" class="flex items-center gap-2">
        <TransparentButton @click="save">Сохранить</TransparentButton>
        <TransparentButton @click="resetAll">Сбросить все</TransparentButton>
        <ButtonPrimitive :as="RouterLink" to="/fullfill/new?mp=ozon" variant="colored">Новое задание ФФ (OZON)</ButtonPrimitive>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-nocheck
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import TableSkeletonRows from '@/components/shared/Table/TableSkeletonRows.vue'
import TableNotFoundRow from '@/components/shared/Table/TableNotFoundRow.vue'
import { useAppQuery } from '@/shared/composables/useAppQuery'
import { queryKeys } from '@/shared/composables/queryKeys'
import { useDelayedSkeleton } from '@/shared/composables/useDelayedSkeleton'
import ButtonPrimitive from '@/shared/ui/button/ButtonPrimitive.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { observablesService } from '@/modules/observables/api/observables.service'
import { formatMoney } from '@/lib/format'

const search = ref('')
const query = useAppQuery({ key: queryKeys.fullfillstock, query: () => observablesService.stock() })
watch(() => query.error.value, (error) => { if (error) toast.error('Ошибка загрузки остатков ФФ') })
const showSkeleton = useDelayedSkeleton(() => query.isLoading.value)

const items = computed(() => query.data.value ?? [])
const filtered = computed(() => items.value.filter((x) => x.name.toLowerCase().includes(search.value.toLowerCase())))
const draft = reactive<Record<number, number>>({})

watchEffect(() => {
  items.value.forEach((item) => {
    if (draft[item.id] == null) draft[item.id] = 0
  })
})

async function save() {
  await observablesService.updateStock(items.value.map((x) => ({ id: x.id, add: draft[x.id] ?? 0 })))
  items.value.forEach((x) => { draft[x.id] = 0 })
  await query.refetch()
  toast.success('Остатки обновлены')
}

function resetAll() {
  items.value.forEach((x) => { draft[x.id] = 0 })
}
</script>