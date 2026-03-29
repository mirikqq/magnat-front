<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Заказы поставщикам</h1>
      <RouterLink class="rounded-md border px-3 py-2" to="/orders/new">Создать</RouterLink>
    </div>

    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr>
          <th class="border-b px-3 py-2 text-left">Номер</th>
          <th class="border-b px-3 py-2 text-left">Дата создания</th>
          <th class="border-b px-3 py-2 text-left">Дата редактирования</th>
          <th class="border-b px-3 py-2 text-left">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sortedOrders" :key="row.id" class="hover:bg-slate-50">
          <td class="border-b px-3 py-2">
            <RouterLink :to="`/orders/${row.id}`">{{ row.id }}</RouterLink>
          </td>
          <td class="border-b px-3 py-2">{{ formatDate(row.created_at) }}</td>
          <td class="border-b px-3 py-2">{{ formatDate(row.updated_at) }}</td>
          <td class="border-b px-3 py-2">
            <button class="rounded-md border px-2 py-1 text-red-600" @click="remove(row.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toast } from 'vue-sonner';

import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { ordersService } from '@/modules/orders/api/orders.service';
import { formatDate } from '@/lib/format';

const query = useAppQuery({
  key: queryKeys.orders,
  query: () => ordersService.list(),
});

const sortedOrders = computed(() => [...(query.data.value ?? [])].sort((a, b) => b.id - a.id));

async function remove(id: number) {
  if (!confirm('Удалить заказ?')) return;
  await ordersService.remove(id);
  await query.refetch();
  toast.success('Заказ удален');
}
</script>



