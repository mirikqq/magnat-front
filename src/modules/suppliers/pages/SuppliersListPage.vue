<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Поставщики</h1>
      <RouterLink class="rounded-md border px-3 py-2" to="/suppliers/new">Создать поставщика</RouterLink>
    </div>

    <input v-model="search" placeholder="Поиск по названию" class="w-full rounded-md border px-3 py-2" />

    <table class="min-w-full border-collapse text-sm">
      <thead>
        <tr>
          <th class="border-b px-3 py-2 text-left">ID</th>
          <th class="border-b px-3 py-2 text-left">Наименование</th>
          <th class="border-b px-3 py-2 text-left">Удалить</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="border-b px-3 py-2">{{ row.id }}</td>
          <td class="border-b px-3 py-2"><RouterLink :to="`/suppliers/${row.id}`">{{ row.name }}</RouterLink></td>
          <td class="border-b px-3 py-2"><button class="rounded-md border px-2 py-1 text-red-600" @click="remove(row.id)">Удалить</button></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { suppliersService } from '@/modules/suppliers/api/suppliers.service';

const search = ref('');
const query = useAppQuery({ key: computed(() => queryKeys.suppliers(search.value)), query: () => suppliersService.list(search.value) });
const rows = computed(() => query.data.value ?? []);

watch(search, () => void query.refetch());

async function remove(id: number) {
  if (!confirm('Удалить поставщика?')) return;
  await suppliersService.remove(id);
  await query.refetch();
  toast.success('Поставщик удален');
}
</script>


