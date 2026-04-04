<template>
  <tbody>
    <tr>
      <td :colspan="colspan" class="px-3 py-10 text-center text-sm text-slate-500">
        Не найдено.
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
defineProps<{
  colspan: number
}>()
</script>