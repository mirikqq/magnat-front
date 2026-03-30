<template>
  <tbody>
    <tr v-for="index in rows" :key="`manual-skeleton-${index}`" class="pointer-events-none">
      <td v-for="column in columns" :key="`${index}-${column}`" class="border-b px-3 py-3 align-top">
        <div class="h-6 w-full animate-pulse rounded-md bg-slate-200/80" />
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    columns: number
    rows?: number
  }>(),
  {
    rows: 3,
  },
)
</script>
