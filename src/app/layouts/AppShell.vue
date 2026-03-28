<template>
  <div class="min-h-screen">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav class="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-4">
        <div class="text-xl font-bold text-teal-700">MPSales</div>
        <TopNav />
      </nav>
    </header>
    <main class="mx-auto max-w-[1400px] px-6 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import TopNav from '@/widgets/navigation/TopNav.vue';
</script>
