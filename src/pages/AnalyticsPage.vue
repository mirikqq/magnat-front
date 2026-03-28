<template>
  <section class="page space-y-4">
    <h1 class="text-2xl font-semibold">Аналитика</h1>
    <iframe :src="env.datalensUrl" class="h-[70vh] w-full rounded-md border" title="DataLens" />
  </section>
</template>

<script setup lang="ts">
import { env } from '@/shared/config/env';
</script>
