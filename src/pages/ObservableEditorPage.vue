<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">{{ isNew ? 'Новое наименование' : `Наименование #${id}` }}</h1>

    <div class="grid gap-3 md:grid-cols-2">
      <label class="space-y-1">
        <span class="text-sm">Поставщик</span>
        <select v-model.number="form.supplier_id" class="w-full rounded-md border px-3 py-2">
          <option v-for="item in suppliers" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label class="space-y-1">
        <span class="text-sm">Наименование</span>
        <input v-model="form.name" class="w-full rounded-md border px-3 py-2" />
      </label>
      <label class="space-y-1">
        <span class="text-sm">Цена</span>
        <input v-model.number="form.price" class="w-full rounded-md border px-3 py-2" type="number" min="0" step="0.01" />
      </label>
      <label class="space-y-1">
        <span class="text-sm">Минимальный закуп</span>
        <input v-model.number="form.min_count" class="w-full rounded-md border px-3 py-2" type="number" min="1" />
      </label>
    </div>

    <div class="flex items-center gap-2">
      <button class="rounded-md bg-teal-700 px-3 py-2 text-white" @click="save">Сохранить</button>
      <button class="rounded-md border px-3 py-2 text-red-700" @click="remove" v-if="!isNew">Удалить</button>
      <RouterLink class="rounded-md border px-3 py-2" to="/analytics">Аналитика</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import { observablesService } from '@/shared/api/services/observables';
import { suppliersService } from '@/shared/api/services/suppliers';

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? 'new'));
const isNew = computed(() => id.value === 'new');

const form = reactive({ supplier_id: 1, name: '', price: 0, min_count: 1 });
const suppliers = reactive<Array<{ id: number; name: string }>>([]);

watchEffect(async () => {
  const list = await suppliersService.list('');
  suppliers.splice(0, suppliers.length, ...list);

  if (!isNew.value) {
    const row = await observablesService.get(id.value);
    form.supplier_id = row.supplier_id;
    form.name = row.name;
    form.price = row.price;
    form.min_count = row.min_count;
  }
});

async function save() {
  if (isNew.value) {
    const created = await observablesService.create({ ...form });
    router.replace(`/observable/${created.id}`);
  } else {
    await observablesService.update(id.value, { ...form });
  }
  toast.success('Сохранено');
}

async function remove() {
  if (!confirm('Удалить наименование?')) return;
  await observablesService.remove(id.value);
  router.push('/item_settings');
  toast.success('Удалено');
}
</script>
