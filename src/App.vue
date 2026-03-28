<template>
  <AppShell>
    <RouterView />
  </AppShell>
  <AppToaster rich-colors position="bottom-right" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppShell from '@/app/layouts/AppShell.vue';
</script>
