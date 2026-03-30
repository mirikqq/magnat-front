<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">{{ isNew ? 'Создать поставщика' : `Поставщик #${id}` }}</h1>

    <div v-if="isLoading" class="rounded-2xl border border-dashed p-6 text-slate-500">Загрузка поставщика...</div>
    <div v-else-if="errorText" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{{ errorText }}</div>

    <template v-else>
      <input v-model="name" class="w-full rounded-md border px-2.5 py-1.5 text-sm" placeholder="Наименование" />
      <button class="rounded-md bg-slate-900 px-2.5 py-1.5 text-sm text-white" @click="save">Сохранить</button>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { suppliersService } from '@/modules/suppliers/api/suppliers.service';

const route = useRoute();
const router = useRouter();
const id = computed(() => String(route.params.id ?? 'new'));
const isNew = computed(() => id.value === 'new');
const name = ref('');
const isLoading = ref(false);
const errorText = ref('');

async function loadSupplier() {
  if (isNew.value) {
    name.value = '';
    errorText.value = '';
    return;
  }

  isLoading.value = true;
  errorText.value = '';
  try {
    const row = await suppliersService.get(id.value);
    name.value = row.name;
  } catch (error) {
    errorText.value = (error as Error).message || 'Не удалось загрузить поставщика';
  } finally {
    isLoading.value = false;
  }
}

watch(() => route.fullPath, () => {
  void loadSupplier();
}, { immediate: true });

async function save() {
  if (!name.value.trim()) return;
  if (isNew.value) {
    const created = await suppliersService.create({ name: name.value });
    await router.replace(`/suppliers/${created.id}`);
  } else {
    await suppliersService.update(id.value, { name: name.value });
  }
  toast.success('Сохранено');
}
</script>


