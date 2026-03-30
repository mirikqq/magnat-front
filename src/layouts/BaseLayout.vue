<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(215,224,235,0.9),_transparent_32%),linear-gradient(180deg,#f6f8fb_0%,#edf2f7_100%)] text-slate-900">
    <div class="mx-auto flex min-h-screen max-w-[1824px] flex-col px-5 py-5 lg:px-8">
      <header class="h-[72px] relative z-[80] mb-6 rounded-[28px] border border-white/60 bg-white/80 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <TopNav />
      </header>

      <main class="relative z-0 flex-1 overflow-visible">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNav from '@/components/shared/TopNav/TopNav.vue'
</script>
