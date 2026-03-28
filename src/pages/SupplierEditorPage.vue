<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">{{ isNew ? 'Создать поставщика' : `Поставщик #${id}` }}</h1>
    <input v-model="name" class="w-full rounded-md border px-3 py-2" placeholder="Наименование" />
    <button class="rounded-md bg-teal-700 px-3 py-2 text-white" @click="save">Сохранить</button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { suppliersService } from '@/shared/api/services/suppliers';

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? 'new'));
const isNew = computed(() => id.value === 'new');
const name = ref('');

watchEffect(async () => {
  if (!isNew.value) {
    const row = await suppliersService.get(id.value);
    name.value = row.name;
  }
});

async function save() {
  if (!name.value.trim()) return;
  if (isNew.value) {
    const created = await suppliersService.create({ name: name.value });
    router.replace(`/suppliers/${created.id}`);
  } else {
    await suppliersService.update(id.value, { name: name.value });
  }
  toast.success('Сохранено');
}
</script>
