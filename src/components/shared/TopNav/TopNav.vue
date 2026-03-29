<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0f172a,#334155)] text-sm font-semibold tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
        MP
      </div>
      <div>
        <p class="font-caption text-[11px] uppercase tracking-[0.28em] text-slate-500">MPSales v2</p>
        <h1 class="font-heading text-[24px] font-semibold text-slate-900">Управление поставками MAGNAT</h1>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <RouterLink
        v-for="item in sideMenuRoutes"
        :key="item.path"
        :to="item.path"
        class="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-[1px] hover:border-slate-300 hover:text-slate-950"
        active-class="!border-slate-900 !bg-slate-900 !text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
      >
        {{ item.label }}
      </RouterLink>
      <div class="ml-0 rounded-2xl border border-cyan-200/60 bg-cyan-50/80 px-4 py-2 text-right lg:ml-2">
        <p class="font-caption text-[10px] uppercase tracking-[0.24em] text-cyan-700">Кабинет</p>
        <p class="font-heading text-sm font-semibold text-slate-900">MAGNAT</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sideMenuRoutes } from '@/router/sidemenu'
</script>
