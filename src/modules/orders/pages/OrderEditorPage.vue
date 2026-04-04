<template>
  <section class="page">
    <div class="tile-surface space-y-4">
      <h1 class="text-2xl font-semibold">{{ isNew ? 'Создание заказа' : `Заказ #${order?.id ?? ''}` }}</h1>

      <div v-if="errorText" class="rounded-[var(--radius-base)] border border-red-200 bg-red-50 p-6 text-red-700">{{ errorText }}</div>

      <template v-else>
        <div class="w-full rounded-[var(--radius-base)] border">
          <table class="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th class="border-b px-3 py-2 text-left">Товар</th>
                <th class="border-b px-3 py-2 text-left">Поставщик</th>
                <th class="border-b px-3 py-2 text-left">Мин.заказ</th>
                <th class="border-b px-3 py-2 text-left">Потребность</th>
                <th class="border-b px-3 py-2 text-left">Добавить</th>
                <th class="border-b px-3 py-2 text-left">Итого</th>
                <th class="border-b px-3 py-2 text-left">Цена</th>
                <th class="border-b px-3 py-2 text-left">Сумма</th>
              </tr>
            </thead>
            <Transition name="table-fade" mode="out-in">
              <TableSkeletonRows v-if="showSkeleton" key="loading" :columns="8" :rows="4" />
              <tbody v-else-if="items.length" key="rows">
                <tr v-for="item in items" :key="item.id">
                  <td class="border-b px-3 py-2">{{ item.name }}</td>
                  <td class="border-b px-3 py-2">{{ item.supplier_name || '-' }}</td>
                  <td class="border-b px-3 py-2">{{ item.min_count }}</td>
                  <td class="border-b px-3 py-2">{{ item.needed }}</td>
                  <td class="border-b px-3 py-2">
                    <input v-model.number="edits[item.id]" class="w-24 rounded border px-2 py-1" type="number" min="0" :disabled="order?.is_approved || isLoading" />
                  </td>
                  <td class="border-b px-3 py-2">{{ ceilByMultiplicity(item.needed + (edits[item.id] ?? item.additional), item.min_count) }}</td>
                  <td class="border-b px-3 py-2">{{ formatMoney(item.price) }}</td>
                  <td class="border-b px-3 py-2">{{ formatMoney(ceilByMultiplicity(item.needed + (edits[item.id] ?? item.additional), item.min_count) * item.price) }}</td>
                </tr>
              </tbody>
              <tbody v-else-if="isLoading" key="pending" />
              <TableNotFoundRow v-else key="empty" :colspan="8" />
            </Transition>
          </table>
        </div>

        <div class="flex items-center gap-2">
          <TransparentButton :disabled="!order || order.is_approved || isLoading || !items.length" @click="save">Сохранить</TransparentButton>
          <ColoredButton :disabled="!order || order.is_approved || isLoading || !items.length" @click="approve">Принять</ColoredButton>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import TableSkeletonRows from '@/components/shared/Table/TableSkeletonRows.vue'
import TableNotFoundRow from '@/components/shared/Table/TableNotFoundRow.vue'
import { useDelayedSkeleton } from '@/shared/composables/useDelayedSkeleton'
import ColoredButton from '@/shared/ui/button/ColoredButton.vue'
import TransparentButton from '@/shared/ui/button/TransparentButton.vue'
import { ordersService } from '@/modules/orders/api/orders.service'
import { formatMoney } from '@/lib/format'
import { ceilByMultiplicity } from '@/lib/math'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.path.endsWith('/new'))
const order = computed<any>(() => state.order)
const items = computed(() => order.value?.items ?? [])
const edits = reactive<Record<number, number>>({})
const isLoading = ref(false)
const errorText = ref('')
const showSkeleton = useDelayedSkeleton(() => isLoading.value)

const state = reactive<{ order: any | null }>({ order: null })

async function loadOrder() {
  isLoading.value = true
  errorText.value = ''

  try {
    if (isNew.value) {
      const ids = String(route.query.ids ?? '').split(',').filter(Boolean).map(Number)
      state.order = await ordersService.create({ observable_ids: ids })
      await router.replace(`/orders/${state.order.id}`)
      return
    }

    state.order = await ordersService.get(String(route.params.id))
    Object.keys(edits).forEach((key) => delete edits[Number(key)])
    items.value.forEach((item: any) => {
      edits[item.id] = item.additional
    })
  } catch (error) {
    errorText.value = (error as Error).message || 'Не удалось загрузить заказ'
  } finally {
    isLoading.value = false
  }
}

watch(() => route.fullPath, () => {
  void loadOrder()
}, { immediate: true })

async function save() {
  if (!order.value) return
  await ordersService.update(order.value.id, {
    items: items.value.map((x: any) => ({ id: x.id, additional: edits[x.id] ?? x.additional })),
  })
  await loadOrder()
  toast.success('Изменения сохранены')
}

async function approve() {
  if (!order.value) return
  await ordersService.approve(order.value.id)
  await loadOrder()
  toast.success('Заказ утвержден')
}
</script>