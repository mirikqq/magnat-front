<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">{{ isNew ? 'Новое наименование' : `Наименование #${id}` }}</h1>
    <div class="rounded-[24px] border border-amber-200 bg-amber-50/80 p-5 text-amber-900">
      <p class="font-medium">Карточка наименования пока недоступна в текущем API-контракте.</p>
      <p class="mt-2 text-sm text-amber-800/80">
        В опубликованных generated типах сейчас нет ручек для чтения и сохранения наименований.
        Как только backend добавит эти endpoints в Swagger, мы сразу подключим полноценный CRUD на этой странице.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => String(route.params.id ?? 'new'));
const isNew = computed(() => id.value === 'new');
</script>


