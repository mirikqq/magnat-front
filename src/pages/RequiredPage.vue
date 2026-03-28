<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">Не отслеживаемые</h1>
    <p class="text-slate-600">Товары из архива, не привязанные к наименованиям.</p>
    <button class="rounded-md border px-3 py-2" @click="restore">Восстановить из архива</button>
  </section>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';
import { http } from '@/shared/api/http/client';

async function restore() {
  await http('/catalog/1/restore', { method: 'POST' });
  toast.success('Товар восстановлен');
}
</script>
