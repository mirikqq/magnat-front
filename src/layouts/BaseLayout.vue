<template>
  <div class="min-h-screen bg-[color:var(--page-bg)] text-slate-900">
    <div class="mx-auto flex min-h-screen max-w-[1824px] flex-col gap-[var(--space-1)] p-[var(--space-1)]">
      <header class="relative z-[120] rounded-[var(--radius-base)] border border-white/70 bg-white/88 px-[var(--tile-padding)] py-3 shadow-[var(--shadow-card)] backdrop-blur-sm">
        <TopNav />
      </header>

      <main class="relative z-0 flex-1 min-w-0 overflow-visible">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/shared/TopNav/TopNav.vue'
</script>