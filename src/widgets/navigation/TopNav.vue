<template>
  <div class="flex flex-wrap items-center gap-2 text-sm">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">
      {{ item.label }}
    </RouterLink>
    <span class="ml-auto rounded-md bg-slate-100 px-2 py-1 text-slate-600">MAGNAT</span>
  </div>
</template>

<script setup lang="ts">
const items = [
  { label: 'Потребность', to: '/needed' },
  { label: 'Заказы', to: '/orders' },
  { label: 'В пути', to: '/inway' },
  { label: 'Остатки ФФ', to: '/fullfillstock' },
  { label: 'Задания ФФ', to: '/fullfill' },
  { label: 'Поставщики', to: '/suppliers' },
  { label: 'Склады', to: '/warehouses/ozon' },
  { label: 'Настройка товаров', to: '/item_settings' },
  { label: 'DataLens', to: '/analytics' },
];
</script>
