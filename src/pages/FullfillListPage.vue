<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">Задания ФФ</h1>
    <RouterLink class="inline-block rounded-md border px-3 py-2" to="/fullfill/new?mp=ozon">Создать</RouterLink>

    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr>
          <th class="border-b px-3 py-2 text-left">Номер</th>
          <th class="border-b px-3 py-2 text-left">Создано</th>
          <th class="border-b px-3 py-2 text-left">Изменено</th>
          <th class="border-b px-3 py-2 text-left">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="border-b px-3 py-2"><RouterLink :to="`/fullfill/${row.id}`">{{ row.id }} (Ozon)</RouterLink></td>
          <td class="border-b px-3 py-2">{{ formatDate(row.created_at) }}</td>
          <td class="border-b px-3 py-2">{{ formatDate(row.updated_at) }}</td>
          <td class="border-b px-3 py-2">
            <button class="rounded-md border px-2 py-1" @click="setInWay(row.id)">В пути</button>
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
import { useAppQuery } from '@/shared/api/colada';
import { queryKeys } from '@/shared/api/queryKeys';
import { fullfillService } from '@/shared/api/services/fullfill';
import { formatDate } from '@/shared/lib/format';

const query = useAppQuery({ key: queryKeys.fullfill, query: () => fullfillService.list() });
const rows = computed(() => query.data.value ?? []);

async function remove(id: number) {
  if (!confirm('Удалить задание?')) return;
  await fullfillService.remove(id);
  await query.refetch();
  toast.success('Удалено');
}

async function setInWay(id: number) {
  await fullfillService.updateDelivery(id, { warehouses: [{ warehouse_name: 'Москва', in_delivery: true }] });
  toast.success('Статус в пути обновлен');
}
</script>
