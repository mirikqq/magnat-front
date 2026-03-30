<template>
  <div ref="rootRef" class="relative z-10 flex min-w-0 gap-4 overflow-visible items-center">
    <div
      ref="brandRef"
      class="shrink-0 py-[8px] px-[12px] whitespace-nowrap flex items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0f172a,#334155)] text-sm font-semibold tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]"
    >
      MAGNAT
    </div>

    <div class="ml-auto min-w-0 flex-1">
      <div v-if="showInlineLinks" class="flex min-w-0 items-center justify-end gap-2 overflow-visible whitespace-nowrap">
        <RouterLink
          v-for="item in sideMenuRoutes"
          :key="item.path"
          :to="item.path"
          class="h-[36px] inline-flex shrink-0 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-[1px] hover:border-slate-300 hover:text-slate-950"
          active-class="!border-slate-900 !bg-slate-900 !text-white"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div v-else class="flex items-center justify-end">
        <div class="relative z-[120]">
          <button
            ref="menuButtonRef"
            type="button"
            class="py-[8px] px-[12px] h-[36px] px inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/92 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:border-slate-300 hover:text-slate-950"
            :class="{ '!border-slate-900 !bg-slate-900 !text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]': hasActiveRoute || menuOpen }"
            @click="menuOpen = !menuOpen"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            <span>Меню</span>
          </button>

          <div
            v-if="menuOpen"
            class="absolute right-0 top-[calc(100%+8px)] z-[140] min-w-[280px] rounded-[24px] border border-slate-200/90 bg-white p-2 shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
          >
            <RouterLink
              v-for="item in sideMenuRoutes"
              :key="item.path"
              :to="item.path"
              class="flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              :class="isActive(item.path) ? 'bg-slate-900 text-white hover:bg-slate-900 hover:text-white' : ''"
              @click="menuOpen = false"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="pointer-events-none fixed left-[-9999px] top-[-9999px] opacity-0">
      <div ref="measureLinksRef" class="flex items-center gap-2 whitespace-nowrap">
        <div
          v-for="item in sideMenuRoutes"
          :key="`measure-${item.path}`"
          class="inline-flex shrink-0 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium"
        >
          {{ item.label }}
        </div>
      </div>
      <div ref="measureMenuRef" class="mt-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/92 px-4 py-2 text-sm font-medium">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        <span>Меню</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { sideMenuRoutes } from '@/router/sidemenu'

const route = useRoute()
const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
const brandRef = useTemplateRef<HTMLDivElement>('brandRef')
const measureLinksRef = useTemplateRef<HTMLDivElement>('measureLinksRef')
const measureMenuRef = useTemplateRef<HTMLDivElement>('measureMenuRef')
const menuOpen = ref(false)
const showInlineLinks = ref(true)

let resizeObserver: ResizeObserver | null = null

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const hasActiveRoute = computed(() => sideMenuRoutes.some((item) => isActive(item.path)))

function recomputeNavigationMode() {
  const rootWidth = rootRef.value?.clientWidth ?? 0
  const brandWidth = brandRef.value?.offsetWidth ?? 0
  const linksWidth = measureLinksRef.value?.offsetWidth ?? 0
  const menuWidth = measureMenuRef.value?.offsetWidth ?? 0

  if (!rootWidth || !brandWidth) {
    showInlineLinks.value = true
    return
  }

  const gap = 16
  const available = rootWidth - brandWidth - gap

  showInlineLinks.value = linksWidth <= available || menuWidth > available

  if (showInlineLinks.value) {
    menuOpen.value = false
  }
}

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node | null
  if (!menuOpen.value || !target) return

  const root = rootRef.value
  if (root && !root.contains(target)) {
    menuOpen.value = false
  }
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
  void nextTick(recomputeNavigationMode)
})

onMounted(async () => {
  await nextTick()
  recomputeNavigationMode()

  resizeObserver = new ResizeObserver(() => {
    recomputeNavigationMode()
  })

  if (rootRef.value) {
    resizeObserver.observe(rootRef.value)
  }

  window.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('pointerdown', onPointerDown)
})
</script>
