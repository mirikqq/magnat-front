<template>
  <section class="page space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-caption text-[11px] uppercase tracking-[0.24em] text-slate-500">Fullfill</p>
        <h1 class="text-2xl font-semibold">Задания ФФ</h1>
      </div>
      <RouterLink class="inline-block rounded-2xl border px-3 py-2" to="/fullfill/new?mp=ozon">Создать</RouterLink>
    </div>

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
          <td class="border-b px-3 py-2"><RouterLink :to="`/fullfill/${row.id}`">{{ row.id }} ({{ row.mp?.toUpperCase() || 'OZON' }})</RouterLink></td>
          <td class="border-b px-3 py-2">{{ formatDate(row.created_at) }}</td>
          <td class="border-b px-3 py-2">{{ formatDate(row.updated_at) }}</td>
          <td class="border-b px-3 py-2">
            <div class="flex flex-wrap items-center gap-2">
              <button class="rounded-2xl border px-2 py-1" @click="openDelivery(row.id)">В пути</button>
              <button class="rounded-2xl border px-2 py-1 text-red-600" @click="remove(row.id)">Удалить</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="deliveryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" @click.self="closeDelivery">
      <div class="w-full max-w-2xl rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="font-caption text-[11px] uppercase tracking-[0.24em] text-slate-500">В пути</p>
            <h2 class="text-xl font-semibold">Задание #{{ activeDeliveryId }}</h2>
          </div>
          <button class="rounded-2xl border px-3 py-2" @click="closeDelivery">Закрыть</button>
        </div>

        <div v-if="deliveryLoading" class="rounded-2xl border border-dashed p-6 text-slate-500">Загрузка складов...</div>
        <div v-else class="space-y-3">
          <label v-for="item in deliveryDraft" :key="item.warehouse_name" class="flex items-center justify-between rounded-2xl border px-4 py-3">
            <span>{{ item.warehouse_name }}</span>
            <input v-model="item.in_delivery" type="checkbox" />
          </label>
        </div>

        <div class="mt-5 flex items-center gap-2">
          <button class="rounded-2xl bg-slate-900 px-4 py-2 text-white" @click="saveDelivery">Сохранить</button>
          <button class="rounded-2xl border px-4 py-2" @click="closeDelivery">Отмена</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAppQuery } from '@/shared/composables/useAppQuery';
import { queryKeys } from '@/shared/composables/queryKeys';
import { fullfillService } from '@/modules/fullfill/api/fullfill.service';
import { formatDate } from '@/lib/format';

const query = useAppQuery({ key: queryKeys.fullfill, query: () => fullfillService.list() });
const rows = computed(() => query.data.value ?? []);
const deliveryModalOpen = ref(false);
const deliveryLoading = ref(false);
const activeDeliveryId = ref<number | null>(null);
const deliveryDraft = ref<Array<{ warehouse_name: string; in_delivery: boolean }>>([]);

async function remove(id: number) {
  if (!confirm('Удалить задание?')) return;
  await fullfillService.remove(id);
  await query.refetch();
  toast.success('Удалено');
}

async function openDelivery(id: number) {
  activeDeliveryId.value = id;
  deliveryModalOpen.value = true;
  deliveryLoading.value = true;
  try {
    const response = await fullfillService.delivery(id);
    if (Array.isArray(response)) {
      deliveryDraft.value = response.map((item) => ({ ...item }));
    } else {
      deliveryDraft.value = Object.entries(response.warehouses ?? {}).map(([warehouse_name, in_delivery]) => ({ warehouse_name, in_delivery: Boolean(in_delivery) }));
    }
  } finally {
    deliveryLoading.value = false;
  }
}

function closeDelivery() {
  deliveryModalOpen.value = false;
  activeDeliveryId.value = null;
  deliveryDraft.value = [];
}

async function saveDelivery() {
  if (!activeDeliveryId.value) return;
  await fullfillService.updateDelivery(activeDeliveryId.value, { warehouses: deliveryDraft.value });
  toast.success('Статусы в пути обновлены');
  closeDelivery();
}
</script>
